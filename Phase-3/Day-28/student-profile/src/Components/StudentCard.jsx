function StudentCard({
  name,
  age,
  department,
  college,
  email
}) {
  return (
    <div className="card">
      <div className="avatar">
        {name.charAt(0)}
      </div>

      <h2>{name}</h2>

      <div className="info">
        <p><strong>Age</strong> : {age}</p>
        <p><strong>Department</strong> : {department}</p>
        <p><strong>College</strong> : {college}</p>
        <p><strong>Email</strong> : {email}</p>
      </div>

      <button>View Profile</button>
    </div>
  );
}

export default StudentCard;