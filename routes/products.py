from bson import ObjectId
from flask import Blueprint, request
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
)
from middleware.auth_middleware import role_required

from config.db import db
from utils.objectid import is_valid_objectid

products_bp = Blueprint("products", __name__, url_prefix="/api/products")

products = db.products
users = db.users
reviews = db.reviews


# ---------------------------------------------------
# Add Product
# ---------------------------------------------------
@products_bp.route("/", methods=["POST"])
@role_required("seller")
def add_product():
    user_id = get_jwt_identity()
    user = users.find_one({"_id": ObjectId(user_id)})
    data = request.json


    required_fields = [
        "name",
        "description",
        "price",
        "stock",
        "category",
    ]

    for field in required_fields:
        if field not in data:
            return {"error": f"{field} is required"}, 400

    product = {
        "name": data["name"],
        "description": data["description"],
        "price": float(data["price"]),
        "stock": int(data["stock"]),
        "category": data["category"],
        "images": data.get("images", []),
        "sellerId": str(user["_id"]),
        "sellerName": user["name"],
        "rating": 0,
        "reviewsCount": 0,
    }

    result = products.insert_one(product)

    return {
        "message": "Product added successfully",
        "productId": str(result.inserted_id),
    }, 201


# ---------------------------------------------------
# Get All Products
# ---------------------------------------------------
@products_bp.route("/", methods=["GET"])
def get_products():

    category = request.args.get("category")

    search = request.args.get("search")

    query = {}

    if category:
        query["category"] = category

    if search:
        query["name"] = {"$regex": search, "$options": "i"}

    all_products = []

    for product in products.find(query):
        product["_id"] = str(product["_id"])

        all_products.append(product)

    return all_products


# ---------------------------------------------------
# Get Product By ID
# ---------------------------------------------------
@products_bp.route("/<product_id>", methods=["GET"])
def get_product(product_id):

    if not is_valid_objectid(product_id):
        return {"error": "Invalid product id"}, 400

    product = products.find_one({"_id": ObjectId(product_id)})

    if not product:
        return {"error": "Product not found"}, 404

    product["_id"] = str(product["_id"])

    return product


# ---------------------------------------------------
# Seller Products
# ---------------------------------------------------
@products_bp.route("/seller/my-products", methods=["GET"])
@jwt_required()
def get_seller_products():

    user_id = get_jwt_identity()

    seller_products = []

    for product in products.find({"sellerId": user_id}):
        product["_id"] = str(product["_id"])

        seller_products.append(product)

    return seller_products


# ---------------------------------------------------
# Update Product
# ---------------------------------------------------
@products_bp.route("/<product_id>", methods=["PUT"])
@role_required("seller")
def update_product(product_id):

    user_id = get_jwt_identity()

    if not is_valid_objectid(product_id):
        return {"error": "Invalid product id"}, 400

    product = products.find_one({"_id": ObjectId(product_id)})

    if not product:
        return {"error": "Product not found"}, 404

    if product["sellerId"] != user_id:
        return {"error": "Unauthorized"}, 403

    data = request.json

    updated_fields = {}

    allowed_fields = [
        "name",
        "description",
        "price",
        "stock",
        "category",
        "images",
    ]

    for field in allowed_fields:
        if field in data:
            if field == "price":
                updated_fields[field] = float(data[field])

            elif field == "stock":
                updated_fields[field] = int(data[field])

            else:
                updated_fields[field] = data[field]

    if not updated_fields:
        return {"error": "No valid fields provided"}, 400

    products.update_one({"_id": ObjectId(product_id)}, {"$set": updated_fields})

    return {"message": "Product updated successfully"}


# ---------------------------------------------------
# Delete Product
# ---------------------------------------------------
@products_bp.route("/<product_id>", methods=["DELETE"])
@role_required("seller")
def delete_product(product_id):

    user_id = get_jwt_identity()

    if not is_valid_objectid(product_id):
        return {"error": "Invalid product id"}, 400

    product = products.find_one({"_id": ObjectId(product_id)})

    if not product:
        return {"error": "Product not found"}, 404

    if product["sellerId"] != user_id:
        return {"error": "Unauthorized"}, 403

    products.delete_one({"_id": ObjectId(product_id)})

    return {"message": "Product deleted successfully"}


# ---------------------------------------------------
# Add Review
# ---------------------------------------------------
@products_bp.route("/review/<product_id>", methods=["POST"])
@jwt_required()
def add_review(product_id):

    user_id = get_jwt_identity()

    if not is_valid_objectid(product_id):
        return {"error": "Invalid product id"}, 400

    if not is_valid_objectid(user_id):
        return {"error": "Invalid user id"}, 400

    data = request.json

    required_fields = ["rating", "comment"]

    for field in required_fields:
        if field not in data:
            return {"error": f"{field} is required"}, 400

    product = products.find_one({"_id": ObjectId(product_id)})

    if not product:
        return {"error": "Product not found"}, 404

    existing_review = reviews.find_one(
        {
            "productId": product_id,
            "userId": user_id,
        }
    )

    if existing_review:
        return {"error": "You already reviewed this product"}, 400

    user = users.find_one({"_id": ObjectId(user_id)})

    review = {
        "productId": product_id,
        "userId": user_id,
        "userName": user["name"],
        "rating": float(data["rating"]),
        "comment": data["comment"],
    }

    reviews.insert_one(review)

    # recalculate ratings
    all_reviews = list(reviews.find({"productId": product_id}))

    total_rating = 0

    for r in all_reviews:
        total_rating += r["rating"]

    average_rating = total_rating / len(all_reviews)

    products.update_one(
        {"_id": ObjectId(product_id)},
        {
            "$set": {
                "rating": round(average_rating, 1),
                "reviewsCount": len(all_reviews),
            }
        },
    )

    return {"message": "Review added successfully"}


# ---------------------------------------------------
# Get Product Reviews
# ---------------------------------------------------
@products_bp.route("/reviews/<product_id>", methods=["GET"])
def get_reviews(product_id):

    if not is_valid_objectid(product_id):
        return {"error": "Invalid product id"}, 400

    product_reviews = []

    for review in reviews.find({"productId": product_id}):
        review["_id"] = str(review["_id"])

        product_reviews.append(review)

    return product_reviews
