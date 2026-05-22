from bson import ObjectId
from flask import Blueprint, request
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
)

from config.db import db
from utils.objectid import is_valid_objectid

cart_bp = Blueprint("cart", __name__, url_prefix="/api/cart")

cart_collection = db.cart

products = db.products


# ---------------------------------------------------
# Add To Cart
# ---------------------------------------------------
@cart_bp.route("/add", methods=["POST"])
@jwt_required()
def add_to_cart():

    user_id = get_jwt_identity()

    data = request.json

    required_fields = ["productId", "quantity"]

    for field in required_fields:
        if field not in data:
            return {"error": f"{field} is required"}, 400

    if not is_valid_objectid(data["productId"]):
        return {"error": "Invalid product id"}, 400

    product = products.find_one({"_id": ObjectId(data["productId"])})

    if not product:
        return {"error": "Product not found"}, 404

    cart = cart_collection.find_one({"userId": user_id})

    if not cart:
        cart_collection.insert_one({"userId": user_id, "items": []})

        cart = cart_collection.find_one({"userId": user_id})

    existing_item = None

    for item in cart["items"]:
        if item["productId"] == data["productId"]:
            existing_item = item

            break

    if existing_item:
        cart_collection.update_one(
            {"userId": user_id, "items.productId": data["productId"]},
            {"$inc": {"items.$.quantity": int(data["quantity"])}},
        )

    else:
        cart_collection.update_one(
            {"userId": user_id},
            {
                "$push": {
                    "items": {
                        "productId": data["productId"],
                        "quantity": int(data["quantity"]),
                    }
                }
            },
        )

    return {"message": "Product added to cart"}


# ---------------------------------------------------
# Get Cart
# ---------------------------------------------------
@cart_bp.route("/", methods=["GET"])
@jwt_required()
def get_cart():

    user_id = get_jwt_identity()

    cart = cart_collection.find_one({"userId": user_id})

    if not cart:
        return {"items": []}

    populated_items = []

    for item in cart["items"]:
        if not is_valid_objectid(item["productId"]):
            continue

        product = products.find_one({"_id": ObjectId(item["productId"])})

        if product:
            populated_items.append(
                {
                    "productId": str(product["_id"]),
                    "name": product["name"],
                    "price": product["price"],
                    "images": product.get("images", []),
                    "quantity": item["quantity"],
                }
            )

    return {"items": populated_items}


# ---------------------------------------------------
# Update Cart Quantity
# ---------------------------------------------------
@cart_bp.route("/update", methods=["PUT"])
@jwt_required()
def update_cart_quantity():

    user_id = get_jwt_identity()

    data = request.json

    required_fields = ["productId", "quantity"]

    for field in required_fields:
        if field not in data:
            return {"error": f"{field} is required"}, 400

    if not is_valid_objectid(data["productId"]):
        return {"error": "Invalid product id"}, 400

    cart_collection.update_one(
        {"userId": user_id, "items.productId": data["productId"]},
        {"$set": {"items.$.quantity": int(data["quantity"])}},
    )

    return {"message": "Cart updated"}


# ---------------------------------------------------
# Remove Item
# ---------------------------------------------------
@cart_bp.route("/remove/<product_id>", methods=["DELETE"])
@jwt_required()
def remove_item(product_id):

    user_id = get_jwt_identity()

    if not is_valid_objectid(product_id):
        return {"error": "Invalid product id"}, 400

    cart_collection.update_one(
        {"userId": user_id}, {"$pull": {"items": {"productId": product_id}}}
    )

    return {"message": "Item removed from cart"}


# ---------------------------------------------------
# Clear Cart
# ---------------------------------------------------
@cart_bp.route("/clear", methods=["DELETE"])
@jwt_required()
def clear_cart():

    user_id = get_jwt_identity()

    cart_collection.update_one({"userId": user_id}, {"$set": {"items": []}})

    return {"message": "Cart cleared"}
