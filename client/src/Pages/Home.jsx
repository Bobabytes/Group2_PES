import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/custom/Header";
import EmployeeDashboard from "./Dashboards/EmployeeDashboard";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [array, setArray] = useState([]);
  const [role, setRole] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  // Fetch test API data
  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api");
    setArray(response.data.fruits);
  };

  const [isLoading, setIsLoading] = useState(true);
  // Load from localStorage
  useEffect(() => {
    // Debug
    fetchAPI();
    // Setup local variables
    const savedRole = localStorage.getItem("userRole");
    const savedId = localStorage.getItem("employeeId");
    
    if (!savedRole || !savedId) {
      navigate("/");
    }
    
    setRole(savedRole);
    setEmployeeId(savedId);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("employeeId");
    toast.success("Logged out successfully");
    navigate("");
  };

  const getRoleTitle = () => {
    switch (role.toLowerCase()) {
      case "employee": return "Employee Portal";
      case "hr": return "HR Management";
      case "finance": return "Finance Dashboard";
      case "administrator": return "Administrator Portal";
      default: return "Dashboard";
    }
  };

  return (
    // DIV WRAP
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* HEADER NEEDS VARIABLES AND LOGOUT FUNCTION PASSED -P*/}
      <Header
        roleTitle={getRoleTitle()}
        employeeId={employeeId}
        onLogout={handleLogout}
      />
      <div className="p-6 m-4">
        <h1 className="text-3xl font-bold mb-4">Home</h1>
        <hr className="mb-4" />
        {role && (
          <div className="mb-4">
            <p className="text-lg font-medium">
              {role.toLowerCase() === "employee" && <EmployeeDashboard />}
              {role.toLowerCase() === "hr" && "HR.jsx would go here."}
              {role.toLowerCase() === "finance" && "💰 This is the Finance page — manage company payments."}
              {role.toLowerCase() === "administrator" && "🛠️ This is the Admin dashboard — full system access."}
            </p>
          </div>
        )}
      </div>

      <hr></hr>
        <div className="card mb-4">
          <button onClick={() => setCount((count) => count + 1)}>
            CLICK HERE! Count is {count}
          </button>
          <p>Home : Employee. Lots to do.</p>
        </div>
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
