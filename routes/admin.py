from bson import ObjectId
from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from middleware.auth_middleware import role_required

from config.db import db
from utils.objectid import is_valid_objectid

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

users = db.users
products = db.products
orders = db.orders
settings = db.settings

# ---------------------------------------------------
# Check Admin
# ---------------------------------------------------
def is_admin(user_id):
    if not is_valid_objectid(user_id):
        return False
    user = users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return False
    return user["role"] == "admin"


# ---------------------------------------------------
# Get Pending Vendors
# ---------------------------------------------------
@admin_bp.route("/pending-vendors", methods=["GET"])
@role_required("admin")
def pending_vendors():
    vendor_list = []
    for vendor in users.find({"role": "seller", "vendorApproved": False}):
        vendor["_id"] = str(vendor["_id"])
        vendor["password"] = ""
        vendor_list.append(vendor)
    return vendor_list


# ---------------------------------------------------
# Approve Vendor
# ---------------------------------------------------
@admin_bp.route("/approve-vendor/<vendor_id>", methods=["PUT"])
@role_required("admin")
def approve_vendor(vendor_id):
    if not is_valid_objectid(vendor_id):
        return {"error": "Invalid vendor id"}, 400

    vendor = users.find_one({"_id": ObjectId(vendor_id)})
    if not vendor:
        return {"error": "Vendor not found"}, 404

    users.update_one({"_id": ObjectId(vendor_id)}, {"$set": {"vendorApproved": True}})
    return {"message": "Vendor approved"}



# ---------------------------------------------------
# Reject Vendor
# ---------------------------------------------------
@admin_bp.route("/reject-vendor/<vendor_id>", methods=["DELETE"])
@role_required("admin")
def reject_vendor(vendor_id):
    if not is_valid_objectid(vendor_id):
        return {"error": "Invalid vendor id"}, 400

    vendor = users.find_one({"_id": ObjectId(vendor_id)})
    if not vendor:
        return {"error": "Vendor not found"}, 404

    users.delete_one({"_id": ObjectId(vendor_id)})
    return {"message": "Vendor rejected"}


# ---------------------------------------------------
# Platform Analytics
# ---------------------------------------------------
@admin_bp.route("/analytics", methods=["GET"])
@role_required("admin")
def platform_analytics():
    total_users = users.count_documents({})
    total_sellers = users.count_documents({"role": "seller"})
    total_buyers = users.count_documents({"role": "buyer"})
    total_products = products.count_documents({})
    total_orders = orders.count_documents({})
    
    total_sales = 0
    for order in orders.find():
        total_sales += order["totalAmount"]

    top_categories = {}
    for product in products.find():
        category = product["category"]
        if category not in top_categories:
            top_categories[category] = 0
        top_categories[category] += 1

    return {
        "totalUsers": total_users,
        "totalSellers": total_sellers,
        "totalBuyers": total_buyers,
        "totalProducts": total_products,
        "totalOrders": total_orders,
        "totalSales": total_sales,
        "topCategories": top_categories,
    }


# ---------------------------------------------------
# Commission Settings
# ---------------------------------------------------
@admin_bp.route("/commission", methods=["POST"])
@role_required("admin")
def set_commission():
    data = request.json
    if "commissionPercent" not in data:
        return {"error": "commissionPercent is required"}, 400

    settings.update_one(
        {"type": "commission"},
        {"$set": {"commissionPercent": data["commissionPercent"]}},
        upsert=True,
    )
    return {"message": "Commission updated"}


# ---------------------------------------------------
# Get Commission
# ---------------------------------------------------
@admin_bp.route("/commission", methods=["GET"])
@role_required("admin")
def get_commission():
    commission = settings.find_one({"type": "commission"})
    if not commission:
        return {"commissionPercent": 10}
    return {"commissionPercent": commission["commissionPercent"]}


# ---------------------------------------------------
# Get Refund Requests
# ---------------------------------------------------
@admin_bp.route("/refund-requests", methods=["GET"])
@role_required("admin")
def refund_requests():
    refund_list = []
    for order in orders.find({"refundStatus": "Requested"}):
        order["_id"] = str(order["_id"])
        refund_list.append(order)
    return refund_list


# ---------------------------------------------------
# Approve Refund
# ---------------------------------------------------
@admin_bp.route("/approve-refund/<order_id>", methods=["PUT"])
@role_required("admin")
def approve_refund(order_id):
    if not is_valid_objectid(order_id):
        return {"error": "Invalid order id"}, 400

    order = orders.find_one({"_id": ObjectId(order_id)})
    if not order:
        return {"error": "Order not found"}, 404

    orders.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"refundStatus": "Approved", "paymentStatus": "Refunded"}},
    )
    return {"message": "Refund approved"}


# ---------------------------------------------------
# Reject Refund
# ---------------------------------------------------
@admin_bp.route("/reject-refund/<order_id>", methods=["PUT"])
@role_required("admin")
def reject_refund(order_id):
    if not is_valid_objectid(order_id):
        return {"error": "Invalid order id"}, 400

    order = orders.find_one({"_id": ObjectId(order_id)})
    if not order:
        return {"error": "Order not found"}, 404

    orders.update_one(
        {"_id": ObjectId(order_id)}, {"$set": {"refundStatus": "Rejected"}}
    )
    return {"message": "Refund rejected"}

