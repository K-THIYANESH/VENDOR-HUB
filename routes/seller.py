from datetime import (
    datetime,
    timedelta,
)

from bson import ObjectId
from flask import Blueprint
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
)
from middleware.auth_middleware import role_required

from config.db import db
from utils.objectid import is_valid_objectid

seller_bp = Blueprint("seller", __name__, url_prefix="/api/seller")

users = db.users
products = db.products
orders = db.orders
settings = db.settings


# ---------------------------------------------------
# Check Seller Helper
# ---------------------------------------------------
def get_seller(user_id):
    if not is_valid_objectid(user_id):
        return None
    seller = users.find_one({"_id": ObjectId(user_id)})
    if not seller or seller["role"] != "seller":
        return None
    return seller


# ---------------------------------------------------
# Seller Dashboard
# ---------------------------------------------------
@seller_bp.route("/dashboard", methods=["GET"])
@role_required("seller")
def seller_dashboard():
    user_id = get_jwt_identity()

    seller_products = []
    total_products = 0
    total_orders = 0
    total_revenue = 0
    weekly_sales = 0
    week_ago = datetime.utcnow() - timedelta(days=7)

    for product in products.find({"sellerId": user_id}):
        product["_id"] = str(product["_id"])
        seller_products.append(product)
        total_products += 1

    for order in orders.find():
        for item in order["items"]:
            if item["sellerId"] == user_id:
                total_orders += 1
                total_revenue += item["subtotal"]
                if order["createdAt"] >= week_ago:
                    weekly_sales += item["subtotal"]

    return {
        "sellerName": users.find_one({"_id": ObjectId(user_id)})["name"],
        "totalProducts": total_products,
        "totalOrders": total_orders,
        "totalRevenue": total_revenue,
        "weeklySales": weekly_sales,
    }



# ---------------------------------------------------
# Top Selling Products
# ---------------------------------------------------
@seller_bp.route("/top-products", methods=["GET"])
@role_required("seller")
def top_products():
    user_id = get_jwt_identity()
    product_sales = {}

    for order in orders.find():
        for item in order["items"]:
            if item["sellerId"] == user_id:
                product_name = item["name"]
                if product_name not in product_sales:
                    product_sales[product_name] = 0
                product_sales[product_name] += item["quantity"]

    sorted_products = sorted(product_sales.items(), key=lambda x: x[1], reverse=True)
    result = []
    for name, quantity in sorted_products:
        result.append(
            {
                "productName": name,
                "unitsSold": quantity,
            }
        )
    return result


# ---------------------------------------------------
# Low Stock Alerts
# ---------------------------------------------------
@seller_bp.route("/low-stock", methods=["GET"])
@role_required("seller")
def low_stock_products():
    user_id = get_jwt_identity()
    low_stock = []

    for product in products.find({"sellerId": user_id}):
        if product["stock"] < 5:
            product["_id"] = str(product["_id"])
            low_stock.append(product)
    return low_stock


# ---------------------------------------------------
# Earnings
# ---------------------------------------------------
@seller_bp.route("/earnings", methods=["GET"])
@role_required("seller")
def seller_earnings():
    user_id = get_jwt_identity()
    total_earnings = 0

    for order in orders.find():
        for item in order["items"]:
            if item["sellerId"] == user_id:
                total_earnings += item["subtotal"]

    commission_data = settings.find_one({"type": "commission"})
    commission_percent = 10
    if commission_data:
        commission_percent = commission_data["commissionPercent"]

    commission_amount = total_earnings * commission_percent / 100
    payout = total_earnings - commission_amount

    return {
        "totalEarnings": total_earnings,
        "commissionPercent": commission_percent,
        "commissionAmount": commission_amount,
        "finalPayout": payout,
    }

