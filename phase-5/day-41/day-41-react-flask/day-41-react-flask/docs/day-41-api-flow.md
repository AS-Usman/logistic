# Day 41 — API Flow Documentation

## 1. Purpose of `/api/students`

The `/api/students` endpoint is a Flask REST API endpoint used to provide student information to the React frontend.

It returns student records in JSON format containing Student ID, Name, Email, and Course.

The React frontend requests this data and displays it on the webpage.

## 2. What is an HTTP Request?

An HTTP Request is a message sent by a client, such as a web browser or React application, to a server to request or send information.

For this project, React sends a GET request to:

`/api/students`

The Flask backend receives the request and processes it.

## 3. What is a JSON Response?

JSON stands for JavaScript Object Notation.

It is a lightweight format used to transfer data between the backend and frontend.

Example:

```json
[
  {
    "id": 1,
    "name": "Arun Kumar",
    "email": "arun@example.com",
    "course": "AI & Data Science"
  }
]
```

Flask sends this JSON response to React.

## 4. How Data Travels from Flask to React

```text
React Application
       |
       | GET /api/students
       v
Flask Backend
       |
       | Processes Request
       v
Student Data
       |
       | JSON Response
       v
React fetch()
       |
       | response.json()
       v
useState()
       |
       v
React Component
       |
       v
Student Table
       |
       v
User sees student data
```

## API/Data Flow Architecture

```text
+---------------------+
|    React Frontend   |
|                     |
|    useEffect()      |
|         |           |
|         v           |
|       fetch()       |
+----------+----------+
           |
           | GET /api/students
           v
+---------------------+
|    Flask Backend    |
|                     |
|   /api/students     |
+----------+----------+
           |
           | JSON Response
           v
+---------------------+
|    React Frontend   |
|                     |
|  response.json()    |
|         |           |
|         v           |
|     useState()      |
|         |           |
|         v           |
|      React UI       |
+---------------------+
```

## Expected Workflow

```text
Flask API
    ↓
JSON Response
    ↓
React fetch()
    ↓
response.json()
    ↓
useState()
    ↓
React UI
```

The student data is stored in the Flask backend and obtained by React through the API. Student records are not hardcoded inside the React UI.
