import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/students")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }
        return response.json();
      })
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to connect to Flask backend.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h2 className="message">Loading students...</h2>;
  }

  if (error) {
    return (
      <div className="message">
        <h2 className="error">{error}</h2>
        <p>Make sure the Flask backend is running on port 5000.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Student Management System</h1>
      <p className="subtitle">Students loaded from Flask REST API</p>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.course}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
