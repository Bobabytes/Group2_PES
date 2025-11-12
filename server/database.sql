CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  position TEXT
)

-- Create a table for storing leave records
CREATE TABLE IF NOT EXISTS Leaves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employeeId TEXT NOT NULL,
    days_off INTEGER NOT NULL,
    date_of_leave DATETIME NOT NULL,
    FOREIGN KEY (employeeId) REFERENCES Users(employeeId)
);

-- Create a table for storing team information
CREATE TABLE IF NOT EXISTS Teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    manager_user_id INTEGER NOT NULL,
    FOREIGN KEY (manager_user_id) REFERENCES Users(id)
);

-- Create a table for storing team members
CREATE TABLE IF NOT EXISTS TeamMembers (
    team_id INTEGER NOT NULL,
    member_user_id INTEGER NOT NULL,
    PRIMARY KEY (team_id, member_user_id),
    FOREIGN KEY (team_id) REFERENCES Teams(id),
    FOREIGN KEY (member_user_id) REFERENCES Users(id)
);

-- Create a table for storing attendance records
CREATE TABLE IF NOT EXISTS Attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PRESENT','ABSENT','LATE')),
    recorded_by INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (recorded_by) REFERENCES Users(id)
);