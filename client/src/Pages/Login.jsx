import { useState, useEffect } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Building2 } from "lucide-react";

function Login() {
    // Data pulled from backend is saved here
    const [count, setCount] = useState(0);
    const [array, setArray] = useState([]);

    // Base Axios usage
    const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api");
    setArray(response.data.fruits);
    console.log(response.data.fruits);
    }
    // API Fetch
    useEffect( () => {
    fetchAPI();
    }, []);
    // Boilerplate Data Over

    
    // Login Handling Data
    const navigate = useNavigate();
    const [employeeId, setEmployeeId] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!employeeId || !password || !role) {
        toast.error("Please fill in all fields.");
        return;
        }

        localStorage.setItem("userRole", role);
        localStorage.setItem("employeeId", employeeId);
        
        toast.success("Login successful!");
        navigate("/home");
    };


    return (
    <><div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-2xl gradient-primary shadow-lg">
                        <Building2 className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="space-y-2 text-center">
                        <CardTitle className="text-3xl font-bold">Payment Enrollment System</CardTitle>
                        <CardDescription>Enter your credentials to access your account</CardDescription>
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
                                required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required />
                        </div>
                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                    </form>
                </CardContent>
            </Card>

            
        </div>
        <hr></hr>
        <div>
            <h1>Login Page</h1>
                    <button onClick={() => setCount((count) => count + 1)}>
                        CLICK HERE! Count is {count}
                    </button>
                    <p>
                        Lots to do.
                    </p>

                    <p className="read-the-docs">
                        Debug: If you can see fruits, that means the backend is working
                    </p>
                    {/** Use data pulled from backend to display strings */}
                    {array.map((fruit, index) => (
                        <div key={index}>
                            <p>{fruit}</p>
                            <br></br>
                        </div>
                    ))}
        </div>      
    </>
    )
}

export default Login;