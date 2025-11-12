const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
    origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(express.json());
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

function initializeDatabase() {
    const sql = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
    db.exec(sql, (err) => {
        if (err) {
            console.error('Error executing SQL file:', err);
        } else {
            console.log('Users table initialized successfully!');
            
            // Verify data was inserted
            db.all("SELECT * FROM Users", (err, rows) => {
                if (err) {
                    console.error('Error checking data:', err);
                } else {
                    console.log('Current users in database:', rows);
                }
            });
        }
    });
}


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

 const query = `SELECT * FROM Users WHERE employeeId = ? AND role = ?`;
    
    db.get(query, [employeeId, role], (err, user) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ 
                success: false,
                message: "Internal server error" 
            });
        }

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

        // Login successful
        res.json({
            success: true,
            message: "Login successful",
            user: {
                employeeId: user.employeeId,
                role: user.role
            }
        });
    });
});

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed.');
        process.exit(0);
    });
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