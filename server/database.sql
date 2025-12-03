-- Drop tables if they exist
DROP TABLE IF EXISTS payslips;
DROP TABLE IF EXISTS users;

-- Your exact users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  position TEXT
);

-- Simple payslips table for PDF testing
CREATE TABLE payslips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  month TEXT,
  year INTEGER,
  amount DECIMAL(10, 2),
  status TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS EmployeeLeaves (
  leave_id INTEGER PRIMARY KEY AUTOINCREMENT,
  users_id INTEGER NOT NULL,
  leave_type TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  FOREIGN KEY (users_id) REFERENCES users(id)
);

-- Insert test users
INSERT INTO users (username, password, position) VALUES 
('john', '123', 'Employee'),
('jane', '123', 'Manager'),
('bob', '123', 'HR');

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
(3, 'March', 2024, 4700, 'Paid');

-- Verify data
SELECT 
  u.username,
  u.position,
  p.month,
  p.year,
  p.amount,
  p.status
FROM users u
JOIN payslips p ON u.id = p.user_id;
