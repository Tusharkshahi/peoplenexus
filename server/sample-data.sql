-- PeopleNexus HRMS Sample Data
-- Run this after database-setup.sql

-- Connect to the database
\c peoplenexus_db;

-- ================================
-- SAMPLE USERS
-- ================================

-- Note: All passwords are 'password123' hashed with bcrypt
INSERT INTO users (id, email, password_hash, role, first_name, last_name, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@peoplenexus.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBNWkDq0zPUPBq', 'admin', 'System', 'Administrator', true),
('550e8400-e29b-41d4-a716-446655440001', 'hr@peoplenexus.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBNWkDq0zPUPBq', 'hr', 'Sarah', 'Johnson', true),
('550e8400-e29b-41d4-a716-446655440002', 'manager@peoplenexus.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBNWkDq0zPUPBq', 'manager', 'Michael', 'Chen', true),
('550e8400-e29b-41d4-a716-446655440003', 'john.doe@peoplenexus.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBNWkDq0zPUPBq', 'employee', 'John', 'Doe', true),
('550e8400-e29b-41d4-a716-446655440004', 'jane.smith@peoplenexus.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBNWkDq0zPUPBq', 'employee', 'Jane', 'Smith', true),
('550e8400-e29b-41d4-a716-446655440005', 'robert.wilson@peoplenexus.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBNWkDq0zPUPBq', 'employee', 'Robert', 'Wilson', true),
('550e8400-e29b-41d4-a716-446655440006', 'emily.davis@peoplenexus.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBNWkDq0zPUPBq', 'employee', 'Emily', 'Davis', true),
('550e8400-e29b-41d4-a716-446655440007', 'david.brown@peoplenexus.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBNWkDq0zPUPBq', 'manager', 'David', 'Brown', true);

-- ================================
-- SAMPLE DEPARTMENTS
-- ================================

INSERT INTO departments (id, name, description, budget, location, is_active) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Human Resources', 'Responsible for employee relations, recruitment, and policy management', 500000.00, 'Building A - Floor 2', true),
('650e8400-e29b-41d4-a716-446655440002', 'Information Technology', 'Manages technology infrastructure and software development', 1200000.00, 'Building B - Floor 3', true),
('650e8400-e29b-41d4-a716-446655440003', 'Finance', 'Handles financial planning, accounting, and budget management', 800000.00, 'Building A - Floor 1', true),
('650e8400-e29b-41d4-a716-446655440004', 'Marketing', 'Responsible for marketing strategies and brand management', 600000.00, 'Building C - Floor 1', true),
('650e8400-e29b-41d4-a716-446655440005', 'Operations', 'Manages day-to-day business operations and processes', 900000.00, 'Building A - Floor 3', true),
('650e8400-e29b-41d4-a716-446655440006', 'Sales', 'Responsible for revenue generation and client relationships', 1000000.00, 'Building C - Floor 2', true);

-- ================================
-- SAMPLE EMPLOYEES
-- ================================

INSERT INTO employees (
    id, employee_id, user_id, first_name, last_name, email, phone, 
    date_of_birth, gender, address, city, state, postal_code, country,
    department_id, position, hire_date, employment_type, status,
    salary, currency, emergency_contact_name, emergency_contact_phone, 
    emergency_contact_relationship, created_by
) VALUES
-- HR Team
('750e8400-e29b-41d4-a716-446655440001', 'EMP001', '550e8400-e29b-41d4-a716-446655440001', 'Sarah', 'Johnson', 'hr@peoplenexus.com', '+1-555-0101', 
 '1985-03-15', 'female', '123 Oak Street', 'New York', 'NY', '10001', 'USA',
 '650e8400-e29b-41d4-a716-446655440001', 'HR Manager', '2020-01-15', 'full-time', 'active',
 85000.00, 'USD', 'Mark Johnson', '+1-555-0102', 'spouse', '550e8400-e29b-41d4-a716-446655440000'),

-- IT Team
('750e8400-e29b-41d4-a716-446655440002', 'EMP002', '550e8400-e29b-41d4-a716-446655440002', 'Michael', 'Chen', 'manager@peoplenexus.com', '+1-555-0201', 
 '1988-07-22', 'male', '456 Pine Avenue', 'San Francisco', 'CA', '94102', 'USA',
 '650e8400-e29b-41d4-a716-446655440002', 'IT Manager', '2019-03-01', 'full-time', 'active',
 95000.00, 'USD', 'Lisa Chen', '+1-555-0202', 'spouse', '550e8400-e29b-41d4-a716-446655440000'),

('750e8400-e29b-41d4-a716-446655440003', 'EMP003', '550e8400-e29b-41d4-a716-446655440003', 'John', 'Doe', 'john.doe@peoplenexus.com', '+1-555-0301', 
 '1990-11-08', 'male', '789 Elm Street', 'Austin', 'TX', '73301', 'USA',
 '650e8400-e29b-41d4-a716-446655440002', 'Senior Software Engineer', '2021-06-15', 'full-time', 'active',
 90000.00, 'USD', 'Mary Doe', '+1-555-0302', 'spouse', '550e8400-e29b-41d4-a716-446655440001'),

('750e8400-e29b-41d4-a716-446655440004', 'EMP004', '550e8400-e29b-41d4-a716-446655440004', 'Jane', 'Smith', 'jane.smith@peoplenexus.com', '+1-555-0401', 
 '1992-05-03', 'female', '321 Maple Drive', 'Seattle', 'WA', '98101', 'USA',
 '650e8400-e29b-41d4-a716-446655440002', 'Frontend Developer', '2022-02-01', 'full-time', 'active',
 75000.00, 'USD', 'Tom Smith', '+1-555-0402', 'brother', '550e8400-e29b-41d4-a716-446655440001'),

-- Finance Team
('750e8400-e29b-41d4-a716-446655440005', 'EMP005', '550e8400-e29b-41d4-a716-446655440005', 'Robert', 'Wilson', 'robert.wilson@peoplenexus.com', '+1-555-0501', 
 '1987-09-12', 'male', '654 Cedar Lane', 'Chicago', 'IL', '60601', 'USA',
 '650e8400-e29b-41d4-a716-446655440003', 'Financial Analyst', '2020-08-20', 'full-time', 'active',
 70000.00, 'USD', 'Susan Wilson', '+1-555-0502', 'spouse', '550e8400-e29b-41d4-a716-446655440001'),

-- Marketing Team
('750e8400-e29b-41d4-a716-446655440006', 'EMP006', '550e8400-e29b-41d4-a716-446655440006', 'Emily', 'Davis', 'emily.davis@peoplenexus.com', '+1-555-0601', 
 '1991-12-25', 'female', '987 Birch Road', 'Los Angeles', 'CA', '90210', 'USA',
 '650e8400-e29b-41d4-a716-446655440004', 'Marketing Specialist', '2021-11-10', 'full-time', 'active',
 60000.00, 'USD', 'James Davis', '+1-555-0602', 'father', '550e8400-e29b-41d4-a716-446655440001'),

-- Operations Team
('750e8400-e29b-41d4-a716-446655440007', 'EMP007', '550e8400-e29b-41d4-a716-446655440007', 'David', 'Brown', 'david.brown@peoplenexus.com', '+1-555-0701', 
 '1984-04-18', 'male', '159 Spruce Circle', 'Denver', 'CO', '80201', 'USA',
 '650e8400-e29b-41d4-a716-446655440005', 'Operations Manager', '2018-12-03', 'full-time', 'active',
 88000.00, 'USD', 'Patricia Brown', '+1-555-0702', 'spouse', '550e8400-e29b-41d4-a716-446655440001');

-- ================================
-- UPDATE DEPARTMENT MANAGERS
-- ================================

UPDATE departments SET manager_id = '750e8400-e29b-41d4-a716-446655440001' WHERE name = 'Human Resources';
UPDATE departments SET manager_id = '750e8400-e29b-41d4-a716-446655440002' WHERE name = 'Information Technology';
UPDATE departments SET manager_id = '750e8400-e29b-41d4-a716-446655440007' WHERE name = 'Operations';

-- ================================
-- SAMPLE POSITIONS
-- ================================

INSERT INTO positions (id, title, department_id, description, min_salary, max_salary, is_active) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'HR Manager', '650e8400-e29b-41d4-a716-446655440001', 'Lead HR operations and strategy', 70000, 90000, true),
('850e8400-e29b-41d4-a716-446655440002', 'HR Specialist', '650e8400-e29b-41d4-a716-446655440001', 'Handle recruitment and employee relations', 45000, 60000, true),
('850e8400-e29b-41d4-a716-446655440003', 'IT Manager', '650e8400-e29b-41d4-a716-446655440002', 'Manage IT department and technology strategy', 90000, 120000, true),
('850e8400-e29b-41d4-a716-446655440004', 'Senior Software Engineer', '650e8400-e29b-41d4-a716-446655440002', 'Develop and maintain software applications', 80000, 110000, true),
('850e8400-e29b-41d4-a716-446655440005', 'Frontend Developer', '650e8400-e29b-41d4-a716-446655440002', 'Develop user interfaces and web applications', 60000, 85000, true),
('850e8400-e29b-41d4-a716-446655440006', 'Backend Developer', '650e8400-e29b-41d4-a716-446655440002', 'Develop server-side applications and APIs', 65000, 90000, true),
('850e8400-e29b-41d4-a716-446655440007', 'Financial Analyst', '650e8400-e29b-41d4-a716-446655440003', 'Analyze financial data and create reports', 55000, 75000, true),
('850e8400-e29b-41d4-a716-446655440008', 'Accountant', '650e8400-e29b-41d4-a716-446655440003', 'Manage financial records and transactions', 45000, 65000, true),
('850e8400-e29b-41d4-a716-446655440009', 'Marketing Specialist', '650e8400-e29b-41d4-a716-446655440004', 'Execute marketing campaigns and strategies', 45000, 65000, true),
('850e8400-e29b-41d4-a716-446655440010', 'Operations Manager', '650e8400-e29b-41d4-a716-446655440005', 'Manage daily operations and processes', 70000, 95000, true);

-- ================================
-- SAMPLE LEAVE REQUESTS
-- ================================

INSERT INTO leave_requests (
    employee_id, type, start_date, end_date, days_requested, reason, status, approved_by, approved_at
) VALUES
('750e8400-e29b-41d4-a716-446655440003', 'vacation', '2024-12-23', '2024-12-30', 6, 'Christmas holiday vacation with family', 'approved', '550e8400-e29b-41d4-a716-446655440002', '2024-12-01 09:30:00'),
('750e8400-e29b-41d4-a716-446655440004', 'sick', '2024-11-15', '2024-11-16', 2, 'Flu symptoms and fever', 'approved', '550e8400-e29b-41d4-a716-446655440002', '2024-11-15 08:00:00'),
('750e8400-e29b-41d4-a716-446655440005', 'personal', '2024-12-15', '2024-12-15', 1, 'Personal appointment', 'pending', NULL, NULL),
('750e8400-e29b-41d4-a716-446655440006', 'vacation', '2025-01-20', '2025-01-24', 5, 'Winter vacation', 'pending', NULL, NULL),
('750e8400-e29b-41d4-a716-446655440007', 'sick', '2024-11-28', '2024-11-29', 2, 'Medical checkup', 'approved', '550e8400-e29b-41d4-a716-446655440001', '2024-11-27 16:45:00');

-- ================================
-- SAMPLE PAYROLL RECORDS
-- ================================

INSERT INTO payroll (
    employee_id, pay_period_start, pay_period_end, gross_salary, overtime_hours, overtime_pay,
    bonus, tax_deductions, health_insurance, retirement_contribution, total_deductions, net_pay,
    payment_date, payment_method, payment_status, processed_by
) VALUES
('750e8400-e29b-41d4-a716-446655440003', '2024-11-01', '2024-11-30', 7500.00, 8.0, 375.00, 0.00, 
 1575.00, 150.00, 375.00, 2100.00, 5775.00, '2024-12-01', 'bank_transfer', 'processed', '550e8400-e29b-41d4-a716-446655440001'),

('750e8400-e29b-41d4-a716-446655440004', '2024-11-01', '2024-11-30', 6250.00, 4.0, 156.25, 500.00, 
 1356.25, 150.00, 312.50, 1818.75, 5087.50, '2024-12-01', 'bank_transfer', 'processed', '550e8400-e29b-41d4-a716-446655440001'),

('750e8400-e29b-41d4-a716-446655440005', '2024-11-01', '2024-11-30', 5833.33, 0.0, 0.00, 0.00, 
 1225.00, 150.00, 291.67, 1666.67, 4166.66, '2024-12-01', 'bank_transfer', 'processed', '550e8400-e29b-41d4-a716-446655440001'),

('750e8400-e29b-41d4-a716-446655440006', '2024-11-01', '2024-11-30', 5000.00, 2.0, 62.50, 0.00, 
 1050.00, 150.00, 250.00, 1450.00, 3612.50, '2024-12-01', 'bank_transfer', 'processed', '550e8400-e29b-41d4-a716-446655440001');

-- ================================
-- SAMPLE PERFORMANCE REVIEWS
-- ================================

INSERT INTO performance_reviews (
    employee_id, reviewer_id, review_period_start, review_period_end, review_type,
    goals, achievements, areas_for_improvement, manager_feedback,
    overall_rating, technical_skills_rating, communication_rating, teamwork_rating,
    status, submitted_at
) VALUES
('750e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440002', '2024-01-01', '2024-12-31', 'annual',
 'Complete 3 major projects, improve code quality, mentor junior developers',
 'Successfully delivered project management system, implemented CI/CD pipeline, mentored 2 junior developers',
 'Time management during peak periods, documentation practices',
 'John has shown excellent technical leadership and consistently delivers high-quality work. His mentoring skills have been valuable to the team.',
 4, 5, 4, 5, 'completed', '2024-11-30 14:30:00'),

('750e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440002', '2024-01-01', '2024-12-31', 'annual',
 'Master React framework, improve UI/UX skills, collaborate effectively with design team',
 'Redesigned main application interface, improved page load times by 40%, completed advanced React certification',
 'Backend integration knowledge, testing practices',
 'Jane has made significant improvements in frontend development skills and shows great attention to detail in UI design.',
 4, 4, 5, 4, 'completed', '2024-11-28 10:15:00');

-- ================================
-- SAMPLE ATTENDANCE RECORDS (Last 7 days)
-- ================================

-- John Doe attendance
INSERT INTO attendance (employee_id, date, check_in_time, check_out_time, total_hours, status) VALUES
('750e8400-e29b-41d4-a716-446655440003', CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE - INTERVAL '6 days' + TIME '09:00:00', CURRENT_DATE - INTERVAL '6 days' + TIME '17:30:00', 8.0, 'present'),
('750e8400-e29b-41d4-a716-446655440003', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '5 days' + TIME '09:15:00', CURRENT_DATE - INTERVAL '5 days' + TIME '17:45:00', 8.0, 'late'),
('750e8400-e29b-41d4-a716-446655440003', CURRENT_DATE - INTERVAL '4 days', CURRENT_DATE - INTERVAL '4 days' + TIME '08:45:00', CURRENT_DATE - INTERVAL '4 days' + TIME '17:15:00', 8.0, 'present'),
('750e8400-e29b-41d4-a716-446655440003', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '3 days' + TIME '09:00:00', CURRENT_DATE - INTERVAL '3 days' + TIME '17:30:00', 8.0, 'present');

-- Jane Smith attendance
INSERT INTO attendance (employee_id, date, check_in_time, check_out_time, total_hours, status) VALUES
('750e8400-e29b-41d4-a716-446655440004', CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE - INTERVAL '6 days' + TIME '08:45:00', CURRENT_DATE - INTERVAL '6 days' + TIME '17:15:00', 8.0, 'present'),
('750e8400-e29b-41d4-a716-446655440004', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '5 days' + TIME '09:00:00', CURRENT_DATE - INTERVAL '5 days' + TIME '17:30:00', 8.0, 'present'),
('750e8400-e29b-41d4-a716-446655440004', CURRENT_DATE - INTERVAL '4 days', CURRENT_DATE - INTERVAL '4 days' + TIME '09:30:00', CURRENT_DATE - INTERVAL '4 days' + TIME '18:00:00', 8.0, 'late'),
('750e8400-e29b-41d4-a716-446655440004', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '3 days' + TIME '08:30:00', CURRENT_DATE - INTERVAL '3 days' + TIME '17:00:00', 8.0, 'present');

-- ================================
-- UPDATE USER EMPLOYEE REFERENCES
-- ================================

UPDATE users SET employee_id = '750e8400-e29b-41d4-a716-446655440001' WHERE email = 'hr@peoplenexus.com';
UPDATE users SET employee_id = '750e8400-e29b-41d4-a716-446655440002' WHERE email = 'manager@peoplenexus.com';
UPDATE users SET employee_id = '750e8400-e29b-41d4-a716-446655440003' WHERE email = 'john.doe@peoplenexus.com';
UPDATE users SET employee_id = '750e8400-e29b-41d4-a716-446655440004' WHERE email = 'jane.smith@peoplenexus.com';
UPDATE users SET employee_id = '750e8400-e29b-41d4-a716-446655440005' WHERE email = 'robert.wilson@peoplenexus.com';
UPDATE users SET employee_id = '750e8400-e29b-41d4-a716-446655440006' WHERE email = 'emily.davis@peoplenexus.com';
UPDATE users SET employee_id = '750e8400-e29b-41d4-a716-446655440007' WHERE email = 'david.brown@peoplenexus.com';

-- ================================
-- VERIFICATION QUERIES
-- ================================

DO $$
DECLARE
    user_count INTEGER;
    employee_count INTEGER;
    department_count INTEGER;
    leave_count INTEGER;
    payroll_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO employee_count FROM employees;
    SELECT COUNT(*) INTO department_count FROM departments;
    SELECT COUNT(*) INTO leave_count FROM leave_requests;
    SELECT COUNT(*) INTO payroll_count FROM payroll;
    
    RAISE NOTICE '📊 Sample Data Inserted Successfully!';
    RAISE NOTICE '👥 Users: %', user_count;
    RAISE NOTICE '🧑‍💼 Employees: %', employee_count;
    RAISE NOTICE '🏢 Departments: %', department_count;
    RAISE NOTICE '🏖️ Leave Requests: %', leave_count;
    RAISE NOTICE '💰 Payroll Records: %', payroll_count;
    RAISE NOTICE '';
    RAISE NOTICE '🔑 Login Credentials (password: password123):';
    RAISE NOTICE '   Admin: admin@peoplenexus.com';
    RAISE NOTICE '   HR: hr@peoplenexus.com';
    RAISE NOTICE '   Manager: manager@peoplenexus.com';
    RAISE NOTICE '   Employee: john.doe@peoplenexus.com';
    RAISE NOTICE '   Employee: jane.smith@peoplenexus.com';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Database ready for PeopleNexus HRMS!';
END $$;
