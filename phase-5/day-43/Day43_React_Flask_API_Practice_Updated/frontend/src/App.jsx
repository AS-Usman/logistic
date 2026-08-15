import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:5000/api/students";

function App() {
  // Controlled form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");

  // Student list from GET API
  const [students, setStudents] = useState([]);

  // Separate states for the API practice
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [lastResponse, setLastResponse] = useState("");

  // Load data when the page opens
  useEffect(() => {
    loadStudents();
  }, []);

  // ---------------- TASK 01 + TASK 02: GET API ----------------
  const loadStudents = async () => {
    setLoading(true);
    setLoadingType("Loading students...");
    setError("");
    setMessage("");
    setLastResponse("");

    try {
      const response = await fetch(API_URL);

      // Explicit response.ok check
      if (!response.ok) {
        throw new Error("Unable to load students.");
      }

      const data = await response.json();

      setStudents(Array.isArray(data.students) ? data.students : []);
      setLastResponse(`GET success: ${data.count} student(s) received.`);
    } catch (error) {
      // Backend unavailable / request failed
      setStudents([]);
      setError("Unable to load students.");
      setLastResponse("GET failed.");
    } finally {
      // Always stop loading
      setLoading(false);
      setLoadingType("");
    }
  };

  // ---------------- TASK 03: POST API ----------------
  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setLoadingType("Submitting student...");
    setError("");
    setMessage("");
    setLastResponse("");

    const studentData = {
      name: name.trim(),
      email: email.trim(),
      course: course.trim()
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(studentData)
      });

      const data = await response.json();

      // Check response.ok before treating the response as success
      if (!response.ok) {
        throw new Error(data.message || "Failed to add student.");
      }

      // Show exactly what came back from Flask
      setMessage(data.message);
      setLastResponse(
        `POST success: Student #${data.student.id} returned by Flask.`
      );

      // Add returned student without page refresh
      setStudents((currentStudents) => [
        ...currentStudents,
        data.student
      ]);

      // Clear the form after success
      setName("");
      setEmail("");
      setCourse("");
    } catch (error) {
      setError(error.message || "Unable to add student.");
      setLastResponse("POST failed.");
    } finally {
      setLoading(false);
      setLoadingType("");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Day 43 — API Response Practice</h1>
        <p className="subtitle">
          React ⇄ Flask: success, failure, empty data
        </p>

        <div className="api-bar">
          <span>API: {API_URL}</span>
          <button
            className="refresh-btn"
            onClick={loadStudents}
            disabled={loading}
          >
            Refresh Students
          </button>
        </div>

        {/* ---------------- FORM ---------------- */}
        <form onSubmit={handleSubmit}>
          <label>Student Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter student name"
            required
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />

          <label>Course</label>
          <input
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="Enter course"
            required
          />

          <button type="submit" disabled={loading}>
            {loadingType === "Submitting student..."
              ? "Submitting..."
              : "Add Student"}
          </button>
        </form>

        {/* ---------------- API STATUS ---------------- */}
        {loading && (
          <div className="status loading">
            <span className="spinner"></span>
            {loadingType}
          </div>
        )}

        {message && <div className="status success">{message}</div>}

        {error && (
          <div className="status error">
            <strong>{error}</strong>
            <button className="retry-btn" onClick={loadStudents}>
              Retry GET
            </button>
          </div>
        )}

        {lastResponse && (
          <div className="response-box">
            <strong>Last API response:</strong> {lastResponse}
          </div>
        )}

        {/* ---------------- EMPTY STATE ---------------- */}
        <div className="list-header">
          <h2>Student List</h2>
          <span className="count">{students.length}</span>
        </div>

        {!loading && !error && students.length === 0 && (
          <div className="empty-state">
            <h3>No students found.</h3>
            <p>
              The API responded successfully, but there is no student data yet.
            </p>
          </div>
        )}

        {/* ---------------- STUDENTS ---------------- */}
        {!error && students.length > 0 && (
          <div className="students">
            {students.map((student) => (
              <div className="student" key={student.id}>
                <div className="student-id">#{student.id}</div>
                <div>
                  <h3>{student.name}</h3>
                  <p>{student.email}</p>
                  <p>{student.course}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="task-note">
          <strong>Day 43 tests:</strong> stop Flask to see the error message,
          keep <code>students = []</code> to see the empty state, then add a
          student to verify GET → POST → JSON response → UI update.
        </div>
      </div>
    </div>
  );
}

export default App;
