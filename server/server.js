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

// Fetch number of pending leave approvals

app.get('/api/hr/pending-leaves-count', requireAdminHR, async (req, res) => {
  try {
    const result = await dbGet(
      `SELECT COUNT(*) AS count
       FROM EmployeeLeaves
       WHERE status = 'Pending'`
    );

    res.json({ pending: result.count });
  } catch (error) {
    console.error('Pending leaves count error:', error);
    res.status(500).json({ error: 'Failed to fetch pending leave approvals' });
  }
});

//Fetch total employee count

app.get("/api/hr/employee-count", requireAdminHR, async (req, res) => {
  try {
    const row = await dbGet(`
      SELECT COUNT(*) AS total
      FROM users
      WHERE is_active = 1
    `);

    res.json({ total: row.total });
  } catch (error) {
    console.error("Employee count error:", error);
    res.status(500).json({ error: "Failed to fetch employee count" });
  }
});


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
});

// Add new employee

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


// Leave Request Submission
app.post("/api/leave-request", async (req, res) => {
  const { usersId, leaveType, startDate, endDate, reason } = req.body;

  console.log("Leave request received:", { usersId, leaveType, startDate, endDate });

  if (!usersId || !leaveType || !startDate || !endDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start <= today) {
    return res.status(400).json({ message: "Start date must be after today" });
  }
  if (end <= start) {
    return res.status(400).json({ message: "End date must be after the start date" });
  }

  // Calculate days requested
  const daysRequested = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  console.log(`Days requested: ${daysRequested}`);
  
  try {
    // Check user's leave balance
    const user = await dbGet(`
      SELECT leave_balance, name 
      FROM users 
      WHERE id = ?
    `, [usersId]);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log(`User balance: ${user.leave_balance}, Days requested: ${daysRequested}`);
    
    if (user.leave_balance < daysRequested) {
      return res.status(400).json({ 
        message: `Insufficient leave balance. ${user.name} has ${user.leave_balance} days left, but requested ${daysRequested} days.`,
        currentBalance: user.leave_balance,
        daysRequested: daysRequested
      });
    }
    
    // If enough balance, proceed with submission
    const sql = `
      INSERT INTO EmployeeLeaves (users_id, leave_type, start_date, end_date, reason, status)
      VALUES (?, ?, ?, ?, ?, 'Pending')
    `;

    const result = await dbRun(sql, [usersId, leaveType, startDate, endDate, reason || null]);
    
    console.log(`Leave request inserted with ID: ${result.id}`);
    
    return res.status(201).json({
      success: true,
      message: "Leave request submitted successfully!",
      leaveId: result.lastID,
      daysRequested: daysRequested,
      remainingBalance: user.leave_balance,
      note: "Balance will be deducted when leave is approved"
    });
    
  } catch (error) {
    console.error("Database error in leave request:", error);
    return res.status(500).json({ 
      message: "Database error",
      error: error.message 
    });
  }
});

// STAT FETCH ROUTE
app.get('/api/employee/dashboard-stats', async (req, res) => {
  const userId = req.headers['user-id'];
  
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // Get user data including salary and leave balance
    const user = await dbGet(`
      SELECT salary, leave_balance 
      FROM users 
      WHERE id = ?
    `, [userId]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // For now, calculate mock data for next payment and YTD
    // replace these with real calculations later --P
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const nextPaymentDate = lastDayOfMonth.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    // Mock - calculate this from payslips table when it's done -- P
    const mockYTD = user.salary * 3; // Assuming 3 months salary paid

    res.json({
      currentSalary: user.salary || 0,
      leaveBalance: user.leave_balance || 12,
      nextPayment: nextPaymentDate,
      ytdEarnings: mockYTD,
      // Include any other here -- P
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get employee leaves
app.get('/api/employee/leaves', async (req, res) => {
  const userId = req.query.userId || req.headers['user-id'];
  
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const leaves = await dbAll(`
      SELECT 
        leave_id,
        leave_type,
        start_date,
        end_date,
        status,
        created_at
      FROM EmployeeLeaves 
      WHERE users_id = ?
      ORDER BY start_date DESC
    `, [userId]);

    res.json(leaves);
  } catch (error) {
    console.error('Leaves fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch leaves' });
  }
});

// Get all leaves for HR/Admin management
app.get('/api/admin/leaves', requireAdminHR, async (req, res) => {
  try {
    const leaves = await dbAll(`
      SELECT 
        l.leave_id,
        l.leave_type,
        l.start_date,
        l.end_date,
        l.status,
        l.created_at,
        u.name as employee_name,
        u.employee_id,
        u.position as employee_position,
        u.department
      FROM EmployeeLeaves l
      JOIN users u ON l.users_id = u.id
      ORDER BY l.created_at DESC
    `);

    res.json(leaves);
  } catch (error) {
    console.error('Admin leaves fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch leaves' });
  }
});

// Approve leave request and deduct leave balance
app.put('/api/admin/leaves/:id/approve', requireAdminHR, async (req, res) => {
  const { id } = req.params;

  try {
    await dbRun('BEGIN TRANSACTION');
    
    // Get leave details
    const leave = await dbGet(`
      SELECT l.*, u.leave_balance, u.name as employee_name
      FROM EmployeeLeaves l
      JOIN users u ON l.users_id = u.id
      WHERE l.leave_id = ?
    `, [id]);
    
  if (!leave) {
    await dbRun('ROLLBACK');
    return res.status(404).json({ error: 'Leave not found' });
  }

  if (leave.status === 'Approved') {
    await dbRun('ROLLBACK');
    return res.status(400).json({ error: 'Leave already approved' });
  }  
    
    // Calculate days
    const startDate = new Date(leave.start_date);
    const endDate = new Date(leave.end_date);
    const daysRequested = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    // Check balance
    if (leave.leave_balance < daysRequested) {
      await dbRun('ROLLBACK');
      return res.status(400).json({
        error: 'Insufficient leave balance',
        currentBalance: leave.leave_balance,
        daysRequested
      });
    }
    
    // Update leave status
    await dbRun(
      'UPDATE EmployeeLeaves SET status = ? WHERE leave_id = ?',
      ['Approved', id]
    );
    
    // Update user balance
    const newBalance = leave.leave_balance - daysRequested;
    await dbRun(
      'UPDATE users SET leave_balance = leave_balance - ? WHERE id = ?',
      [daysRequested, leave.users_id]
    );
    
    // Log to audit
    await dbRun(
      `INSERT INTO audit_logs (user_id, action, details) 
       VALUES (?, ?, ?)`,
      [req.userId, 'LEAVE_APPROVED', 
       `Approved leave ${id}. Deducted ${daysRequested} days.`]
    );

    await dbRun('COMMIT');
    
    res.json({ 
      success: true, 
      message: 'Leave approved successfully',
      daysDeducted: daysRequested,
      newBalance: newBalance
    });
    
  } catch (error) {
    await dbRun('ROLLBACK');
    console.error('Error approving leave:', error);
    res.status(500).json({ error: 'Failed to approve leave' });
  }
});
// Reject leave request
app.put('/api/admin/leaves/:id/reject', requireAdminHR, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    // Check if leave exists
    const leave = await dbGet('SELECT * FROM EmployeeLeaves WHERE leave_id = ?', [id]);
    if (!leave) {
      return res.status(404).json({ error: 'Leave not found' });
    }
    
    // If leave was previously approved and we're rejecting it now,
    // we might want to restore the balance
    if (leave.status === 'Approved') {
      // Calculate days to restore
      const startDate = new Date(leave.start_date);
      const endDate = new Date(leave.end_date);
      const daysToRestore = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      
      // Restore leave balance
      const user = await dbGet('SELECT leave_balance FROM users WHERE id = ?', [leave.users_id]);
      const newBalance = (user.leave_balance || 0) + daysToRestore;
      
      await dbRun(
        'UPDATE users SET leave_balance = ? WHERE id = ?',
        [newBalance, leave.users_id]
      );
    }
    
    // Update status to Rejected
    await dbRun(
      'UPDATE EmployeeLeaves SET status = ? WHERE leave_id = ?',
      ['Rejected', id]
    );
    
    // Log to audit logs
    const details = reason 
      ? `Rejected leave request ${id} for employee ${leave.users_id}. Reason: ${reason}`
      : `Rejected leave request ${id} for employee ${leave.users_id}`;
    
    await dbRun(
      `INSERT INTO audit_logs (user_id, action, details) 
       VALUES (?, ?, ?)`,
      [req.userId, 'LEAVE_REJECTED', details]
    );
    
    res.json({ 
      success: true, 
      message: 'Leave request rejected successfully' 
    });
  } catch (error) {
    console.error('Error rejecting leave:', error);
    res.status(500).json({ error: 'Failed to reject leave' });
  }
});
// Optional: Single endpoint for both approve/reject with status parameter
app.put('/api/admin/leaves/:id/status', requireAdminHR, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    
    // Validate status
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be "Approved" or "Rejected"' });
    }
    
    // Check if leave exists
    const leave = await dbGet('SELECT * FROM EmployeeLeaves WHERE leave_id = ?', [id]);
    if (!leave) {
      return res.status(404).json({ error: 'Leave not found' });
    }
    
    // Update status
    await dbRun(
      'UPDATE EmployeeLeaves SET status = ? WHERE leave_id = ?',
      [status, id]
    );
    
    // Log to audit logs
    const action = status === 'Approved' ? 'LEAVE_APPROVED' : 'LEAVE_REJECTED';
    let details = `${status} leave request ${id} for employee ${leave.users_id}`;
    if (reason && status === 'Rejected') {
      details += `. Reason: ${reason}`;
    }
    
    await dbRun(
      `INSERT INTO audit_logs (user_id, action, details) 
       VALUES (?, ?, ?)`,
      [req.userId, action, details]
    );
    
    res.json({ 
      success: true, 
      message: `Leave request ${status.toLowerCase()} successfully` 
    });
  } catch (error) {
    console.error('Error updating leave status:', error);
    res.status(500).json({ error: 'Failed to update leave status' });
  }
});

// Middleware for finance access
const requireFinance = async (req, res, next) => {
  const userId = req.headers['user-id'];
  if (!userId) return res.status(401).json({ error: 'Authentication required' });

  const user = await dbGet(
    'SELECT position FROM users WHERE id = ?',
    [userId]
  );

  if (!user || user.position !== 'Finance') {
    return res.status(403).json({ error: 'Finance access only' });
  }

  next();
};

//Count pending payslips
app.get("/api/finance/pending-payments-count", async (req, res) => {
  try {
    const result = await dbGet(`
      SELECT COUNT(*) AS count
      FROM payslips
      WHERE status = 'Pending'
    `);

    res.json({ pending: result.count });
  } catch (error) {
    console.error("Pending payments count error:", error);
    res.status(500).json({ error: "Failed to fetch pending payments count" });
  }
});


// Payroll summary for finance
app.get('/api/finance/payroll-summary', requireFinance, async (req, res) => {
  try {
    const TAX_RATE = 0.20;

    
    const rows = await dbAll(`
      SELECT salary
      FROM users
      WHERE is_active = 1
    `);

    const grossPayroll = rows.reduce(
      (sum, row) => sum + (row.salary * 3),
      0
    );

    const taxAmount = grossPayroll * TAX_RATE;
    const netPayroll = grossPayroll - taxAmount;

    res.json({
      quarter: 'Q1',
      grossPayroll,
      taxRate: TAX_RATE,
      taxAmount,
      netPayroll
    });
  } catch (error) {
    console.error('Payroll summary error:', error);
    res.status(500).json({ error: 'Failed to generate payroll report' });
  }
});

// Get count of employees on leave today
app.get('/api/leaves/today-count', async (req, res) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    console.log(`Counting leaves for date: ${today}`);
    
    // More robust query
    const result = await dbGet(`
      SELECT COUNT(DISTINCT u.id) as count
      FROM EmployeeLeaves l
      JOIN users u ON l.users_id = u.id
      WHERE l.status = 'Approved'
        AND date('${today}') >= date(l.start_date)
        AND date('${today}') <= date(l.end_date)
        AND u.is_active = 1
    `);
    
    console.log(`Today's leave count result:`, result);
    
    // Always return a number, even if result is undefined
    const count = result?.count || 0;
    
    res.json({ 
      success: true,
      count: count,
      today: today
    });
  } catch (error) {
    console.error('Error counting today\'s leaves:', error);
    res.json({ 
      success: false,
      count: 0,
      error: error.message 
    });
  }
});

// Start server
const PORT = 8080;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));