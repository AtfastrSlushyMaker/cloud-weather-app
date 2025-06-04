from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__, static_folder="static")
CORS(app)  # Enable CORS for all routes

API_KEY = os.getenv("OPENWEATHER_API_KEY")

# Debug: Check if API key is loaded
if not API_KEY:
    print("WARNING: API_KEY is not set!")
else:
    print(f"API key loaded: {API_KEY[:8]}...")


@app.route("/")
def home():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/<path:path>")
def serve_angular_routes(path):
    # Serve static files if they exist, otherwise serve index.html for Angular routing
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


@app.route("/api/weather")
def weather():
    city = request.args.get("city", "Tunis")
    
    # Check if API key exists
    if not API_KEY:
        return jsonify({
            "error": "API key not configured",
            "message": "OPENWEATHER_API_KEY environment variable not found"
        }), 500
    
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return jsonify(data)
        else:
            return jsonify({
                "error": "Could not fetch weather data",
                "status_code": response.status_code,
                "details": response.text,
                "api_key_status": "API key exists" if API_KEY else "API key missing"
            }), response.status_code
    except Exception as e:
        return jsonify({
            "error": "Request failed",
            "message": str(e),
            "api_key_status": "API key exists" if API_KEY else "API key missing"
        }), 500


@app.route("/debug/env")
def debug_env():
    """Debug endpoint to check environment variables"""
    api_key = os.getenv("OPENWEATHER_API_KEY")
    return jsonify(
        {
            "api_key_exists": bool(api_key),
            "api_key_length": len(api_key) if api_key else 0,
            "api_key_preview": (
                api_key[:8] + "..." if api_key and len(api_key) > 8 else "Not found"
            ),
            "all_env_vars": list(os.environ.keys()),  # List all environment variable names
        }
    )


@app.route("/debug/weather-test")
def debug_weather():
    """Debug endpoint to test API call with detailed info"""
    city = request.args.get("city", "London")
    api_key = os.getenv("OPENWEATHER_API_KEY")

    if not api_key:
        return (
            jsonify(
                {"error": "API key not found in environment", "env_vars": list(os.environ.keys())}
            ),
            500,
        )

    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"

    try:
        response = requests.get(url)
        return jsonify(
            {
                "status_code": response.status_code,
                "url_used": url.replace(api_key, "***HIDDEN***"),
                "response_text": response.text,
                "api_key_preview": api_key[:8] + "..." if len(api_key) > 8 else api_key,
            }
        )
    except Exception as e:
        return (
            jsonify(
                {"error": str(e), "api_key_preview": api_key[:8] + "..." if len(api_key) > 8 else api_key}
            ),
            500,
        )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
