# Security architecture middleware
import time
from threading import Lock
from flask import request, abort, jsonify

# Thread-safe storage for rate limiting
_rate_limit_records = {}
_lock = Lock()

def sanitize_nosql(val):
    # Recursively check and prevent MongoDB operator injections
    if isinstance(val, dict):
        for k, v in list(val.items()):
            if isinstance(k, str) and (k.startswith('$') or '.' in k):
                abort(400, description=f"Malicious input key detected: {k}")
            sanitize_nosql(v)
    elif isinstance(val, list):
        for item in val:
            sanitize_nosql(item)

def security_before_request():
    # Enforce request payload size limit (2MB)
    if request.content_length and request.content_length > 2 * 1024 * 1024:
        abort(413, description="Payload too large (Max 2MB)")
    
    # Sanitize request parameters and body for NoSQL injection
    if request.is_json:
        body = request.get_json(silent=True)
        if body:
            sanitize_nosql(body)
    if request.args:
        sanitize_nosql(request.args.to_dict())
    if request.form:
        sanitize_nosql(request.form.to_dict())

def security_after_request(response):
    # Inject enterprise-grade security headers
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    
    # Strict Content Security Policy
    csp = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' data: https://fonts.gstatic.com; "
        "img-src 'self' data: https://images.unsplash.com; "
        "connect-src 'self' https://vendor-hub-93o2.onrender.com http://localhost:5000 http://localhost:5173; "
        "frame-ancestors 'none';"
    )
    response.headers['Content-Security-Policy'] = csp
    
    if request.is_secure:
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
        
    return response

def rate_limit(limit=60, period=60):
    # Thread-safe rate limiter decorator
    def decorator(f):
        def wrapper(*args, **kwargs):
            ip = request.headers.get('X-Forwarded-For', request.remote_addr or 'unknown')
            endpoint = request.endpoint or 'global'
            key = f"{ip}:{endpoint}"
            now = time.time()
            
            with _lock:
                # Initialize or prune expired timestamps
                history = _rate_limit_records.get(key, [])
                history = [t for t in history if now - t < period]
                
                if len(history) >= limit:
                    # Rate limit exceeded
                    return jsonify({"error": "Too many requests. Please try again later."}), 429
                
                history.append(now)
                _rate_limit_records[key] = history
                
            return f(*args, **kwargs)
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator
