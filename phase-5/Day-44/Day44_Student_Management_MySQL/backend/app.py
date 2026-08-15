import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error, IntegrityError

load_dotenv()

app = Flask(__name__)
CORS(app)

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "student_management"),
    "port": int(os.getenv("DB_PORT", "3306"))
}


def get_db_connection():
    """Create and return a MySQL connection."""
    return mysql.connector.connect(**DB_CONFIG)


def get_student_row_as_dict(row):
    """Convert a MySQL row tuple into a JSON-friendly dictionary."""
    return {
        "id": row[0],
        "name": row[1],
        "email": row[2],
        "course": row[3]
    }


# ---------------- GET /api/students ----------------
@app.route("/api/students", methods=["GET"])
def get_students():
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            "SELECT id, name, email, course "
            "FROM students ORDER BY id"
        )

        rows = cursor.fetchall()
        students = [get_student_row_as_dict(row) for row in rows]

        return jsonify({
            "success": True,
            "count": len(students),
            "students": students
        }), 200

    except Error as error:
        print("GET /api/students database error:", error)
        return jsonify({
            "success": False,
            "message": "Unable to load students from database."
        }), 500

    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None and connection.is_connected():
            connection.close()


# ---------------- POST /api/students ----------------
@app.route("/api/students", methods=["POST"])
def add_student():
    connection = None
    cursor = None

    try:
        data = request.get_json(silent=True) or {}

        name = str(data.get("name", "")).strip()
        email = str(data.get("email", "")).strip()
        course = str(data.get("course", "")).strip()

        # Validate required fields
        if not name or not email or not course:
            return jsonify({
                "success": False,
                "message": "Name, email and course are required."
            }), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        insert_query = """
            INSERT INTO students (name, email, course)
            VALUES (%s, %s, %s)
        """

        cursor.execute(insert_query, (name, email, course))
        new_student_id = cursor.lastrowid
        connection.commit()

        # Read the created row back from MySQL
        cursor.execute(
            "SELECT id, name, email, course "
            "FROM students WHERE id = %s",
            (new_student_id,)
        )
        row = cursor.fetchone()

        student = get_student_row_as_dict(row)

        return jsonify({
            "success": True,
            "message": "Student added successfully.",
            "student": student
        }), 201

    except IntegrityError:
        if connection is not None and connection.is_connected():
            connection.rollback()

        return jsonify({
            "success": False,
            "message": "Email already exists. Please use a different email."
        }), 409

    except Error as error:
        print("POST /api/students database error:", error)

        if connection is not None and connection.is_connected():
            connection.rollback()

        return jsonify({
            "success": False,
            "message": "Unable to save student."
        }), 500

    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None and connection.is_connected():
            connection.close()


@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "message": "Endpoint not found."
    }), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "success": False,
        "message": "Internal server error."
    }), 500


if __name__ == "__main__":
    app.run(debug=True)
