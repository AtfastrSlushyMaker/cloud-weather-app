from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__, static_folder="static")
CORS(app)  # Enable CORS for all routes

API_KEY = os.getenv("OPENWEATHER_API_KEY")

# Check if API key is loaded
if not API_KEY:
    print("WARNING: API_KEY is not set!")


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
        return (
            jsonify(
                {
                    "error": "API key not configured",
                    "message": "OPENWEATHER_API_KEY environment variable not found",
                }
            ),
            500,
        )

    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"

    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return jsonify(data)
        else:
            return (
                jsonify(
                    {
                        "error": "Could not fetch weather data",
                        "message": "Unable to retrieve weather information for the specified city"
                    }
                ),
                response.status_code,
            )
    except Exception as e:
        return (
            jsonify(
                {
                    "error": "Request failed",
                    "message": "An error occurred while processing your request"
                }
            ),
            500,
        )


if __name__ == "__main__":
    # Use debug=False for production deployment
    debug_mode = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    app.run(host="0.0.0.0", port=5000, debug=debug_mode)
