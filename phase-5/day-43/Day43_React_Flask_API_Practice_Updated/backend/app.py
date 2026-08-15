from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Temporary in-memory data for the internship task.
students = []


# ---------------- GET: Read all students ----------------
@app.route("/api/students", methods=["GET"])
def get_students():
    return jsonify({
        "success": True,
        "count": len(students),
        "students": students
    }), 200


# ---------------- POST: Add a student ----------------
@app.route("/api/students", methods=["POST"])
def add_student():
    data = request.get_json(silent=True) or {}

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    course = str(data.get("course", "")).strip()

    # Backend validation
    if not name or not email or not course:
        return jsonify({
            "success": False,
            "message": "Name, email and course are required."
        }), 400

    student = {
        "id": len(students) + 1,
        "name": name,
        "email": email,
        "course": course
    }

    students.append(student)

    return jsonify({
        "success": True,
        "message": "Student added successfully.",
        "student": student
    }), 201


if __name__ == "__main__":
    app.run(debug=True)
