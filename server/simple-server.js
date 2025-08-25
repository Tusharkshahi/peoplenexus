// Simple PeopleNexus HRMS Server without external dependencies
// This version uses only Node.js built-in modules for testing

const http = require('http');
const url = require('url');
const crypto = require('crypto');

const PORT = process.env.PORT || 5001;

// Simple CORS middleware
function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

// Simple JSON parser
function parseJSON(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

// Simple response helper
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
}

// Mock database for testing (without PostgreSQL dependency)
const mockDatabase = {
  users: [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'admin@peoplenexus.com',
      password_hash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBNWkDq0zPUPBq',
      role: 'admin',
      first_name: 'System',
      last_name: 'Administrator',
      is_active: true
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'hr@peoplenexus.com',
      password_hash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBNWkDq0zPUPBq',
      role: 'hr',
      first_name: 'Sarah',
      last_name: 'Johnson',
      is_active: true
    }
  ],
  employees: [
    {
      id: '750e8400-e29b-41d4-a716-446655440001',
      employee_id: 'EMP001',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@peoplenexus.com',
      position: 'Software Engineer',
      department_id: '650e8400-e29b-41d4-a716-446655440002',
      salary: 75000,
      status: 'active'
    },
    {
      id: '750e8400-e29b-41d4-a716-446655440002',
      employee_id: 'EMP002',
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@peoplenexus.com',
      position: 'HR Manager',
      department_id: '650e8400-e29b-41d4-a716-446655440001',
      salary: 85000,
      status: 'active'
    }
  ],
  departments: [
    {
      id: '650e8400-e29b-41d4-a716-446655440001',
      name: 'Human Resources',
      description: 'HR department managing employee relations'
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440002',
      name: 'Information Technology',
      description: 'IT department managing technology infrastructure'
    }
  ]
};

// Simple JWT simulation (not secure, for testing only)
function generateSimpleToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function verifySimpleToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    if (payload.exp < Date.now()) {
      throw new Error('Token expired');
    }
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Generate simple UUID
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Request router
function handleRequest(req, res) {
  setCORSHeaders(res);

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  console.log(`📡 ${method} ${path}`);

  // Health check
  if (path === '/health' && method === 'GET') {
    sendJSON(res, 200, {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: 'development',
      version: '1.0.0',
      database: 'Mock Database (Testing Mode)'
    });
    return;
  }

  // Root endpoint
  if (path === '/' && method === 'GET') {
    sendJSON(res, 200, {
      message: 'PeopleNexus HRMS API Server',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      mode: 'Testing Mode - Mock Database',
      endpoints: {
        health: '/health',
        auth: '/api/auth/*',
        employees: '/api/employees/*',
        departments: '/api/departments/*'
      }
    });
    return;
  }

  // Login endpoint
  if (path === '/api/auth/login' && method === 'POST') {
    parseJSON(req).then(body => {
      const { email, password } = body;

      if (!email || !password) {
        sendJSON(res, 400, {
          success: false,
          message: 'Email and password are required'
        });
        return;
      }

      const user = mockDatabase.users.find(u => u.email === email);
      if (!user) {
        sendJSON(res, 401, {
          success: false,
          message: 'Invalid email or password'
        });
        return;
      }

      // Simple password check (in real implementation, use bcrypt)
      if (password !== 'password123') {
        sendJSON(res, 401, {
          success: false,
          message: 'Invalid email or password'
        });
        return;
      }

      const token = generateSimpleToken(user);

      sendJSON(res, 200, {
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
    }).catch(error => {
      sendJSON(res, 400, {
        success: false,
        message: 'Invalid JSON data'
      });
    });
    return;
  }

  // Register endpoint
  if (path === '/api/auth/register' && method === 'POST') {
    parseJSON(req).then(body => {
      const { email, password, first_name, last_name, role = 'employee' } = body;

      if (!email || !password) {
        sendJSON(res, 400, {
          success: false,
          message: 'Email and password are required'
        });
        return;
      }

      // Check if user already exists
      const existingUser = mockDatabase.users.find(u => u.email === email);
      if (existingUser) {
        sendJSON(res, 409, {
          success: false,
          message: 'User with this email already exists'
        });
        return;
      }

      // Create new user
      const newUser = {
        id: generateId(),
        email,
        password_hash: 'hashed_' + password, // In real implementation, use proper hashing
        role,
        first_name: first_name || '',
        last_name: last_name || '',
        is_active: true,
        created_at: new Date().toISOString()
      };

      mockDatabase.users.push(newUser);

      const token = generateSimpleToken(newUser);

      sendJSON(res, 201, {
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
    }).catch(error => {
      sendJSON(res, 400, {
        success: false,
        message: 'Invalid JSON data'
      });
    });
    return;
  }

  // Get employees endpoint
  if (path === '/api/employees' && method === 'GET') {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendJSON(res, 401, {
        success: false,
        message: 'Access token required'
      });
      return;
    }

    try {
      const token = authHeader.split(' ')[1];
      const payload = verifySimpleToken(token);
      
      sendJSON(res, 200, {
        success: true,
        data: mockDatabase.employees,
        pagination: {
          page: 1,
          limit: 10,
          total: mockDatabase.employees.length,
          totalPages: 1
        }
      });
    } catch (error) {
      sendJSON(res, 401, {
        success: false,
        message: error.message
      });
    }
    return;
  }

  // Get departments endpoint
  if (path === '/api/departments' && method === 'GET') {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendJSON(res, 401, {
        success: false,
        message: 'Access token required'
      });
      return;
    }

    try {
      const token = authHeader.split(' ')[1];
      const payload = verifySimpleToken(token);
      
      sendJSON(res, 200, {
        success: true,
        data: mockDatabase.departments
      });
    } catch (error) {
      sendJSON(res, 401, {
        success: false,
        message: error.message
      });
    }
    return;
  }

  // Dashboard stats endpoint
  if (path === '/api/dashboard/stats' && method === 'GET') {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendJSON(res, 401, {
        success: false,
        message: 'Access token required'
      });
      return;
    }

    try {
      const token = authHeader.split(' ')[1];
      const payload = verifySimpleToken(token);
      
      sendJSON(res, 200, {
        success: true,
        data: {
          totalEmployees: mockDatabase.employees.length,
          activeEmployees: mockDatabase.employees.filter(e => e.status === 'active').length,
          totalDepartments: mockDatabase.departments.length,
          pendingLeaveRequests: 2,
          recentHires: mockDatabase.employees.slice(0, 3)
        }
      });
    } catch (error) {
      sendJSON(res, 401, {
        success: false,
        message: error.message
      });
    }
    return;
  }

  // 404 for unknown routes
  sendJSON(res, 404, {
    success: false,
    message: `Route ${path} not found`
  });
}

// Create and start server
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log('🚀 PeopleNexus HRMS Server (Testing Mode) running on port', PORT);
  console.log('📊 Database: Mock Database (No PostgreSQL required)');
  console.log('🌍 Environment: Testing');
  console.log('🔒 CORS Origin: http://localhost:3000');
  console.log('💾 Health Check: http://localhost:' + PORT + '/health');
  console.log('📋 Available endpoints:');
  console.log('   🔐 Auth: POST /api/auth/login');
  console.log('   👥 Employees: GET /api/employees');
  console.log('   🏢 Departments: GET /api/departments');
  console.log('   📊 Dashboard: GET /api/dashboard/stats');
  console.log('');
  console.log('🔑 Test Login Credentials:');
  console.log('   Email: admin@peoplenexus.com');
  console.log('   Password: password123');
  console.log('');
  console.log('⚠️  Note: This is a testing server with mock data');
  console.log('💡 For full PostgreSQL integration, use the main server.js');
});

server.on('error', (error) => {
  console.error('❌ Server error:', error.message);
  if (error.code === 'EADDRINUSE') {
    console.log('💡 Port', PORT, 'is already in use. Try a different port.');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 Received SIGTERM, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('👋 Received SIGINT, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});
