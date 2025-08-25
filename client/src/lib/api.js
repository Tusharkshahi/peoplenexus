// API Base URL - Update this to match your backend server
const API_BASE_URL = 'http://localhost:5002';

// API Client Helper
class PeopleNexusAPI {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  // Remove authentication token
  removeToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  }

  // PUT request
  async put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Authentication Methods
  async login(email, password) {
    const response = await this.post('/api/auth/login', { email, password });
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async register(userData) {
    const response = await this.post('/api/auth/register', userData);
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  logout() {
    this.removeToken();
  }

  // Employee Methods
  async getEmployees() {
    return this.get('/api/employees');
  }

  async getEmployee(id) {
    return this.get(`/api/employees/${id}`);
  }

  async createEmployee(employeeData) {
    return this.post('/api/employees', employeeData);
  }

  async updateEmployee(id, employeeData) {
    return this.put(`/api/employees/${id}`, employeeData);
  }

  async deleteEmployee(id) {
    return this.delete(`/api/employees/${id}`);
  }

  // Department Methods
  async getDepartments() {
    return this.get('/api/departments');
  }

  async createDepartment(departmentData) {
    return this.post('/api/departments', departmentData);
  }

  // Leave Management Methods
  async getLeaveRequests() {
    return this.get('/api/leave');
  }

  async createLeaveRequest(leaveData) {
    return this.post('/api/leave', leaveData);
  }

  async updateLeaveRequest(id, leaveData) {
    return this.put(`/api/leave/${id}`, leaveData);
  }

  // Payroll Methods
  async getPayrollRuns() {
    return this.get('/api/payroll');
  }

  async getPayslips() {
    return this.get('/api/payroll/payslips');
  }

  // Performance Methods
  async getPerformanceReviews() {
    return this.get('/api/performance');
  }

  async createPerformanceReview(reviewData) {
    return this.post('/api/performance', reviewData);
  }

  // Recruitment Methods
  async getJobPostings() {
    return this.get('/api/recruitment/jobs');
  }

  async createJobPosting(jobData) {
    return this.post('/api/recruitment/jobs', jobData);
  }

  async getJobApplications() {
    return this.get('/api/recruitment/applications');
  }

  // Health Check
  async healthCheck() {
    return this.get('/health');
  }
}

// Create and export API instance
const api = new PeopleNexusAPI();

export default api;

// Also export the class for custom instances
export { PeopleNexusAPI };

// Usage Examples:
/*

// Authentication
try {
  const response = await api.login('admin@peoplenexus.com', 'password123');
  console.log('Login successful:', response.data.user);
} catch (error) {
  console.error('Login failed:', error.message);
}

// Get all employees
try {
  const employees = await api.getEmployees();
  console.log('Employees:', employees.data);
} catch (error) {
  console.error('Failed to fetch employees:', error.message);
}

// Create new employee
try {
  const newEmployee = await api.createEmployee({
    first_name: 'John',
    last_name: 'Doe',
    department_id: '2',
    position_id: '3',
    salary: 85000,
    phone: '+1-555-0123',
    address: '123 Main St, City, State 12345'
  });
  console.log('Employee created:', newEmployee.data);
} catch (error) {
  console.error('Failed to create employee:', error.message);
}

// Get departments
try {
  const departments = await api.getDepartments();
  console.log('Departments:', departments.data);
} catch (error) {
  console.error('Failed to fetch departments:', error.message);
}

// Create leave request
try {
  const leaveRequest = await api.createLeaveRequest({
    employee_id: '1',
    leave_type_id: '1',
    start_date: '2024-08-20',
    end_date: '2024-08-22',
    reason: 'Family vacation'
  });
  console.log('Leave request created:', leaveRequest.data);
} catch (error) {
  console.error('Failed to create leave request:', error.message);
}

*/
