CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  position TEXT
);

CREATE TABLE IF NOT EXISTS LeaveRequests (
  leave_id INTEGER PRIMARY KEY AUTOINCREMENT,
  users_id INTEGER NOT NULL,
  leave_type TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  FOREIGN KEY (users_id) REFERENCES users(id)
);