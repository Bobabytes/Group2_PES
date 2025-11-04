const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
    origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(express.json());
const users = [
    {
        employeeId: "HR001",
        password: "hr123",
        name: "Sarah Johnson",
        role: "hr",
        department: "Human Resources"
    },
    {
        employeeId: "EMP001",
        password: "emp123", 
        name: "John Doe",
        role: "employee",
        department: "Engineering"
    },
    {
        employeeId: "FIN001",
        password: "fin123",
        name: "Mike Wilson",
        role: "finance",
        department: "Finance"
    },
    {
        employeeId: "ADMIN001",
        password: "admin123",
        name: "Admin User",
        role: "administrator",
        department: "IT"
    }
];

// Backend route for frontend interaction
app.get("/api", (req, res) => {
    res.json({ "fruits": ["apple", "strawberry", "pineapple"] });
});

app.post("/api/auth/login", (req, res) => {
     const { employeeId, password, role } = req.body;

    // Basic validation
    if (!employeeId || !password || !role) {
        return res.status(400).json({ 
            success: false,
            message: "Employee ID, password, and role are required" 
        });
    }

    // Find user
    const user = users.find(u => 
        u.employeeId === employeeId && 
        u.role === role
    );

    if (!user) {
        return res.status(401).json({ 
            success: false,
            message: "Invalid employee ID or role" 
        });
    }

    // Check password
    if (user.password !== password) {
        return res.status(401).json({ 
            success: false,
            message: "Invalid password" 
        });
    }

    if(user.password == password && user.employeeId == employeeId){
        return res.status(402).json({
            success: true,
            message: "Login successful"
        });
    }

});
/*
    // Return user data (without password)
    res.json({
        success: true,
        message: "Login successful",
        user: {
            employeeId: user.employeeId,
            name: user.name,
            role: user.role,
            department: user.department
        }
    });
});
*/


app.listen(8080, () => {
    console.log("Server started on port 8080");
});