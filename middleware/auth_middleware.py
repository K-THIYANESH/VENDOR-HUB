from functools import wraps
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from config.db import db
from utils.objectid import is_valid_objectid

users = db.users

def role_required(allowed_roles):
    """
    Validate that the authenticated user possesses the correct role permissions.
    """
    if isinstance(allowed_roles, str):
        allowed_roles = [allowed_roles]
        
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            user_id = get_jwt_identity()
            if not is_valid_objectid(user_id):
                return jsonify({"error": "Unauthorized access token"}), 401
                
            user = users.find_one({"_id": ObjectId(user_id)})
            if not user:
                return jsonify({"error": "User account not found"}), 401
                
            if user.get("role") not in allowed_roles:
                return jsonify({"error": "Forbidden - Insufficient permissions"}), 403
                
            # Prevent unapproved sellers from accessing operations
            if user.get("role") == "seller" and not user.get("vendorApproved", False):
                return jsonify({"error": "Forbidden - Seller account pending approval"}), 403
                
            return f(*args, **kwargs)
        return decorated_function
    return decorator

