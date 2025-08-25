# PeopleNexus HRMS Backend Server

A comprehensive Human Resource Management System backend built with Node.js, Express.js, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Employee Management**: Complete CRUD operations for employee records
- **Department Management**: Department structure and hierarchy
- **Leave Management**: Leave request system with approval workflow
- **Payroll System**: Payroll processing and records management
- **Performance Reviews**: Employee performance evaluation system
- **Attendance Tracking**: Time tracking and attendance records
- **Dashboard Analytics**: Real-time statistics and insights
- **API Documentation**: RESTful API with comprehensive endpoints

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcrypt
- **Environment**: dotenv

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PeopleNexus/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Copy the `.env.example` to `.env` and configure your environment variables:
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your database credentials:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=peoplenexus_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   
   # Server Configuration
   PORT=5001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

## 🗄️ Database Setup

1. **Create PostgreSQL Database**
   ```sql
   CREATE DATABASE peoplenexus_db;
   ```

2. **Run Database Schema**
   ```bash
   psql -U postgres -d peoplenexus_db -f database-setup.sql
   ```

3. **Insert Sample Data (Optional)**
   ```bash
   psql -U postgres -d peoplenexus_db -f sample-data.sql
   ```

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5001` (or your configured PORT).

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile

### Employees
- `GET /api/employees` - Get all employees (with pagination)
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create new department
- `PUT /api/departments/:id` - Update department

### Leave Management
- `GET /api/leave` - Get leave requests
- `POST /api/leave` - Create leave request
- `PUT /api/leave/:id/status` - Update leave request status

### Payroll
- `GET /api/payroll` - Get payroll records (HR/Admin only)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### System
- `GET /health` - Health check endpoint
- `GET /` - API information

## 🔐 Authentication & Authorization

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **admin**: Full system access
- **hr**: HR operations and employee management
- **manager**: Team management and approval workflows
- **employee**: Limited access to personal records

## 📊 Database Schema

### Core Tables
- **users**: User accounts and authentication
- **employees**: Employee personal and professional information
- **departments**: Organizational departments
- **positions**: Job positions and descriptions
- **leave_requests**: Leave management system
- **payroll**: Payroll processing records
- **performance_reviews**: Performance evaluation system
- **attendance**: Time tracking and attendance

### Sample Credentials

If you've installed sample data, you can use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@peoplenexus.com | password123 |
| HR | hr@peoplenexus.com | password123 |
| Manager | manager@peoplenexus.com | password123 |
| Employee | john.doe@peoplenexus.com | password123 |
| Employee | jane.smith@peoplenexus.com | password123 |

## 🔍 API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": { ... } // for paginated responses
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // validation errors if applicable
}
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-Origin Resource Sharing configuration
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive request validation
- **Password Hashing**: bcrypt for secure password storage
- **JWT Tokens**: Secure authentication tokens
- **SQL Injection Protection**: Parameterized queries

## 📈 Performance Features

- **Connection Pooling**: PostgreSQL connection pooling
- **Database Indexes**: Optimized database queries
- **Pagination**: Efficient data retrieval for large datasets
- **Caching**: Response caching where appropriate

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📝 Logging

The server uses Morgan for HTTP request logging in development mode and structured logging in production.

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database `peoplenexus_db` exists

2. **Port Already in Use**
   - Change the PORT in `.env` file
   - Kill the process using the port: `lsof -ti:5001 | xargs kill -9`

3. **JWT Token Invalid**
   - Ensure JWT_SECRET is set in `.env`
   - Check token expiration

4. **CORS Issues**
   - Verify CORS_ORIGIN matches your frontend URL
   - Check that credentials are included in requests

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**PeopleNexus HRMS** - Streamlining Human Resource Management
