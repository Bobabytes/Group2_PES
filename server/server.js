const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json());

const dbPath = path.join(__dirname, "database.db");
const db = new sqlite3.Database(dbPath);

// Helper functions
const dbAll = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});

const dbGet = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
});

const dbRun = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function(err) {
    err ? reject(err) : resolve({ id: this.lastID, changes: this.changes });
  });
});

// Helper to check if user is admin
const isAdmin = (position) => {
  const pos = position.toLowerCase();
  return pos === 'admin' || pos === 'administrator';
};

// --- Routes ---
app.get("/api", (req, res) => res.json({ fruits: ["apple", "strawberry", "pineapple"] }));

// Login
app.post("/login", async (req, res) => {
  const { username, password, selectedRole } = req.body;
  
  try {
    const user = await dbGet("SELECT * FROM users WHERE username = ?", [username]);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    
    res.json({
      message: "Login successful",
      id: user.id,
      actualRole: user.position,
      userId: user.id,
      username: user.username,
      name: user.name || user.username,
    });
  } catch (err) {
    res.status(500).json({ message: "Database error" });
  }
});

// Middleware for admin/hr access
const requireAdminHR = async (req, res, next) => {
  const userId = req.headers['user-id'];
  if (!userId) return res.status(401).json({ error: 'Authentication required' });

  try {
    const user = await dbGet('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) return res.status(401).json({ error: 'User not found' });

    const userPosition = user.position.toLowerCase();
    const allowedPositions = ['administrator', 'admin', 'hr', 'manager'];
    
    if (!allowedPositions.includes(userPosition)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    req.userRole = user.position;
    req.userId = user.id;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Employee Management
app.get('/api/admin/employees', requireAdminHR, async (req, res) => {
  try {
    const employees = await dbAll(`
      SELECT id, username, name, position, department, employee_id, salary, is_active
      FROM users ORDER BY is_active DESC, name ASC
    `);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  if (end <= start) {
    return res.status(400).json({ message: "End date must be after the start date" });
  }

  const sql = `
    INSERT INTO EmployeeLeaves (users_id, leave_type, start_date, end_date)
    VALUES (?, ?, ?, ?)
  `;

  db.run(sql, [usersId, leaveType, startDate, endDate], function (err) {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    
    return res.status(201).json({
    message: "Leave request successfully submitted!",
    leaveId: this.lastID,
  });
  });
});

app.post('/api/admin/employees', requireAdminHR, async (req, res) => {
  try {
    const { username, name, password, position, department, employee_id, salary } = req.body;
    
    if (!username || !password || !position) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const existing = await dbGet('SELECT id FROM users WHERE username = ?', [username]);
    if (existing) return res.status(400).json({ error: 'Username exists' });

    const result = await dbRun(
      `INSERT INTO users (username, password, name, position, department, employee_id, salary, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [username, password, name || username, position, department || '', employee_id || '', salary || 0]
    );

    const newEmployee = await dbGet(
      `SELECT id, username, name, position, department, employee_id, salary, is_active 
       FROM users WHERE id = ?`, [result.id]
    );

    res.json({ success: true, message: 'Employee added', employee: newEmployee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/employees/:id', requireAdminHR, async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await dbGet('SELECT id FROM users WHERE id = ?', [id]);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    await dbRun('UPDATE users SET is_active = 0 WHERE id = ?', [id]);
    res.json({ success: true, message: 'Employee deactivated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/employees/:id/reactivate', requireAdminHR, async (req, res) => {
  try {
    const { id } = req.params;
    await dbRun('UPDATE users SET is_active = 1 WHERE id = ?', [id]);
    res.json({ success: true, message: 'Employee reactivated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Permanent delete (admin only)
app.delete('/api/admin/employees/:id/permanent', requireAdminHR, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isAdmin(req.userRole)) {
      return res.status(403).json({ error: 'Admin only' });
    }
    
    await dbRun('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true, message: 'Employee permanently deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update employee
app.put('/api/admin/employees/:id', requireAdminHR, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];
    
    await dbRun(`UPDATE users SET ${setClause} WHERE id = ?`, values);
    res.json({ success: true, message: 'Employee updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = 8080;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));