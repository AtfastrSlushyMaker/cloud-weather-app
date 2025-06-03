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
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return jsonify(data)
    else:
        return (
            jsonify(
                {"error": "Could not fetch weather data", "details": response.text}
            ),
            response.status_code,
        )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
