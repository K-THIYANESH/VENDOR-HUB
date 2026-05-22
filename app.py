import os
from datetime import timedelta

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config.db import db
from routes.admin import admin_bp
from routes.ai import ai_bp
from routes.auth import auth_bp
from routes.cart import cart_bp
from routes.orders import orders_bp
from routes.products import products_bp
from routes.seller import seller_bp

import logging
from logging.handlers import RotatingFileHandler
from middleware.security import security_before_request, security_after_request

load_dotenv()

app = Flask(__name__)

# Enable CORS with credentials support for cookie-based refreshing
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
CORS(app, supports_credentials=True, origins=[
    "http://localhost:5173",
    "http://localhost:5000",
    frontend_url,
    "https://vendor-hub-93o2.onrender.com"
])

# ---------------------------------------------------
# Rotating security logs
# ---------------------------------------------------
if not os.path.exists("logs"):
    os.makedirs("logs")
file_handler = RotatingFileHandler("logs/security.log", maxBytes=1024*1024, backupCount=5)
file_handler.setFormatter(logging.Formatter(
    '%(asctime)s %(levelname)s: %(message)s'
))
file_handler.setLevel(logging.INFO)
app.logger.addHandler(file_handler)
app.logger.setLevel(logging.INFO)

# Register security hooks
app.before_request(security_before_request)
app.after_request(security_after_request)

# ---------------------------------------------------
# JWT Config
# ---------------------------------------------------
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY") or "secure-fallback-key-10293"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=7)
app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]
is_prod = os.getenv("FLASK_ENV") == "production" or os.getenv("ENV") == "production"
app.config["JWT_COOKIE_SECURE"] = is_prod
app.config["JWT_COOKIE_SAMESITE"] = "None" if is_prod else "Lax"
app.config["JWT_COOKIE_CSRF_PROTECT"] = False  # Bearer token/HttpOnly isolation
app.config["JWT_REFRESH_COOKIE_PATH"] = "/api/auth/refresh"
app.config["JWT_REFRESH_COOKIE_NAME"] = "refresh_token"

jwt = JWTManager(app)



# ---------------------------------------------------
# Register Blueprints
# ---------------------------------------------------
app.register_blueprint(auth_bp)

app.register_blueprint(products_bp)

app.register_blueprint(cart_bp)

app.register_blueprint(orders_bp)

app.register_blueprint(admin_bp)

app.register_blueprint(seller_bp)

app.register_blueprint(ai_bp)


# ---------------------------------------------------
# Home Route
# ---------------------------------------------------
@app.route("/")
def home():

    return {"message": "VendorHub Backend Running"}


# ---------------------------------------------------
# Database Test
# ---------------------------------------------------
@app.route("/db-test")
def db_test():

    try:
        db.command("ping")

        return {"message": "MongoDB Connected"}

    except Exception as e:
        return {"error": str(e)}, 500


# ---------------------------------------------------
# Error Handlers
# ---------------------------------------------------
@app.errorhandler(404)
def not_found(error):

    return {"error": "Route not found"}, 404


@app.errorhandler(500)
def internal_error(error):

    return {"error": "Internal server error"}, 500


# ---------------------------------------------------
# Main
# ---------------------------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
