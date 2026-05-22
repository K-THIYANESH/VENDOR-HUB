from datetime import datetime

from bson import ObjectId
from flask import Blueprint, request
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
)

from config.db import db
from services.razorpay_service import client
from utils.objectid import is_valid_objectid
from middleware.security import rate_limit

orders_bp = Blueprint("orders", __name__, url_prefix="/api/orders")

orders = db.orders

cart_collection = db.cart

products = db.products

users = db.users


# ---------------------------------------------------
# Create Order
# ---------------------------------------------------
@orders_bp.route("/create", methods=["POST"])
@jwt_required()
@rate_limit(limit=15, period=60)
def create_order():

    user_id = get_jwt_identity()

    data = request.json

    required_fields = ["address", "paymentMethod"]

    for field in required_fields:
        if field not in data:
            return {"error": f"{field} is required"}, 400

    cart = cart_collection.find_one({"userId": user_id})

    if not cart or not cart["items"]:
        return {"error": "Cart is empty"}, 400

    order_items = []

    total_amount = 0

    for item in cart["items"]:
        if not is_valid_objectid(item["productId"]):
            continue

        product = products.find_one({"_id": ObjectId(item["productId"])})

        if not product:
            continue

        quantity = item["quantity"]

        # stock check
        if product["stock"] < quantity:
            return {"error": f"Not enough stock for {product['name']}"}, 400

        subtotal = product["price"] * quantity

        total_amount += subtotal

        # reduce stock
        products.update_one({"_id": product["_id"]}, {"$inc": {"stock": -quantity}})

        order_items.append(
            {
                "productId": str(product["_id"]),
                "name": product["name"],
                "price": product["price"],
                "quantity": quantity,
                "subtotal": subtotal,
                "sellerId": product["sellerId"],
                "sellerName": product["sellerName"],
            }
        )

    if not order_items:
        return {"error": "No valid products found"}, 400

    order = {
        "buyerId": user_id,
        "items": order_items,
        "totalAmount": total_amount,
        "address": data["address"],
        "paymentMethod": data["paymentMethod"],
        "paymentStatus": "Pending",
        "orderStatus": "Placed",
        "refundStatus": None,
        "createdAt": datetime.utcnow(),
    }

    result = orders.insert_one(order)

    # clear cart
    cart_collection.update_one({"userId": user_id}, {"$set": {"items": []}})

    return {
        "message": "Order created successfully",
        "orderId": str(result.inserted_id),
    }, 201


# ---------------------------------------------------
# Razorpay Order
# ---------------------------------------------------
@orders_bp.route("/create-razorpay-order", methods=["POST"])
@jwt_required()
@rate_limit(limit=15, period=60)
def create_razorpay_order():

    data = request.json

    if "amount" not in data:
        return {"error": "amount is required"}, 400

    amount = int(float(data["amount"]) * 100)

    razorpay_order = client.order.create(
        {
            "amount": amount,
            "currency": "INR",
            "payment_capture": 1,
        }
    )

    return {
        "razorpayOrderId": razorpay_order["id"],
        "amount": razorpay_order["amount"],
        "currency": razorpay_order["currency"],
    }


# ---------------------------------------------------
# Verify Payment
# ---------------------------------------------------
@orders_bp.route("/verify-payment", methods=["POST"])
@jwt_required()
@rate_limit(limit=15, period=60)
def verify_payment():

    user_id = get_jwt_identity()

    data = request.json

    required_fields = [
        "orderId",
        "razorpay_order_id",
        "razorpay_payment_id",
        "razorpay_signature",
    ]

    for field in required_fields:
        if field not in data:
            return {"error": f"{field} is required"}, 400

    if not is_valid_objectid(data["orderId"]):
        return {"error": "Invalid order id"}, 400

    order = orders.find_one({"_id": ObjectId(data["orderId"])})

    if not order:
        return {"error": "Order not found"}, 404

    if order["buyerId"] != user_id:
        return {"error": "Unauthorized"}, 403

    try:
        client.utility.verify_payment_signature(
            {
                "razorpay_order_id": data["razorpay_order_id"],
                "razorpay_payment_id": data["razorpay_payment_id"],
                "razorpay_signature": data["razorpay_signature"],
            }
        )

        orders.update_one(
            {"_id": ObjectId(data["orderId"])}, {"$set": {"paymentStatus": "Paid"}}
        )

        return {"message": "Payment verified"}

    except Exception as e:
        return {"error": str(e)}, 400


# ---------------------------------------------------
# Buyer Orders
# ---------------------------------------------------
@orders_bp.route("/my-orders", methods=["GET"])
@jwt_required()
def buyer_orders():

    user_id = get_jwt_identity()

    buyer_order_list = []

    for order in orders.find({"buyerId": user_id}):
        order["_id"] = str(order["_id"])

        buyer_order_list.append(order)

    return buyer_order_list


# ---------------------------------------------------
# Seller Orders
# ---------------------------------------------------
@orders_bp.route("/seller-orders", methods=["GET"])
@jwt_required()
def seller_orders():

    user_id = get_jwt_identity()

    seller_order_list = []

    for order in orders.find():
        seller_items = []

        for item in order["items"]:
            if item["sellerId"] == user_id:
                seller_items.append(item)

        if seller_items:
            seller_order_list.append(
                {
                    "orderId": str(order["_id"]),
                    "items": seller_items,
                    "orderStatus": order["orderStatus"],
                    "paymentStatus": order["paymentStatus"],
                    "refundStatus": order.get("refundStatus"),
                    "createdAt": order["createdAt"],
                }
            )

    return seller_order_list


# ---------------------------------------------------
# Update Order Status
# ---------------------------------------------------
@orders_bp.route("/update-status/<order_id>", methods=["PUT"])
@jwt_required()
def update_order_status(order_id):

    user_id = get_jwt_identity()

    if not is_valid_objectid(order_id):
        return {"error": "Invalid order id"}, 400

    user = users.find_one({"_id": ObjectId(user_id)})

    if not user:
        return {"error": "User not found"}, 404

    if user["role"] != "seller":
        return {"error": "Only sellers can update orders"}, 403

    data = request.json

    if "status" not in data:
        return {"error": "status is required"}, 400

    allowed_statuses = [
        "Placed",
        "Confirmed",
        "Shipped",
        "Delivered",
    ]

    if data["status"] not in allowed_statuses:
        return {"error": "Invalid status"}, 400

    order = orders.find_one({"_id": ObjectId(order_id)})

    if not order:
        return {"error": "Order not found"}, 404

    seller_has_item = False

    for item in order["items"]:
        if item["sellerId"] == user_id:
            seller_has_item = True

            break

    if not seller_has_item:
        return {"error": "Unauthorized"}, 403

    orders.update_one(
        {"_id": ObjectId(order_id)}, {"$set": {"orderStatus": data["status"]}}
    )

    return {"message": "Order status updated"}


# ---------------------------------------------------
# Request Refund
# ---------------------------------------------------
@orders_bp.route("/refund/<order_id>", methods=["POST"])
@jwt_required()
def request_refund(order_id):

    user_id = get_jwt_identity()

    if not is_valid_objectid(order_id):
        return {"error": "Invalid order id"}, 400

    order = orders.find_one({"_id": ObjectId(order_id)})

    if not order:
        return {"error": "Order not found"}, 404

    if order["buyerId"] != user_id:
        return {"error": "Unauthorized"}, 403

    if order.get("refundStatus") == "Requested":
        return {"error": "Refund already requested"}, 400

    orders.update_one(
        {"_id": ObjectId(order_id)}, {"$set": {"refundStatus": "Requested"}}
    )

    return {"message": "Refund requested successfully"}
