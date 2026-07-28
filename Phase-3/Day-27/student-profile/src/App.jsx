import "./App.css";
import StudentCard from "./components/StudentCard";

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>🎓 Student Profile Dashboard</h1>
        <p>React JS - Components | JSX | Props</p>
      </header>

      <div className="cards">
        <StudentCard
          name="Shaik Usman"
          age={21}
          department="Computer Science"
          college="B.S. Abdur Rahman Crescent Institute"
          email="usman@gmail.com"
        />

        <StudentCard
          name="Rahul Sharma"
          age={20}
          department="Information Technology"
          college="B.S. Abdur Rahman Crescent Institute"
          email="rahul@gmail.com"
        />

        <StudentCard
          name="Ayesha Khan"
          age={22}
          department="Artificial Intelligence"
          college="B.S. Abdur Rahman Crescent Institute"
          email="ayesha@gmail.com"
        />
      </div>
    </div>
  );
}

export default App;