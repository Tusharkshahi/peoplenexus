-- PeopleNexus HRMS Database Schema
-- PostgreSQL Database Setup Script

-- Create database (run this separately as postgres user)
-- CREATE DATABASE peoplenexus_db;

-- Connect to the database
\c peoplenexus_db;

-- Create UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ================================
-- USERS TABLE
-- ================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'employee' CHECK (role IN ('admin', 'hr', 'manager', 'employee')),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login TIMESTAMP,
    employee_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Create trigger
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- DEPARTMENTS TABLE
-- ================================
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    manager_id UUID,
    budget DECIMAL(15,2),
    location VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_departments_name ON departments(name);
CREATE INDEX idx_departments_manager_id ON departments(manager_id);
CREATE INDEX idx_departments_is_active ON departments(is_active);

-- Create trigger
CREATE TRIGGER update_departments_updated_at 
    BEFORE UPDATE ON departments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- EMPLOYEES TABLE
-- ================================
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'USA',
    
    -- Employment details
    department_id UUID,
    position VARCHAR(100) NOT NULL,
    hire_date DATE NOT NULL,
    termination_date DATE,
    employment_type VARCHAR(20) NOT NULL DEFAULT 'full-time' 
        CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'intern')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' 
        CHECK (status IN ('active', 'inactive', 'terminated', 'on-leave')),
    
    -- Compensation
    salary DECIMAL(12,2),
    hourly_rate DECIMAL(8,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Emergency contact
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    
    -- Additional info
    social_security_number VARCHAR(20),
    tax_id VARCHAR(50),
    bank_account_number VARCHAR(50),
    bank_routing_number VARCHAR(20),
    
    -- Metadata
    created_by UUID,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Foreign key constraints will be added later
    CONSTRAINT fk_employees_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_employees_department_id FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    CONSTRAINT fk_employees_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_employees_employee_id ON employees(employee_id);
CREATE INDEX idx_employees_user_id ON employees(user_id);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_department_id ON employees(department_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_hire_date ON employees(hire_date);
CREATE INDEX idx_employees_first_name ON employees(first_name);
CREATE INDEX idx_employees_last_name ON employees(last_name);

-- Create trigger
CREATE TRIGGER update_employees_updated_at 
    BEFORE UPDATE ON employees 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- LEAVE REQUESTS TABLE
-- ================================
CREATE TABLE leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('vacation', 'sick', 'personal', 'maternity', 'paternity', 'bereavement', 'unpaid')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_requested INTEGER NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    comments TEXT,
    approved_by UUID,
    approved_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_leave_requests_employee_id FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    CONSTRAINT fk_leave_requests_approved_by FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT check_leave_dates CHECK (end_date >= start_date)
);

-- Create indexes
CREATE INDEX idx_leave_requests_employee_id ON leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_start_date ON leave_requests(start_date);
CREATE INDEX idx_leave_requests_type ON leave_requests(type);

-- Create trigger
CREATE TRIGGER update_leave_requests_updated_at 
    BEFORE UPDATE ON leave_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- PAYROLL TABLE
-- ================================
CREATE TABLE payroll (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    gross_salary DECIMAL(12,2) NOT NULL,
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    overtime_rate DECIMAL(8,2) DEFAULT 0,
    overtime_pay DECIMAL(10,2) DEFAULT 0,
    bonus DECIMAL(10,2) DEFAULT 0,
    commission DECIMAL(10,2) DEFAULT 0,
    
    -- Deductions
    tax_deductions DECIMAL(10,2) DEFAULT 0,
    health_insurance DECIMAL(8,2) DEFAULT 0,
    retirement_contribution DECIMAL(8,2) DEFAULT 0,
    other_deductions DECIMAL(10,2) DEFAULT 0,
    total_deductions DECIMAL(12,2) DEFAULT 0,
    
    -- Net pay
    net_pay DECIMAL(12,2) NOT NULL,
    
    -- Payment details
    payment_date DATE,
    payment_method VARCHAR(20) DEFAULT 'bank_transfer' 
        CHECK (payment_method IN ('bank_transfer', 'check', 'cash', 'direct_deposit')),
    payment_status VARCHAR(20) DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'processed', 'failed', 'cancelled')),
    
    -- Metadata
    processed_by UUID,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_payroll_employee_id FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    CONSTRAINT fk_payroll_processed_by FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT check_payroll_dates CHECK (pay_period_end >= pay_period_start)
);

-- Create indexes
CREATE INDEX idx_payroll_employee_id ON payroll(employee_id);
CREATE INDEX idx_payroll_pay_period_start ON payroll(pay_period_start);
CREATE INDEX idx_payroll_payment_status ON payroll(payment_status);

-- Create trigger
CREATE TRIGGER update_payroll_updated_at 
    BEFORE UPDATE ON payroll 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- PERFORMANCE REVIEWS TABLE
-- ================================
CREATE TABLE performance_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL,
    reviewer_id UUID NOT NULL,
    review_period_start DATE NOT NULL,
    review_period_end DATE NOT NULL,
    review_type VARCHAR(20) NOT NULL DEFAULT 'annual' 
        CHECK (review_type IN ('annual', 'quarterly', 'monthly', 'probationary')),
    
    -- Review content
    goals TEXT,
    achievements TEXT,
    areas_for_improvement TEXT,
    manager_feedback TEXT,
    employee_self_assessment TEXT,
    
    -- Ratings (1-5 scale)
    overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
    technical_skills_rating INTEGER CHECK (technical_skills_rating BETWEEN 1 AND 5),
    communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
    teamwork_rating INTEGER CHECK (teamwork_rating BETWEEN 1 AND 5),
    leadership_rating INTEGER CHECK (leadership_rating BETWEEN 1 AND 5),
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'draft' 
        CHECK (status IN ('draft', 'pending_employee', 'pending_manager', 'completed', 'approved')),
    
    -- Metadata
    submitted_at TIMESTAMP,
    approved_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_performance_reviews_employee_id FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    CONSTRAINT fk_performance_reviews_reviewer_id FOREIGN KEY (reviewer_id) REFERENCES employees(id) ON DELETE CASCADE,
    CONSTRAINT check_review_dates CHECK (review_period_end >= review_period_start)
);

-- Create indexes
CREATE INDEX idx_performance_reviews_employee_id ON performance_reviews(employee_id);
CREATE INDEX idx_performance_reviews_reviewer_id ON performance_reviews(reviewer_id);
CREATE INDEX idx_performance_reviews_status ON performance_reviews(status);
CREATE INDEX idx_performance_reviews_review_period_start ON performance_reviews(review_period_start);

-- Create trigger
CREATE TRIGGER update_performance_reviews_updated_at 
    BEFORE UPDATE ON performance_reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- POSITIONS TABLE
-- ================================
CREATE TABLE positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    department_id UUID,
    description TEXT,
    requirements TEXT,
    min_salary DECIMAL(12,2),
    max_salary DECIMAL(12,2),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_positions_department_id FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_positions_title ON positions(title);
CREATE INDEX idx_positions_department_id ON positions(department_id);
CREATE INDEX idx_positions_is_active ON positions(is_active);

-- Create trigger
CREATE TRIGGER update_positions_updated_at 
    BEFORE UPDATE ON positions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- ATTENDANCE TABLE
-- ================================
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL,
    date DATE NOT NULL,
    check_in_time TIMESTAMP,
    check_out_time TIMESTAMP,
    break_duration INTEGER DEFAULT 0, -- in minutes
    total_hours DECIMAL(4,2),
    status VARCHAR(20) NOT NULL DEFAULT 'present' 
        CHECK (status IN ('present', 'absent', 'late', 'half_day', 'on_leave')),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_attendance_employee_id FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    CONSTRAINT unique_employee_date UNIQUE (employee_id, date)
);

-- Create indexes
CREATE INDEX idx_attendance_employee_id ON attendance(employee_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_status ON attendance(status);

-- Create trigger
CREATE TRIGGER update_attendance_updated_at 
    BEFORE UPDATE ON attendance 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- ADD FOREIGN KEY CONSTRAINTS
-- ================================

-- Add department manager constraint
ALTER TABLE departments 
ADD CONSTRAINT fk_departments_manager_id 
FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL;

-- Add user employee_id constraint
ALTER TABLE users 
ADD CONSTRAINT fk_users_employee_id 
FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL;

-- ================================
-- CREATE VIEWS FOR COMMON QUERIES
-- ================================

-- Employee with department and user info
CREATE VIEW employee_details AS
SELECT 
    e.*,
    d.name as department_name,
    d.location as department_location,
    u.email as user_email,
    u.role as user_role,
    u.is_active as user_is_active
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
LEFT JOIN users u ON e.user_id = u.id;

-- Leave request summary
CREATE VIEW leave_summary AS
SELECT 
    lr.*,
    e.first_name || ' ' || e.last_name as employee_name,
    e.employee_id,
    d.name as department_name
FROM leave_requests lr
JOIN employees e ON lr.employee_id = e.id
LEFT JOIN departments d ON e.department_id = d.id;

-- Payroll summary
CREATE VIEW payroll_summary AS
SELECT 
    p.*,
    e.first_name || ' ' || e.last_name as employee_name,
    e.employee_id,
    d.name as department_name
FROM payroll p
JOIN employees e ON p.employee_id = e.id
LEFT JOIN departments d ON e.department_id = d.id;

-- ================================
-- SAMPLE DATA INSERTION
-- ================================

-- Insert default admin user
INSERT INTO users (email, password_hash, role, first_name, last_name) VALUES
('admin@peoplenexus.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBNWkDq0zPUPBq', 'admin', 'System', 'Administrator');

-- Insert sample departments
INSERT INTO departments (name, description) VALUES
('Human Resources', 'Responsible for employee relations, recruitment, and policy management'),
('Information Technology', 'Manages technology infrastructure and software development'),
('Finance', 'Handles financial planning, accounting, and budget management'),
('Marketing', 'Responsible for marketing strategies and brand management'),
('Operations', 'Manages day-to-day business operations and processes');

-- Insert sample positions
INSERT INTO positions (title, department_id, description, min_salary, max_salary) VALUES
('HR Manager', (SELECT id FROM departments WHERE name = 'Human Resources'), 'Lead HR operations and strategy', 70000, 90000),
('Software Engineer', (SELECT id FROM departments WHERE name = 'Information Technology'), 'Develop and maintain software applications', 80000, 120000),
('Financial Analyst', (SELECT id FROM departments WHERE name = 'Finance'), 'Analyze financial data and create reports', 60000, 80000),
('Marketing Specialist', (SELECT id FROM departments WHERE name = 'Marketing'), 'Execute marketing campaigns and strategies', 50000, 70000);

-- ================================
-- INDEXES FOR PERFORMANCE
-- ================================

-- Additional composite indexes for better query performance
CREATE INDEX idx_employees_dept_status ON employees(department_id, status);
CREATE INDEX idx_employees_name_search ON employees(first_name, last_name);
CREATE INDEX idx_leave_requests_emp_status ON leave_requests(employee_id, status);
CREATE INDEX idx_payroll_emp_period ON payroll(employee_id, pay_period_start);
CREATE INDEX idx_attendance_emp_date ON attendance(employee_id, date);

-- ================================
-- FUNCTIONS AND PROCEDURES
-- ================================

-- Function to calculate leave days
CREATE OR REPLACE FUNCTION calculate_leave_days(start_date DATE, end_date DATE)
RETURNS INTEGER AS $$
BEGIN
    -- Simple calculation excluding weekends
    RETURN (
        SELECT COUNT(*)
        FROM generate_series(start_date, end_date, '1 day'::interval) AS day
        WHERE EXTRACT(dow FROM day) NOT IN (0, 6) -- Exclude Sunday (0) and Saturday (6)
    );
END;
$$ LANGUAGE plpgsql;

-- Function to get employee leave balance
CREATE OR REPLACE FUNCTION get_leave_balance(emp_id UUID, leave_type VARCHAR)
RETURNS INTEGER AS $$
DECLARE
    total_taken INTEGER := 0;
    annual_allowance INTEGER := 25; -- Default annual leave allowance
BEGIN
    -- Calculate total days taken this year
    SELECT COALESCE(SUM(days_requested), 0) INTO total_taken
    FROM leave_requests
    WHERE employee_id = emp_id 
      AND type = leave_type 
      AND status = 'approved'
      AND EXTRACT(YEAR FROM start_date) = EXTRACT(YEAR FROM CURRENT_DATE);
    
    RETURN annual_allowance - total_taken;
END;
$$ LANGUAGE plpgsql;

-- ================================
-- COMPLETED SETUP MESSAGE
-- ================================

DO $$
BEGIN
    RAISE NOTICE '✅ PeopleNexus HRMS Database Schema Created Successfully!';
    RAISE NOTICE '📊 Database: peoplenexus_db';
    RAISE NOTICE '🔧 Tables: users, employees, departments, positions, leave_requests, payroll, performance_reviews, attendance';
    RAISE NOTICE '📋 Views: employee_details, leave_summary, payroll_summary';
    RAISE NOTICE '⚡ Functions: calculate_leave_days, get_leave_balance';
    RAISE NOTICE '🎯 Ready for PeopleNexus HRMS application!';
END $$;
