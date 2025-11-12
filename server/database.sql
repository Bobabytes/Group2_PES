
CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employeeId TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);





INSERT OR IGNORE INTO Users (employeeId, password, role) VALUES 
('HR001', 'hr2024', 'hr'),
('IT001', 'tech123', 'employee'),
('ADM001', 'admin456', 'admin'),
('FIN001', 'finance789', 'employee'),
('OPS001', 'ops2024', 'manager'),
('MKT001', 'mkt123', 'employee'),
('IT002', 'admin789', 'admin'),
('HR002', 'hr456', 'employee'),
('SAL001', 'sales123', 'manager'),
('CS001', 'service456', 'employee');