import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/custom/Header";
import EmployeeDashboard from "./Dashboards/EmployeeDashboard";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import HRDashboard from "./Dashboards/HRDashboard";
import FinanceDashboard from "./Dashboards/FinanceDashboard";
import AdministratorDashboard from "./Dashboards/AdministratorDashboard";

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
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    // WELL AT LEAST THIS WORKS
    toast.info("Logging out...");
    try {
    localStorage.removeItem("userRole");
    localStorage.removeItem("employeeId");
    localStorage.clear();
    navigate("/");
    // I can't ADD A TOAST HERE IDK WHY DOLFMSDNFGSKANEDFGKSNAKFNKADNSFKN
    } catch (error) {
      toast.error("Error during logout. Please try again.");
    }
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
              {role.toLowerCase() === "hr" && <HRDashboard />}
              {role.toLowerCase() === "finance" && <FinanceDashboard />}
              {role.toLowerCase() === "administrator" && <AdministratorDashboard />}
            </p>
          </div>
        )}
      </div>

      <hr></hr>
        <div className="card mb-4">
          <button onClick={() => setCount((count) => count + 1)}>
            CLICK HERE! Count is {count}
          </button>
          <p>Home. Lots to do.</p>
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
