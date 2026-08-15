import { useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const studentData = { name, email, course };

    try {
      const response = await fetch('http://127.0.0.1:5000/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setStudents((current) => [...current, data.student]);
        setName('');
        setEmail('');
        setCourse('');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error connecting to Flask server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Student Registration</h1>

      <form onSubmit={handleSubmit}>
        <label>Student Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" required />

        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" required />

        <label>Course</label>
        <input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Enter course" required />

        <button type="submit" disabled={loading}>
          {loading ? '⏳ Submitting...' : 'Add Student'}
        </button>
      </form>

      {message && <p className="message">{message}</p>}

      <h2>Student List</h2>
      {students.length === 0 ? (
        <p>No students added yet.</p>
      ) : (
        students.map((student) => (
          <div className="student" key={student.id}>
            <h3>{student.name}</h3>
            <p>Email: {student.email}</p>
            <p>Course: {student.course}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
