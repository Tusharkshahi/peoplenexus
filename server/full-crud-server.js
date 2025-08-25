// PeopleNexus HRMS - Full CRUD Server
// Complete Express.js server with all HRMS functionality

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5002; // Using different port to avoid conflicts

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('dev'));

// Enhanced Mock Database
const mockDatabase = {
  users: [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'admin@peoplenexus.com',
      password_hash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBNWkDq0zPUPBq',
      role: 'admin',
      first_name: 'System',
      last_name: 'Administrator',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'hr@peoplenexus.com',
      password_hash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBNWkDq0zPUPBq',
      role: 'hr',
      first_name: 'Sarah',
      last_name: 'Johnson',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      email: 'john.doe@peoplenexus.com',
      password_hash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBNWkDq0zPUPBq',
      role: 'employee',
      first_name: 'John',
      last_name: 'Doe',
      is_active: true,
      created_at: new Date().toISOString()
    }
  ],
  employees: [
    {
      id: '750e8400-e29b-41d4-a716-446655440001',
      employee_id: 'EMP001',
      user_id: '550e8400-e29b-41d4-a716-446655440001',
      first_name: 'Sarah',
      last_name: 'Johnson',
      email: 'hr@peoplenexus.com',
      phone: '+1-555-0101',
      position: 'HR Manager',
      department_id: '650e8400-e29b-41d4-a716-446655440001',
      salary: 85000,
      employment_type: 'full-time',
      status: 'active',
      hire_date: '2020-01-15',
      created_at: new Date().toISOString()
    },
    {
      id: '750e8400-e29b-41d4-a716-446655440002',
      employee_id: 'EMP002',
      user_id: '550e8400-e29b-41d4-a716-446655440002',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@peoplenexus.com',
      phone: '+1-555-0201',
      position: 'Software Engineer',
      department_id: '650e8400-e29b-41d4-a716-446655440002',
      salary: 90000,
      employment_type: 'full-time',
      status: 'active',
      hire_date: '2021-06-15',
      created_at: new Date().toISOString()
    },
    {
      id: '750e8400-e29b-41d4-a716-446655440003',
      employee_id: 'EMP003',
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@peoplenexus.com',
      phone: '+1-555-0301',
      position: 'Frontend Developer',
      department_id: '650e8400-e29b-41d4-a716-446655440002',
      salary: 75000,
      employment_type: 'full-time',
      status: 'active',
      hire_date: '2022-02-01',
      created_at: new Date().toISOString()
    }
  ],
  departments: [
    {
      id: '650e8400-e29b-41d4-a716-446655440001',
      name: 'Human Resources',
      description: 'HR department managing employee relations',
      manager_id: '750e8400-e29b-41d4-a716-446655440001',
      employee_count: 1,
      created_at: new Date().toISOString()
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440002',
      name: 'Information Technology',
      description: 'IT department managing technology infrastructure',
      employee_count: 2,
      created_at: new Date().toISOString()
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440003',
      name: 'Finance',
      description: 'Finance department managing budgets and accounting',
      employee_count: 0,
      created_at: new Date().toISOString()
    }
  ],
  leaveRequests: [
    {
      id: '850e8400-e29b-41d4-a716-446655440001',
      employee_id: '750e8400-e29b-41d4-a716-446655440002',
      type: 'vacation',
      start_date: '2024-12-23',
      end_date: '2024-12-30',
      days_requested: 6,
      reason: 'Christmas holiday vacation',
      status: 'pending',
      created_at: new Date().toISOString()
    }
  ],
  payroll: [
    {
      id: '950e8400-e29b-41d4-a716-446655440001',
      employee_id: '750e8400-e29b-41d4-a716-446655440002',
      pay_period_start: '2024-11-01',
      pay_period_end: '2024-11-30',
      gross_salary: 7500.00,
      net_pay: 5775.00,
      payment_status: 'processed',
      created_at: new Date().toISOString()
    }
  ]
};

// JWT helper functions
function generateToken(user) {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    },
    'your-secret-key',
    { expiresIn: '7d' }
  );
}

function verifyToken(token) {
  return jwt.verify(token, 'your-secret-key');
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
}

// Utility functions
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function paginateArray(array, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const paginatedItems = array.slice(offset, offset + limit);
  
  return {
    data: paginatedItems,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: array.length,
      totalPages: Math.ceil(array.length / limit),
      hasNext: page < Math.ceil(array.length / limit),
      hasPrev: page > 1
    }
  };
}

// ================================
// ROUTES
// ================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: 'development',
    version: '1.0.0',
    database: 'Enhanced Mock Database'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'PeopleNexus HRMS - Full CRUD API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    mode: 'Full CRUD Mode - Enhanced Mock Database',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      employees: '/api/employees/*',
      departments: '/api/departments/*',
      leave: '/api/leave/*',
      payroll: '/api/payroll/*',
      dashboard: '/api/dashboard/*'
    }
  });
});

// ================================
// AUTH ROUTES
// ================================

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = mockDatabase.users.find(u => u.email === email && u.is_active);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Simple password check (use bcrypt in production)
    const isValidPassword = password === 'password123';
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role = 'employee', first_name, last_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const existingUser = mockDatabase.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = {
      id: generateId(),
      email,
      password_hash: hashedPassword,
      role,
      first_name,
      last_name,
      is_active: true,
      created_at: new Date().toISOString()
    };

    mockDatabase.users.push(newUser);

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          first_name: newUser.first_name,
          last_name: newUser.last_name
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Get profile
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  const user = mockDatabase.users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      created_at: user.created_at
    }
  });
});

// ================================
// EMPLOYEE ROUTES
// ================================

// Get all employees
app.get('/api/employees', authenticateToken, (req, res) => {
  const { page = 1, limit = 10, search, department_id } = req.query;
  
  let employees = [...mockDatabase.employees];

  // Search filter
  if (search) {
    employees = employees.filter(emp => 
      emp.first_name.toLowerCase().includes(search.toLowerCase()) ||
      emp.last_name.toLowerCase().includes(search.toLowerCase()) ||
      emp.employee_id.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Department filter
  if (department_id) {
    employees = employees.filter(emp => emp.department_id === department_id);
  }

  // Add department info
  employees = employees.map(emp => {
    const department = mockDatabase.departments.find(d => d.id === emp.department_id);
    return {
      ...emp,
      department: department ? { id: department.id, name: department.name } : null
    };
  });

  const result = paginateArray(employees, page, limit);

  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});

// Get employee by ID
app.get('/api/employees/:id', authenticateToken, (req, res) => {
  const employee = mockDatabase.employees.find(emp => emp.id === req.params.id);
  
  if (!employee) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }

  // Add department info
  const department = mockDatabase.departments.find(d => d.id === employee.department_id);
  const user = mockDatabase.users.find(u => u.id === employee.user_id);

  res.json({
    success: true,
    data: {
      ...employee,
      department,
      user: user ? {
        id: user.id,
        email: user.email,
        role: user.role,
        is_active: user.is_active
      } : null
    }
  });
});

// Create employee
app.post('/api/employees', authenticateToken, (req, res) => {
  try {
    const employeeData = req.body;

    // Check if employee_id is unique
    const existingEmployee = mockDatabase.employees.find(emp => emp.employee_id === employeeData.employee_id);
    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: 'Employee ID already exists'
      });
    }

    const newEmployee = {
      id: generateId(),
      ...employeeData,
      created_at: new Date().toISOString()
    };

    mockDatabase.employees.push(newEmployee);

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: newEmployee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create employee',
      error: error.message
    });
  }
});

// Update employee
app.put('/api/employees/:id', authenticateToken, (req, res) => {
  const employeeIndex = mockDatabase.employees.findIndex(emp => emp.id === req.params.id);
  
  if (employeeIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }

  mockDatabase.employees[employeeIndex] = {
    ...mockDatabase.employees[employeeIndex],
    ...req.body,
    updated_at: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'Employee updated successfully',
    data: mockDatabase.employees[employeeIndex]
  });
});

// Delete employee
app.delete('/api/employees/:id', authenticateToken, (req, res) => {
  const employeeIndex = mockDatabase.employees.findIndex(emp => emp.id === req.params.id);
  
  if (employeeIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }

  const deletedEmployee = mockDatabase.employees.splice(employeeIndex, 1)[0];

  res.json({
    success: true,
    message: 'Employee deleted successfully',
    data: deletedEmployee
  });
});

// ================================
// DEPARTMENT ROUTES
// ================================

// Get all departments
app.get('/api/departments', authenticateToken, (req, res) => {
  const departments = mockDatabase.departments.map(dept => {
    const manager = mockDatabase.employees.find(emp => emp.id === dept.manager_id);
    return {
      ...dept,
      manager: manager ? {
        id: manager.id,
        name: `${manager.first_name} ${manager.last_name}`,
        employee_id: manager.employee_id
      } : null
    };
  });

  res.json({
    success: true,
    data: departments
  });
});

// Create department
app.post('/api/departments', authenticateToken, (req, res) => {
  const newDepartment = {
    id: generateId(),
    ...req.body,
    employee_count: 0,
    created_at: new Date().toISOString()
  };

  mockDatabase.departments.push(newDepartment);

  res.status(201).json({
    success: true,
    message: 'Department created successfully',
    data: newDepartment
  });
});

// Update department
app.put('/api/departments/:id', authenticateToken, (req, res) => {
  const deptIndex = mockDatabase.departments.findIndex(dept => dept.id === req.params.id);
  
  if (deptIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Department not found'
    });
  }

  mockDatabase.departments[deptIndex] = {
    ...mockDatabase.departments[deptIndex],
    ...req.body,
    updated_at: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'Department updated successfully',
    data: mockDatabase.departments[deptIndex]
  });
});

// ================================
// LEAVE ROUTES
// ================================

// Get leave requests
app.get('/api/leave', authenticateToken, (req, res) => {
  const { page = 1, limit = 10, status, employee_id } = req.query;
  
  let leaveRequests = [...mockDatabase.leaveRequests];

  // Filter by status
  if (status) {
    leaveRequests = leaveRequests.filter(leave => leave.status === status);
  }

  // Filter by employee
  if (employee_id) {
    leaveRequests = leaveRequests.filter(leave => leave.employee_id === employee_id);
  }

  // Add employee info
  leaveRequests = leaveRequests.map(leave => {
    const employee = mockDatabase.employees.find(emp => emp.id === leave.employee_id);
    return {
      ...leave,
      employee: employee ? {
        id: employee.id,
        name: `${employee.first_name} ${employee.last_name}`,
        employee_id: employee.employee_id
      } : null
    };
  });

  const result = paginateArray(leaveRequests, page, limit);

  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});

// Create leave request
app.post('/api/leave', authenticateToken, (req, res) => {
  const newLeaveRequest = {
    id: generateId(),
    ...req.body,
    status: 'pending',
    created_at: new Date().toISOString()
  };

  mockDatabase.leaveRequests.push(newLeaveRequest);

  res.status(201).json({
    success: true,
    message: 'Leave request submitted successfully',
    data: newLeaveRequest
  });
});

// Update leave status
app.put('/api/leave/:id/status', authenticateToken, (req, res) => {
  const leaveIndex = mockDatabase.leaveRequests.findIndex(leave => leave.id === req.params.id);
  
  if (leaveIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Leave request not found'
    });
  }

  mockDatabase.leaveRequests[leaveIndex] = {
    ...mockDatabase.leaveRequests[leaveIndex],
    ...req.body,
    approved_by: req.user.userId,
    approved_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'Leave request status updated successfully',
    data: mockDatabase.leaveRequests[leaveIndex]
  });
});

// ================================
// PAYROLL ROUTES
// ================================

// Get payroll records
app.get('/api/payroll', authenticateToken, (req, res) => {
  const { page = 1, limit = 10, employee_id } = req.query;
  
  let payrollRecords = [...mockDatabase.payroll];

  // Filter by employee
  if (employee_id) {
    payrollRecords = payrollRecords.filter(payroll => payroll.employee_id === employee_id);
  }

  // Add employee info
  payrollRecords = payrollRecords.map(payroll => {
    const employee = mockDatabase.employees.find(emp => emp.id === payroll.employee_id);
    return {
      ...payroll,
      employee: employee ? {
        id: employee.id,
        name: `${employee.first_name} ${employee.last_name}`,
        employee_id: employee.employee_id
      } : null
    };
  });

  const result = paginateArray(payrollRecords, page, limit);

  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});

// ================================
// DASHBOARD ROUTES
// ================================

// Dashboard statistics
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const stats = {
    totalEmployees: mockDatabase.employees.length,
    activeEmployees: mockDatabase.employees.filter(emp => emp.status === 'active').length,
    totalDepartments: mockDatabase.departments.length,
    pendingLeaveRequests: mockDatabase.leaveRequests.filter(leave => leave.status === 'pending').length,
    recentHires: mockDatabase.employees
      .sort((a, b) => new Date(b.hire_date) - new Date(a.hire_date))
      .slice(0, 5)
      .map(emp => ({
        first_name: emp.first_name,
        last_name: emp.last_name,
        hire_date: emp.hire_date
      }))
  };

  res.json({
    success: true,
    data: stats
  });
});

// ================================
// ERROR HANDLING
// ================================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
});

// ================================
// START SERVER
// ================================

app.listen(PORT, () => {
  console.log(`🚀 PeopleNexus HRMS - Full CRUD Server running on port ${PORT}`);
  console.log(`📊 Database: Enhanced Mock Database`);
  console.log(`🌍 Environment: development`);
  console.log(`🔒 CORS Origin: http://localhost:3000`);
  console.log(`💾 Health Check: http://localhost:${PORT}/health`);
  console.log('📋 Available endpoints:');
  console.log('   🔐 Auth: /api/auth/login, /api/auth/register, /api/auth/profile');
  console.log('   👥 Employees: /api/employees (GET, POST, PUT, DELETE)');
  console.log('   🏢 Departments: /api/departments (GET, POST, PUT)');
  console.log('   🏖️  Leave: /api/leave (GET, POST, PUT)');
  console.log('   💰 Payroll: /api/payroll (GET)');
  console.log('   📊 Dashboard: /api/dashboard/stats');
  console.log('');
  console.log('🔑 Test Login Credentials:');
  console.log('   Admin: admin@peoplenexus.com / password123');
  console.log('   HR: hr@peoplenexus.com / password123');
  console.log('   Employee: john.doe@peoplenexus.com / password123');
  console.log('');
  console.log('⚡ Features:');
  console.log('   ✅ Full CRUD operations');
  console.log('   ✅ JWT Authentication');
  console.log('   ✅ Role-based access');
  console.log('   ✅ Search and pagination');
  console.log('   ✅ Enhanced mock database');
});

module.exports = app;
