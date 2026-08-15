import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:5000/api/students";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  // GET -> Flask -> MySQL -> JSON -> React
  const loadStudents = async () => {
    setLoading(true);
    setLoadingText("Loading students from MySQL...");
    setError("");

    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load students.");
      }

      setStudents(Array.isArray(data.students) ? data.students : []);
    } catch (err) {
      setStudents([]);
      setError(err.message || "Unable to load students.");
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  // React form -> POST -> Flask -> MySQL INSERT -> JSON -> React
  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setLoadingText("Saving student to MySQL...");
    setError("");
    setMessage("");

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

      if (!response.ok) {
        throw new Error(data.message || "Unable to save student.");
      }

      setMessage(data.message);

      // Use the created row returned by MySQL through Flask.
      setStudents((current) => [...current, data.student]);

      // Clear form after success.
      setName("");
      setEmail("");
      setCourse("");
    } catch (err) {
      setError(err.message || "Unable to save student.");
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Student Management</h1>
        <p className="subtitle">Day 44 — React → Flask → MySQL</p>

        <div className="architecture">
          <span>React</span>
          <span>→</span>
          <span>Flask API</span>
          <span>→</span>
          <span>MySQL</span>
        </div>

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
            {loading && loadingText.includes("Saving")
              ? "Saving..."
              : "Add Student"}
          </button>
        </form>

        {loading && (
          <div className="status loading">
            <span className="spinner"></span>
            {loadingText}
          </div>
        )}

        {message && <div className="status success">{message}</div>}

        {error && <div className="status error">{error}</div>}

        <div className="list-title">
          <h2>Student List</h2>
          <button
            className="refresh"
            onClick={loadStudents}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {!loading && !error && students.length === 0 && (
          <div className="empty">
            No students found.
          </div>
        )}

        {!error && students.length > 0 && (
          <div className="students">
            {students.map((student) => (
              <div className="student" key={student.id}>
                <div className="id">#{student.id}</div>
                <div>
                  <h3>{student.name}</h3>
                  <p>{student.email}</p>
                  <p>{student.course}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
