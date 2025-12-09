import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Building2 } from "lucide-react";

function Login() {
  // Debug/test data from backend
  const [array, setArray] = useState([]);
  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api");
    setArray(response.data.fruits);
  };
  useEffect(() => {
    fetchAPI();
  }, []);

  // Login form state
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId || !password || !role) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/login", {
        username: employeeId,
        password,
        selectedRole: role,
      });

      const { actualRole, warning, userId, username, name } = response.data;

      if (warning) {
        toast.warning(warning);
      } else {
        toast.success("Login successful!");
      }

      // CRITICAL FIX: Save ALL user data to localStorage
      console.log("✅ Login successful, saving to localStorage:", {
        userId,
        actualRole,
        username,
        name
      });
      
      localStorage.setItem("userId", userId);
      localStorage.setItem("userRole", actualRole);
      localStorage.setItem("username", username);
      localStorage.setItem("name", name);
      localStorage.setItem("employeeId", employeeId);
      
      // For debugging
      console.log("🔍 Saved localStorage after login:");
      console.log("  userId:", localStorage.getItem("userId"));
      console.log("  userRole:", localStorage.getItem("userRole"));
      console.log("  username:", localStorage.getItem("username"));

      navigate("/home");
    } catch (error) 
    {
      toast.error(error.response?.data?.message || "Login failed.");
      console.error("Login error:", error.response?.data);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-2xl shadow-lg bg-gradient-primary">
              <Building2 className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="space-y-2 text-center">
              <CardTitle className="text-3xl font-bold">
                Payment Enrollment System
              </CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role" aria-label="Select role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Employee">Employee</SelectItem>
                    <SelectItem value="HR">HR Staff</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Administrator">Administrator</SelectItem> 
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeId">Username</Label>
                <Input
                  id="employeeId"
                  placeholder="Enter your username"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                />
                
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                
              </div>

              <Button type="submit" className="w-full">
                Sign In
              </Button>
              
           
            </form>
          </CardContent>
        </Card>
      </div>

      <hr />
    </>
  );
}

export default Login;