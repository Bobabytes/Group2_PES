-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS EmployeeLeaves;
DROP TABLE IF EXISTS payslips;
DROP TABLE IF EXISTS users;

-- Create users table with ALL required columns
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  position TEXT NOT NULL,
  department TEXT,
  employee_id TEXT UNIQUE,
  salary DECIMAL(10, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Simple payslips table for PDF testing
CREATE TABLE payslips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  month TEXT,
  year INTEGER,
  amount DECIMAL(10, 2),
  status TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS EmployeeLeaves (
  leave_id INTEGER PRIMARY KEY AUTOINCREMENT,
  users_id INTEGER NOT NULL,
  leave_type TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (users_id) REFERENCES users(id)
);

-- Create audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_position ON users(position);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_employee_id ON users(employee_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_payslips_user_id ON payslips(user_id);
CREATE INDEX idx_employee_leaves_user_id ON EmployeeLeaves(users_id);

-- Insert test users (including admin for testing)
INSERT INTO users (username, password, name, email, phone, position, department, employee_id, salary, is_active) VALUES 
('john', '123', 'John Smith', 'john@company.com', '+1 (555) 111-2233', 'Employee', 'Engineering', 'EMP001', 5400, 1),
('jane', '123', 'Jane Doe', 'jane@company.com', '+1 (555) 222-3344', 'Manager', 'Management', 'EMP002', 7200, 1),
('bob', '123', 'Bob Johnson', 'bob@company.com', '+1 (555) 333-4455', 'HR', 'Human Resources', 'EMP003', 4700, 1),
('admin', 'admin123', 'Admin User', 'admin@company.com', '+1 (555) 444-5566', 'Administrator', 'Administration', 'EMP004', 10000, 1);

-- Insert sample payslip data for PDF testing
INSERT INTO payslips (user_id, month, year, amount, status) VALUES 
-- John's payslips (user_id = 1)
(1, 'March', 2024, 5400, 'Paid'),
(1, 'February', 2024, 5400, 'Paid'),
(1, 'January', 2024, 5200, 'Paid'),

-- Jane's payslips (user_id = 2)
(2, 'March', 2024, 7200, 'Paid'),
(2, 'February', 2024, 7000, 'Paid'),

-- Bob's payslips (user_id = 3)
(3, 'March', 2024, 4700, 'Paid'),

-- Admin's payslip (user_id = 4)
(4, 'March', 2024, 10000, 'Paid');

-- Insert sample leave requests
INSERT INTO EmployeeLeaves (users_id, leave_type, start_date, end_date, status) VALUES
(1, 'Annual Leave', '2024-04-01', '2024-04-05', 'Approved'),
(2, 'Sick Leave', '2024-04-10', '2024-04-11', 'Pending'),
(3, 'Personal Leave', '2024-04-15', '2024-04-16', 'Pending');

-- Verify data
SELECT '=== USERS TABLE ===' as table_name;
SELECT 
  id,
  username,
  name,
  position,
  department,
  employee_id,
  salary,
  is_active
FROM users;

SELECT '=== PAYSLIPS TABLE ===' as table_name;
SELECT 
  u.username,
  u.position,
  p.month,
  p.year,
  p.amount,
  p.status
FROM users u
JOIN payslips p ON u.id = p.user_id
ORDER BY u.id, p.year DESC, p.month DESC;

SELECT '=== LEAVE REQUESTS ===' as table_name;
SELECT 
  u.username,
  u.position,
  l.leave_type,
  l.start_date,
  l.end_date,
  l.status
FROM users u
JOIN EmployeeLeaves l ON u.id = l.users_id
ORDER BY l.status, l.start_date;