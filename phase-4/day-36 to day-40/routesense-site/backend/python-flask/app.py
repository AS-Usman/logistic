import os
from functools import wraps
from flask import Flask, request, jsonify, session
try:
    from flask_cors import CORS
    HAS_CORS = True
except ImportError:
    HAS_CORS = False
from mysql.connector import Error
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_db_connection, init_db

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'supplyiq_secret_key_day38_2026')

if HAS_CORS:
    CORS(app, supports_credentials=True, origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5000", "http://127.0.0.1:5000"])

# Initialize database schema on startup
with app.app_context():
    init_db()


def login_required(f):
    """
    Decorator to restrict access to authenticated users with active Flask sessions.
    Returns HTTP 401 if user_id is not present in session.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "Login required"}), 401
        return f(*args, **kwargs)
    return decorated


def format_shipment(row):
    """Formats a database row tuple into a structured dictionary."""
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
        "updated_at": row[10].isoformat() if row[10] else None
    }


def get_identifier_condition(identifier):
    """
    Returns SQL WHERE clause and parameter tuple depending on whether
    identifier is an integer PK or a string shipment_id.
    Prevents MySQL type casting warning/error 1292.
    """
    ident_str = str(identifier).strip()
    if ident_str.isdigit():
        return "(id = %s OR shipment_id = %s)", (int(ident_str), ident_str)
    else:
        return "shipment_id = %s", (ident_str,)


# ==========================================================
# DAY 39: HEALTH CHECK ENDPOINT → GET /
# ==========================================================
@app.route('/', methods=['GET'])
def health_check():
    """Health-check endpoint confirming SupplyIQ Flask backend is running."""
    return jsonify({
        "status": "running",
        "message": "SupplyIQ backend is running",
        "version": "1.0.0",
        "project": "SupplyIQ — Delivery Delay & Route Risk Predictor",
        "stage": "Day 39 — Individual Backend Project Kickoff & Scaffolding"
    }), 200


# ==========================================================
# DAY 39: SCAFFOLDING & PLACEHOLDERS FOR DAY 40
# ==========================================================

# TODO Day 40: Implement POST /api/shipments
# Purpose: Create & store a shipment record under /api namespace with @login_required

# TODO Day 40: Implement GET /api/shipments
# Purpose: Retrieve full shipment history list with @login_required

# TODO Day 40: Implement GET /api/shipments/<id>
# Purpose: Retrieve single shipment details with @login_required

# TODO Day 40: Implement PUT /api/shipments/<id>
# Purpose: Update shipment status or delay metrics with @login_required

# TODO Day 40: Implement DELETE /api/shipments/<id>
# Purpose: Delete shipment record with @login_required

# TODO Day 40: Integrate ML model with POST /api/predict
# Purpose: Accept route/weather parameters, compute prediction using trained ML model, and persist to predictions table with @login_required


# ==========================================================
# DAY 37: USER REGISTRATION → POST /register
# ==========================================================
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid or missing JSON payload"}), 400

    username = data.get("username")
    password = data.get("password")

    if not username or not str(username).strip():
        return jsonify({"error": "Username is required"}), 400

    if not password or not str(password).strip():
        return jsonify({"error": "Password is required"}), 400

    username_clean = str(username).strip()
    raw_password = str(password).strip()

    # Hash password securely using Werkzeug
    password_hash = generate_password_hash(raw_password)

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = "INSERT INTO users (username, password_hash) VALUES (%s, %s)"
        cursor.execute(query, (username_clean, password_hash))
        inserted_id = cursor.lastrowid

        cursor.close()
        connection.close()

        return jsonify({
            "message": "User registered successfully",
            "id": inserted_id,
            "username": username_clean
        }), 201

    except Error as e:
        if "Duplicate entry" in str(e) or e.errno == 1062:
            return jsonify({"error": f"Username '{username_clean}' already exists"}), 409
        return jsonify({"error": "Database error", "details": str(e)}), 500


# ==========================================================
# DAY 38: SESSIONS & LOGIN FLOW
# ==========================================================

# 1. POST /login → Verify credentials & establish Flask session
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid or missing JSON payload"}), 400

    username = data.get("username")
    password = data.get("password")

    if not username or not str(username).strip() or not password or not str(password).strip():
        return jsonify({"error": "Username and password are required"}), 400

    username_clean = str(username).strip()
    raw_password = str(password).strip()

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = "SELECT id, username, password_hash FROM users WHERE username = %s"
        cursor.execute(query, (username_clean,))
        user_row = cursor.fetchone()

        cursor.close()
        connection.close()

        if not user_row or not check_password_hash(user_row[2], raw_password):
            return jsonify({"error": "Invalid username or password"}), 401

        session['user_id'] = user_row[0]
        session['username'] = user_row[1]

        return jsonify({
            "message": f"Welcome back, {user_row[1]}!",
            "user_id": user_row[0],
            "username": user_row[1]
        }), 200

    except Error as e:
        return jsonify({"error": "Database error", "details": str(e)}), 500


# 2. GET /profile → Protected Route requiring login session
@app.route('/profile', methods=['GET'])
@login_required
def profile():
    return jsonify({
        "message": "Authenticated",
        "user_id": session.get("user_id"),
        "username": session.get("username")
    }), 200


# 3. POST /logout → Terminate active Flask session
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({
        "message": "Logged out successfully"
    }), 200


# ==========================================================
# DAY 36: SHIPMENT CRUD ENDPOINTS (Preserved)
# ==========================================================

# 1. CREATE → POST /shipments
@app.route('/shipments', methods=['POST'])
def create_shipment():
    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid or missing JSON payload"}), 400

    required_fields = ["shipment_id", "origin", "destination", "distance", "weather", "route_risk", "delivery_status"]
    missing_fields = [field for field in required_fields if field not in data or data[field] is None or str(data[field]).strip() == ""]
    if missing_fields:
        return jsonify({
            "error": "Missing required shipment fields",
            "missing": missing_fields
        }), 400

    try:
        shipment_id = str(data["shipment_id"]).strip()
        origin = str(data["origin"]).strip()
        destination = str(data["destination"]).strip()
        distance = float(data["distance"])
        weather = str(data["weather"]).strip()
        route_risk = str(data["route_risk"]).strip()
        delivery_status = str(data["delivery_status"]).strip()
        delay_days = int(data.get("delay_days", 0))

        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            INSERT INTO shipments 
            (shipment_id, origin, destination, distance, weather, route_risk, delivery_status, delay_days)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (shipment_id, origin, destination, distance, weather, route_risk, delivery_status, delay_days))
        inserted_id = cursor.lastrowid

        # Retrieve created record
        cursor.execute("""
            SELECT id, shipment_id, origin, destination, distance, weather, route_risk, delivery_status, delay_days, created_at, updated_at
            FROM shipments WHERE id = %s
        """, (inserted_id,))
        new_row = cursor.fetchone()

        cursor.close()
        connection.close()

        return jsonify({
            "message": "Shipment created successfully",
            "shipment": format_shipment(new_row)
        }), 201

    except Error as e:
        if "Duplicate entry" in str(e) or e.errno == 1062:
            return jsonify({"error": f"Shipment ID '{data.get('shipment_id')}' already exists"}), 400
        return jsonify({"error": "Database error", "details": str(e)}), 500
    except ValueError as e:
        return jsonify({"error": "Invalid data format for distance or delay_days", "details": str(e)}), 400


# 2. READ ALL → GET /shipments
@app.route('/shipments', methods=['GET'])
def get_all_shipments():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            SELECT id, shipment_id, origin, destination, distance, weather, route_risk, delivery_status, delay_days, created_at, updated_at
            FROM shipments 
            ORDER BY id ASC
        """
        cursor.execute(query)
        rows = cursor.fetchall()

        cursor.close()
        connection.close()

        shipments_list = [format_shipment(row) for row in rows]
        return jsonify(shipments_list), 200

    except Error as e:
        return jsonify({"error": "Database error", "details": str(e)}), 500


# 3. READ SINGLE → GET /shipments/<id>
@app.route('/shipments/<identifier>', methods=['GET'])
def get_shipment(identifier):
    try:
        where_clause, params = get_identifier_condition(identifier)
        connection = get_db_connection()
        cursor = connection.cursor()

        query = f"""
            SELECT id, shipment_id, origin, destination, distance, weather, route_risk, delivery_status, delay_days, created_at, updated_at
            FROM shipments 
            WHERE {where_clause}
        """
        cursor.execute(query, params)
        row = cursor.fetchone()

        cursor.close()
        connection.close()

        if not row:
            return jsonify({"error": f"Shipment '{identifier}' not found"}), 404

        return jsonify(format_shipment(row)), 200

    except Error as e:
        return jsonify({"error": "Database error", "details": str(e)}), 500


# 4. UPDATE → PUT /shipments/<id>
@app.route('/shipments/<identifier>', methods=['PUT'])
def update_shipment(identifier):
    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid or missing JSON payload"}), 400

    allowed_fields = ["shipment_id", "origin", "destination", "distance", "weather", "route_risk", "delivery_status", "delay_days"]
    update_clause = []
    params = []

    for field in allowed_fields:
        if field in data and data[field] is not None:
            update_clause.append(f"{field} = %s")
            if field == "distance":
                params.append(float(data[field]))
            elif field == "delay_days":
                params.append(int(data[field]))
            else:
                params.append(str(data[field]).strip())

    if not update_clause:
        return jsonify({"error": "No valid fields provided for update"}), 400

    try:
        where_clause, id_params = get_identifier_condition(identifier)

        connection = get_db_connection()
        cursor = connection.cursor()

        # Check if shipment exists
        cursor.execute(f"SELECT id FROM shipments WHERE {where_clause}", id_params)
        existing = cursor.fetchone()
        if not existing:
            cursor.close()
            connection.close()
            return jsonify({"error": f"Shipment '{identifier}' not found"}), 404

        target_id = existing[0]

        sql_update = f"UPDATE shipments SET {', '.join(update_clause)} WHERE id = %s"
        params.append(target_id)
        cursor.execute(sql_update, tuple(params))

        # Retrieve updated shipment record
        cursor.execute("""
            SELECT id, shipment_id, origin, destination, distance, weather, route_risk, delivery_status, delay_days, created_at, updated_at
            FROM shipments WHERE id = %s
        """, (target_id,))
        updated_row = cursor.fetchone()

        cursor.close()
        connection.close()

        return jsonify({
            "message": "Shipment updated successfully",
            "shipment": format_shipment(updated_row)
        }), 200

    except Error as e:
        if "Duplicate entry" in str(e) or e.errno == 1062:
            return jsonify({"error": "Duplicate shipment_id in update"}), 400
        return jsonify({"error": "Database error", "details": str(e)}), 500
    except ValueError as e:
        return jsonify({"error": "Invalid data format for distance or delay_days", "details": str(e)}), 400


# 5. DELETE → DELETE /shipments/<id>
@app.route('/shipments/<identifier>', methods=['DELETE'])
def delete_shipment(identifier):
    try:
        where_clause, id_params = get_identifier_condition(identifier)

        connection = get_db_connection()
        cursor = connection.cursor()

        # Check if shipment exists
        cursor.execute(f"SELECT id, shipment_id FROM shipments WHERE {where_clause}", id_params)
        existing = cursor.fetchone()
        if not existing:
            cursor.close()
            connection.close()
            return jsonify({"error": f"Shipment '{identifier}' not found"}), 404

        target_id = existing[0]
        shipment_code = existing[1]

        delete_query = "DELETE FROM shipments WHERE id = %s"
        cursor.execute(delete_query, (target_id,))

        cursor.close()
        connection.close()

        return jsonify({
            "message": f"Shipment '{identifier}' deleted successfully",
            "deleted_id": target_id,
            "shipment_id": shipment_code
        }), 200

    except Error as e:
        return jsonify({"error": "Database error", "details": str(e)}), 500


# Error Handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource or endpoint not found"}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500


if __name__ == '__main__':
    print("=================================================")
    print("Starting SupplyIQ Flask API Server (Day 39)")
    print("Listening at: http://127.0.0.1:5000")
    print("=================================================")
    app.run(host='127.0.0.1', port=5000, debug=True)
