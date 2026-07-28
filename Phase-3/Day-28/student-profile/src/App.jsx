import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: darkMode
      ? "linear-gradient(135deg, #141E30, #243B55)"
      : "linear-gradient(135deg, #89f7fe, #66a6ff)",
    transition: "0.5s ease",
    fontFamily: "Poppins, sans-serif",
  };

  const cardStyle = {
    width: "400px",
    padding: "35px",
    borderRadius: "20px",
    background: darkMode
      ? "rgba(255,255,255,0.1)"
      : "rgba(255,255,255,0.25)",
    backdropFilter: "blur(15px)",
    WebkitBackdropFilter: "blur(15px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    color: "#fff",
    textAlign: "center",
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={{ marginBottom: "10px" }}>⚛️ React Hooks</h1>
        <p style={{ opacity: 0.9 }}>Day 28 - useState Tasks</p>

        <hr style={{ margin: "20px 0", borderColor: "#ffffff55" }} />

        {/* Task 1 */}
        <h2>👤 Name Preview</h2>

        <input
          type="text"
          placeholder="Enter your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            outline: "none",
            fontSize: "16px",
            marginTop: "10px",
            boxSizing: "border-box",
          }}
        />

        <h2 style={{ marginTop: "20px" }}>
          Hello,{" "}
          <span style={{ color: "#FFD700" }}>
            {name.trim() || "Guest"}
          </span>
          ! 👋
        </h2>

        <hr style={{ margin: "25px 0", borderColor: "#ffffff55" }} />

        {/* Task 2 */}
        <h2>{darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}</h2>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            marginTop: "15px",
            padding: "12px 25px",
            border: "none",
            borderRadius: "30px",
            background: darkMode
              ? "linear-gradient(90deg,#FFD700,#FFA500)"
              : "linear-gradient(90deg,#4CAF50,#00C853)",
            color: "#fff",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "0.3s",
          }}
        >
          {darkMode ? "☀️ Switch to Light Mode" : "🌙 Switch to Dark Mode"}
        </button>

        <p style={{ marginTop: "25px", fontSize: "14px", opacity: 0.8 }}>
          Built with ❤️ using React Hooks
        </p>
      </div>
    </div>
  );
}

export default App;