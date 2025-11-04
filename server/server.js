const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
    origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));

// Backend route for frontend interaction
app.get("/api", (req, res) => {
    res.json({ "fruits": ["apple", "strawberry", "pineapple"] });
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

const sql = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');

db.exec(sql, (err) => {
  if (err) console.error('Error executing SQL file:', err);
  else console.log('Users table created successfully!');
  db.close();
});
