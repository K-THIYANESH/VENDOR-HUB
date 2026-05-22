import bcrypt
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    set_refresh_cookies,
    unset_jwt_cookies,
    jwt_required,
    get_jwt_identity,
)
from config.db import db
from middleware.security import rate_limit

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

users = db.users

# ---------------------------------------------------
# Register
# ---------------------------------------------------
@auth_bp.route("/register", methods=["POST"])
@rate_limit(limit=10, period=60)
def register():
    data = request.json
    required_fields = ["username", "email", "password", "role"]

    for field in required_fields:
        if field not in data or not data[field]:
            return {"error": f"Missing field: {field}"}, 400

    allowed_roles = ["buyer", "seller", "admin"]
    if data["role"] not in allowed_roles:
        return {"error": "Invalid role specified"}, 400

    existing_user = users.find_one({"email": data["email"]})
    if existing_user:
        return {"error": "Email is already registered"}, 400

    hashed_password = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt())

    user = {
        "name": data["username"],
        "email": data["email"],
        "password": hashed_password.decode("utf-8"),
        "role": data["role"],
        "vendorApproved": data["role"] != "seller",
        "failedAttempts": 0,
        "lockoutUntil": None
    }

    users.insert_one(user)
    current_app.logger.info(f"SECURITY ALERT: New user registered - {data['email']} with role {data['role']}")

    return {"message": "User registered successfully"}, 201

# ---------------------------------------------------
# Login with Brute-Force Lockout
# ---------------------------------------------------
@auth_bp.route("/login", methods=["POST"])
@rate_limit(limit=10, period=60)
def login():
    data = request.json
    required_fields = ["email", "password"]

    for field in required_fields:
        if field not in data or not data[field]:
            return {"error": f"Missing field: {field}"}, 400

    user = users.find_one({"email": data["email"]})
    if not user:
        current_app.logger.warning(f"SECURITY ALERT: Failed login attempt (Non-existent user) - {data['email']}")
        return {"error": "Invalid email or password"}, 401

    # Check Lockout status
    now = datetime.utcnow()
    lockout_until = user.get("lockoutUntil")
    if lockout_until and lockout_until > now:
        remaining = int((lockout_until - now).total_seconds())
        current_app.logger.warning(f"SECURITY ALERT: Account lockout access attempt - {data['email']}")
        return {"error": f"Account locked due to consecutive failures. Try again in {remaining} seconds."}, 423

    valid_password = bcrypt.checkpw(
        data["password"].encode("utf-8"), user["password"].encode("utf-8")
    )

    if not valid_password:
        # Increment failed attempts
        attempts = user.get("failedAttempts", 0) + 1
        update_data = {"$set": {"failedAttempts": attempts}}
        if attempts >= 5:
            update_data["$set"]["lockoutUntil"] = now + timedelta(minutes=15)
            current_app.logger.warning(f"SECURITY ALERT: Account locked out - {data['email']}")
        users.update_one({"_id": user["_id"]}, update_data)
        
        current_app.logger.warning(f"SECURITY ALERT: Incorrect password attempt - {data['email']}")
        return {"error": "Invalid email or password"}, 401

    # Success: reset attempts
    users.update_one(
        {"_id": user["_id"]},
        {"$set": {"failedAttempts": 0, "lockoutUntil": None}}
    )

    # Generate tokens
    access_token = create_access_token(identity=str(user["_id"]))
    refresh_token = create_refresh_token(identity=str(user["_id"]))

    response = jsonify({
        "message": "Login successful",
        "token": access_token,
        "role": user["role"],
        "name": user["name"],
        "userId": str(user["_id"]),
    })
    
    # Store refresh token in secure HttpOnly cookie
    set_refresh_cookies(response, refresh_token)
    current_app.logger.info(f"SECURITY ALERT: User login successful - {data['email']}")
    
    return response

# ---------------------------------------------------
# Refresh Token Rotation
# ---------------------------------------------------
@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=user_id)
    return {"token": new_access_token}

# ---------------------------------------------------
# Logout
# ---------------------------------------------------
@auth_bp.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"message": "Logout successful"})
    unset_jwt_cookies(response)
    return response

