import json

from bson import ObjectId
from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from config.db import db
from services.gemini_service import model
from utils.objectid import is_valid_objectid
from middleware.security import rate_limit

ai_bp = Blueprint("ai", __name__, url_prefix="/api/ai")

products = db.products


# ---------------------------------------------------
# AI Product Description Generator
# ---------------------------------------------------
@ai_bp.route("/generate-description", methods=["POST"])
@jwt_required()
@rate_limit(limit=10, period=60)
def generate_description():

    data = request.json

    required_fields = ["productName"]

    for field in required_fields:
        if field not in data:
            return {"error": f"{field} is required"}, 400

    prompt = f"""
    Generate an ecommerce product description.

    Product:
    {data["productName"]}

    Return:
    1. Product title
    2. 5 bullet features
    3. Short description

    Keep it professional and concise.
    """

    try:
        response = model.generate_content(prompt)

        return {"result": response.text}

    except Exception as e:
        return {"error": str(e)}, 500


# ---------------------------------------------------
# Smart Search
# ---------------------------------------------------
@ai_bp.route("/smart-search", methods=["POST"])
@rate_limit(limit=20, period=60)
def smart_search():

    data = request.json

    if "query" not in data:
        return {"error": "query is required"}, 400

    user_query = data["query"]

    prompt = f"""
    Extract ecommerce search filters from this query.

    Query:
    {user_query}

    Return ONLY JSON.

    Example format:
    {{
        "keywords": "gaming keyboard",
        "maxPrice": 3000,
        "category": "Electronics"
    }}
    """

    try:
        response = model.generate_content(prompt)

        cleaned = response.text.replace("```json", "").replace("```", "").strip()

        parsed = json.loads(cleaned)

        mongo_query = {}

        # keyword search
        if parsed.get("keywords"):
            mongo_query["name"] = {"$regex": parsed["keywords"], "$options": "i"}

        # category
        if parsed.get("category"):
            mongo_query["category"] = {"$regex": parsed["category"], "$options": "i"}

        # price filter
        if parsed.get("maxPrice"):
            mongo_query["price"] = {"$lte": parsed["maxPrice"]}

        result = []

        for product in products.find(mongo_query):
            product["_id"] = str(product["_id"])

            result.append(product)

        return {"parsedQuery": parsed, "products": result}

    except Exception as e:
        return {"error": str(e)}, 500


# ---------------------------------------------------
# AI Recommendations
# ---------------------------------------------------
@ai_bp.route("/recommendations/<product_id>", methods=["GET"])
@rate_limit(limit=30, period=60)
def recommendations(product_id):

    if not is_valid_objectid(product_id):
        return {"error": "Invalid product id"}, 400

    product = products.find_one({"_id": ObjectId(product_id)})

    if not product:
        return {"error": "Product not found"}, 404

    category = product["category"]

    recommended_products = []

    related_products = (
        products.find({"category": category, "_id": {"$ne": ObjectId(product_id)}})
        .sort("rating", -1)
        .limit(6)
    )

    for item in related_products:
        item["_id"] = str(item["_id"])

        recommended_products.append(item)

    return {
        "basedOn": product["name"],
        "category": category,
        "recommendations": recommended_products,
    }
