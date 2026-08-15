from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

students = []

@app.route('/api/students', methods=['POST'])
def add_student():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    course = data.get('course')

    if not name or not email or not course:
        return jsonify({
            'success': False,
            'message': 'Name, email and course are required'
        }), 400

    student = {
        'id': len(students) + 1,
        'name': name,
        'email': email,
        'course': course
    }
    students.append(student)

    return jsonify({
        'success': True,
        'message': 'Student added successfully',
        'student': student
    }), 201

if __name__ == '__main__':
    app.run(debug=True)
