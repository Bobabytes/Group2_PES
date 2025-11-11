const express = require("express");
const cors = require("cors");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();

// --- Allow requests from your frontend (Vite dev server) ---
const corsOptions = {
  origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions));

// --- Parse JSON bodies ---
app.use(express.json());

// --- Database Setup ---
const dbPath = path.join(__dirname, "database.db");
const db = new sqlite3.Database(dbPath);

// Run your SQL setup script (create tables if not existing)
const sql = fs.readFileSync(path.join(__dirname, "database.sql"), "utf8");
db.exec(sql, (err) => {
  if (err) console.error("Error executing SQL file:", err);
  else console.log("✅ Database initialized successfully!");
});

// --- Test Route ---
app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "strawberry", "pineapple"] });
});

// --- LOGIN ROUTE ---
app.post("/login", (req, res) => {
  const { username, password, selectedRole } = req.body;

  if (!username || !password || !selectedRole) {
    return res.status(400).json({ message: "Missing fields" });
  }

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Plaintext password check (fine for uni project)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    let warning = null;
    if (selectedRole.toLowerCase() !== user.position.toLowerCase()) {
      warning = `⚠️ Please choose the correct option next time — you are actually a ${user.position}.`;
    }

    res.json({
      message: "Login successful",
      actualRole: user.position,
      warning,
    });
  });
});

// --- Start Server ---
app.listen(8080, () => {
  console.log("✅ Server started on http://localhost:8080");
});
