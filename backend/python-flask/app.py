import os
import pickle
import pandas as pd
from functools import wraps

from flask import Flask, request, jsonify, session
from flask_cors import CORS
from mysql.connector import Error
from werkzeug.security import generate_password_hash, check_password_hash

from db import get_db_connection, init_db

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "change-me-in-production")

is_production = os.getenv("FLASK_ENV", "development").lower() == "production"
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="None" if is_production else "Lax",
    SESSION_COOKIE_SECURE=is_production,
    MAX_CONTENT_LENGTH=64 * 1024,
)

cors_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]
CORS(app, origins=cors_origins, supports_credentials=True)

try:
    with open(MODEL_PATH, "rb") as model_file:
        MODEL = pickle.load(model_file)
except Exception as exc:
    MODEL = None
    print(f"Warning: ML model could not be loaded: {exc}")


def login_required(fn):
    @wraps(fn)
    def decorated(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"error": "Login required"}), 401
        return fn(*args, **kwargs)
    return decorated


def format_shipment(row):
    if not row:
        return None
    return {
        "id": row[0],
        "shipment_id": row[1],
        "origin": row[2],
        "destination": row[3],
        "distance": float(row[4]),
        "weather": row[5],
        "route_risk": row[6],
        "delivery_status": row[7],
        "delay_days": int(row[8]),
        "created_at": row[9].isoformat() if row[9] else None,
        "updated_at": row[10].isoformat() if row[10] else None,
    }


def get_identifier_condition(identifier):
    value = str(identifier).strip()
    if value.isdigit():
        return "(id = %s OR shipment_id = %s)", (int(value), value)
    return "shipment_id = %s", (value,)


def normalize_prediction_input(data):
    if not isinstance(data, dict):
        raise ValueError("JSON object required")

    required = [
        "distance",
        "transportMode",
        "cargoCategory",
        "weatherCondition",
        "carrierRating",
        "trafficCongestion",
        "cargoWeight",
    ]
    missing = [key for key in required if data.get(key) in (None, "")]
    if missing:
        raise ValueError(f"Missing required fields: {', '.join(missing)}")

    values = {
        "distance": float(data["distance"]),
        "transportMode": str(data["transportMode"]),
        "cargoCategory": str(data["cargoCategory"]),
        "weatherCondition": str(data["weatherCondition"]),
        "carrierRating": str(data["carrierRating"]),
        "trafficCongestion": float(data["trafficCongestion"]),
        "cargoWeight": float(data["cargoWeight"]),
    }

    if not 50 <= values["distance"] <= 15000:
        raise ValueError("distance must be between 50 and 15000 km")
    if not 0 <= values["trafficCongestion"] <= 100:
        raise ValueError("trafficCongestion must be between 0 and 100")
    if not 100 <= values["cargoWeight"] <= 50000:
        raise ValueError("cargoWeight must be between 100 and 50000 kg")

    allowed = {
        "transportMode": {"truck", "air", "rail", "maritime"},
        "cargoCategory": {"standard", "perishable", "electronics", "hazardous", "heavy"},
        "weatherCondition": {"clear", "rain", "fog", "snow", "storm", "heatwave"},
        "carrierRating": {"A+", "A", "B", "C", "D"},
    }
    for key, choices in allowed.items():
        if values[key] not in choices:
            raise ValueError(f"Invalid {key}")

    return values


def prediction_from_model(values):
    if MODEL is None:
        raise RuntimeError("ML model is unavailable on the backend")

    prediction = float(MODEL.predict(pd.DataFrame([values]))[0])
    risk_score = int(round(max(6, min(97, prediction))))

    if risk_score >= 75:
        risk_level, badge = "Severe", "danger"
    elif risk_score >= 52:
        risk_level, badge = "High", "warning"
    elif risk_score >= 30:
        risk_level, badge = "Moderate", "info"
    else:
        risk_level, badge = "Low", "success"

    # Derived operational metrics are calculated from the ML risk score.
    mode_data = {
        "truck": (65, 1.25, "Road Truck Freight"),
        "air": (550, 0.85, "Air Cargo Express"),
        "rail": (45, 0.95, "Rail Freight"),
        "maritime": (25, 1.4, "Ocean Maritime Shipping"),
    }
    weather_weight = {"clear": 2, "rain": 18, "fog": 28, "snow": 42, "storm": 58, "heatwave": 20}
    speed, vulnerability, mode_label = mode_data[values["transportMode"]]
    weather = weather_weight[values["weatherCondition"]]
    base_hours = values["distance"] / speed
    delay_multiplier = (risk_score / 100) * (1.8 if weather > 30 else 1.2)
    estimated_delay = round(base_hours * delay_multiplier + (2.5 if values["trafficCongestion"] > 60 else 0.5), 1)

    recommendations = []
    if values["weatherCondition"] in {"storm", "snow"}:
        recommendations.append("Consider rerouting to avoid severe weather hazards.")
    if values["cargoCategory"] == "perishable" and risk_score > 40 and values["transportMode"] == "truck":
        recommendations.append("High cold-chain exposure: consider faster transport.")
    if values["carrierRating"] in {"C", "D"}:
        recommendations.append("Consider a higher-rated carrier to reduce disruption risk.")
    if values["trafficCongestion"] > 60:
        recommendations.append("Shift departure to an off-peak window to reduce congestion exposure.")
    if not recommendations:
        recommendations.append("Route parameters are favorable; maintain scheduled monitoring.")

    # Confidence is a transparent proximity measure, not a calibrated probability.
    confidence = round(min(0.99, max(0.50, 1 - abs(prediction - risk_score) / 10)), 3)

    return {
        "riskScore": risk_score,
        "riskLevel": risk_level,
        "badgeColor": badge,
        "confidence": confidence,
        "estimatedDelayHours": estimated_delay,
        "baseTravelHours": round(base_hours, 1),
        "totalEstimatedHours": round(base_hours + estimated_delay, 1),
        "breakdown": {
            "weather": round((weather * vulnerability) / max(1, weather * vulnerability + values["trafficCongestion"] * 0.45) * 100),
            "traffic": round((values["trafficCongestion"] * 0.45) / max(1, weather * vulnerability + values["trafficCongestion"] * 0.45) * 100),
            "carrier": 0,
            "routeComplexity": 0,
        },
        "recommendations": recommendations,
        "modeInfo": {"label": mode_label, "speed": speed},
        "weatherInfo": {"label": values["weatherCondition"].replace("_", " ").title(), "weight": weather},
        "carrierInfo": {"label": f"Carrier {values['carrierRating']}"},
        "model": "RandomForestRegressor",
        "note": "Risk score predicted by the bundled trained ML model.",
    }


@app.get("/")
def health_check():
    return jsonify({
        "status": "running",
        "project": "SupplyIQ — Delivery Delay & Route Risk Predictor",
        "service": "Flask API",
        "ml_model_loaded": MODEL is not None,
    })


@app.get("/api/health")
def api_health():
    return health_check()


@app.post("/register")
@app.post("/api/register")
def register():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid or missing JSON payload"}), 400
    username = str(data.get("username", "")).strip()
    password = str(data.get("password", "")).strip()
    if not username:
        return jsonify({"error": "Username is required"}), 400
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO users (username, password_hash) VALUES (%s, %s)",
            (username, generate_password_hash(password)),
        )
        user_id = cursor.lastrowid
        cursor.close()
        connection.close()
        return jsonify({"message": "User registered successfully", "id": user_id, "username": username}), 201
    except Error as exc:
        if getattr(exc, "errno", None) == 1062:
            return jsonify({"error": f"Username '{username}' already exists"}), 409
        return jsonify({"error": "Database error"}), 500


@app.post("/login")
@app.post("/api/login")
def login():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid or missing JSON payload"}), 400
    username = str(data.get("username", "")).strip()
    password = str(data.get("password", "")).strip()
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT id, username, password_hash FROM users WHERE username = %s", (username,))
        row = cursor.fetchone()
        cursor.close()
        connection.close()
        if not row or not check_password_hash(row[2], password):
            return jsonify({"error": "Invalid username or password"}), 401
        session["user_id"], session["username"] = row[0], row[1]
        return jsonify({"message": f"Welcome back, {row[1]}!", "user_id": row[0], "username": row[1]}), 200
    except Error:
        return jsonify({"error": "Database error"}), 500


@app.get("/profile")
@app.get("/api/profile")
@login_required
def profile():
    return jsonify({
        "message": "Authenticated",
        "user_id": session.get("user_id"),
        "username": session.get("username"),
    })


@app.post("/logout")
@app.post("/api/logout")
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"})


@app.get("/shipments")
@app.get("/api/shipments")
def get_all_shipments():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("""
            SELECT id, shipment_id, origin, destination, distance, weather,
                   route_risk, delivery_status, delay_days, created_at, updated_at
            FROM shipments ORDER BY id ASC
        """)
        rows = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify([format_shipment(row) for row in rows])
    except Error:
        return jsonify({"error": "Database error"}), 500


@app.post("/shipments")
@app.post("/api/shipments")
def create_shipment():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid or missing JSON payload"}), 400

    required = ["shipment_id", "origin", "destination", "distance", "weather", "route_risk", "delivery_status"]
    missing = [key for key in required if data.get(key) in (None, "")]
    if missing:
        return jsonify({"error": "Missing required shipment fields", "missing": missing}), 400

    try:
        shipment_id = str(data["shipment_id"]).strip()
        origin = str(data["origin"]).strip()
        destination = str(data["destination"]).strip()
        distance = float(data["distance"])
        weather = str(data["weather"]).strip()
        route_risk = str(data["route_risk"]).strip()
        delivery_status = str(data["delivery_status"]).strip()
        delay_days = int(data.get("delay_days", 0))
        if distance <= 0 or delay_days < 0:
            raise ValueError("distance must be positive and delay_days cannot be negative")

        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("""
            INSERT INTO shipments
            (shipment_id, origin, destination, distance, weather, route_risk, delivery_status, delay_days)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (shipment_id, origin, destination, distance, weather, route_risk, delivery_status, delay_days))
        inserted_id = cursor.lastrowid
        cursor.execute("""
            SELECT id, shipment_id, origin, destination, distance, weather,
                   route_risk, delivery_status, delay_days, created_at, updated_at
            FROM shipments WHERE id = %s
        """, (inserted_id,))
        row = cursor.fetchone()
        cursor.close()
        connection.close()
        return jsonify({"message": "Shipment created successfully", "shipment": format_shipment(row)}), 201
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except Error as exc:
        if getattr(exc, "errno", None) == 1062:
            return jsonify({"error": f"Shipment ID '{data.get('shipment_id')}' already exists"}), 409
        return jsonify({"error": "Database error"}), 500


@app.delete("/shipments/<identifier>")
@app.delete("/api/shipments/<identifier>")
def delete_shipment(identifier):
    try:
        where, params = get_identifier_condition(identifier)
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(f"SELECT id, shipment_id FROM shipments WHERE {where}", params)
        row = cursor.fetchone()
        if not row:
            cursor.close()
            connection.close()
            return jsonify({"error": f"Shipment '{identifier}' not found"}), 404
        cursor.execute("DELETE FROM shipments WHERE id = %s", (row[0],))
        cursor.close()
        connection.close()
        return jsonify({"message": f"Shipment '{identifier}' deleted successfully", "deleted_id": row[0]})
    except Error:
        return jsonify({"error": "Database error"}), 500


@app.get("/shipments/<identifier>")
@app.get("/api/shipments/<identifier>")
def get_shipment(identifier):
    try:
        where, params = get_identifier_condition(identifier)
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(f"""
            SELECT id, shipment_id, origin, destination, distance, weather,
                   route_risk, delivery_status, delay_days, created_at, updated_at
            FROM shipments WHERE {where}
        """, params)
        row = cursor.fetchone()
        cursor.close()
        connection.close()
        if not row:
            return jsonify({"error": f"Shipment '{identifier}' not found"}), 404
        return jsonify(format_shipment(row))
    except Error:
        return jsonify({"error": "Database error"}), 500


@app.post("/api/predict")
def predict():
    data = request.get_json(silent=True)
    try:
        values = normalize_prediction_input(data)
        result = prediction_from_model(values)
    except ValueError as exc:
        return jsonify({"success": False, "error": str(exc)}), 400
    except RuntimeError as exc:
        return jsonify({"success": False, "error": str(exc)}), 503

    prediction_id = None
    shipment_identifier = data.get("shipment_id") if isinstance(data, dict) else None

    if shipment_identifier:
        try:
            where, params = get_identifier_condition(shipment_identifier)
            connection = get_db_connection()
            cursor = connection.cursor()
            cursor.execute(f"SELECT id FROM shipments WHERE {where}", params)
            shipment_row = cursor.fetchone()
            if shipment_row:
                cursor.execute(
                    "INSERT INTO predictions (shipment_id, predicted_risk, prediction_confidence) VALUES (%s, %s, %s)",
                    (shipment_row[0], result["riskLevel"], result["confidence"]),
                )
                prediction_id = cursor.lastrowid
            cursor.close()
            connection.close()
        except Error:
            # Prediction itself remains successful even if optional history persistence fails.
            prediction_id = None

    return jsonify({
        "success": True,
        "data": {
            "inputs": values,
            "riskAnalysis": result,
            "prediction_id": prediction_id,
        },
    })


@app.errorhandler(404)
def not_found(_error):
    return jsonify({"error": "Resource or endpoint not found"}), 404


@app.errorhandler(413)
def too_large(_error):
    return jsonify({"error": "Request payload is too large"}), 413


@app.errorhandler(500)
def internal_error(_error):
    return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    init_db()
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=os.getenv("FLASK_DEBUG", "0") == "1")
