import { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [count, setCount] = useState(0);
  const [array, setArray] = useState([]);
  const [role, setRole] = useState("");

  // Fetch test API data
  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api");
    setArray(response.data.fruits);
  };

  // Load role from localStorage
  useEffect(() => {
    fetchAPI();
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) setRole(savedRole);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Home Page</h1>
      <hr className="mb-4" />

      <div className="card mb-4">
        <button onClick={() => setCount((count) => count + 1)}>
          CLICK HERE! Count is {count}
        </button>
        <p>Lots to do.</p>
      </div>

      {role && (
        <div className="mb-4">
          <p className="text-lg font-medium">
            {role.toLowerCase() === "hr" && "👩‍💼 This is the HR page — you can manage employees."}
            {role.toLowerCase() === "employee" && "👨‍💼 This is the Employee page — view your info."}
            {role.toLowerCase() === "finance" && "💰 This is the Finance page — manage company payments."}
            {role.toLowerCase() === "administrator" && "🛠️ This is the Admin dashboard — full system access."}
          </p>
        </div>
      )}

      <p className="read-the-docs mb-2">
        Debug: If you can see fruits, backend is working
      </p>
      {array.map((fruit, index) => (
        <div key={index}>
          <p>{fruit}</p>
          <br />
        </div>
      ))}
    </div>
  );
}

export default Home;
