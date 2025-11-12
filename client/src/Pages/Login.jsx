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

      const { actualRole, warning } = response.data;

      if (warning) {
        toast.warning(warning);
      } else {
        toast.success("Login successful!");
      }

      // Save confirmed role
      localStorage.setItem("userRole", actualRole);
      localStorage.setItem("employeeId", employeeId);

      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-2xl gradient-primary shadow-lg">
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
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="administrator">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  placeholder="Enter your employee ID"
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
      <div>
        <h1>Login Page Debug</h1>
        <p>If you can see fruits below, backend is connected:</p>
        {array.map((fruit, i) => (
          <p key={i}>{fruit}</p>
        ))}
      </div>
    </>
  );
}

export default Login;
