const { body, param, query, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// Common validation rules
const commonValidations = {
  email: body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  password: body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
  id: param('id')
    .isUUID()
    .withMessage('Invalid ID format'),
    
  phone: body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
    
  date: (field) => body(field)
    .isISO8601()
    .withMessage(`${field} must be a valid date`),
    
  positiveNumber: (field) => body(field)
    .isFloat({ min: 0 })
    .withMessage(`${field} must be a positive number`),
    
  required: (field) => body(field)
    .notEmpty()
    .withMessage(`${field} is required`)
    .trim()
};

// User validation rules
const userValidations = {
  register: [
    commonValidations.email,
    commonValidations.password,
    body('role')
      .isIn(['admin', 'hr', 'manager', 'employee'])
      .withMessage('Invalid role'),
    handleValidationErrors
  ],
  
  login: [
    commonValidations.email,
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    handleValidationErrors
  ],
  
  updateProfile: [
    commonValidations.email.optional(),
    body('first_name')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters'),
    body('last_name')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters'),
    commonValidations.phone,
    handleValidationErrors
  ]
};

// Employee validation rules
const employeeValidations = {
  create: [
    commonValidations.required('first_name'),
    commonValidations.required('last_name'),
    commonValidations.email,
    body('employee_id')
      .isLength({ min: 3, max: 20 })
      .withMessage('Employee ID must be between 3 and 20 characters'),
    body('department_id')
      .isUUID()
      .withMessage('Invalid department ID'),
    body('position')
      .isLength({ min: 2, max: 100 })
      .withMessage('Position must be between 2 and 100 characters'),
    body('hire_date')
      .isISO8601()
      .withMessage('Hire date must be a valid date'),
    body('salary')
      .isFloat({ min: 0 })
      .withMessage('Salary must be a positive number'),
    body('employment_type')
      .isIn(['full-time', 'part-time', 'contract', 'intern'])
      .withMessage('Invalid employment type'),
    commonValidations.phone,
    handleValidationErrors
  ],
  
  update: [
    body('first_name')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters'),
    body('last_name')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters'),
    body('department_id')
      .optional()
      .isUUID()
      .withMessage('Invalid department ID'),
    body('position')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Position must be between 2 and 100 characters'),
    body('salary')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Salary must be a positive number'),
    body('employment_type')
      .optional()
      .isIn(['full-time', 'part-time', 'contract', 'intern'])
      .withMessage('Invalid employment type'),
    commonValidations.phone,
    handleValidationErrors
  ]
};

// Department validation rules
const departmentValidations = {
  create: [
    commonValidations.required('name'),
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    body('manager_id')
      .optional()
      .isUUID()
      .withMessage('Invalid manager ID'),
    handleValidationErrors
  ],
  
  update: [
    body('name')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    body('manager_id')
      .optional()
      .isUUID()
      .withMessage('Invalid manager ID'),
    handleValidationErrors
  ]
};

// Leave request validation rules
const leaveValidations = {
  create: [
    body('type')
      .isIn(['vacation', 'sick', 'personal', 'maternity', 'paternity'])
      .withMessage('Invalid leave type'),
    body('start_date')
      .isISO8601()
      .withMessage('Start date must be a valid date')
      .custom((value) => {
        if (new Date(value) < new Date()) {
          throw new Error('Start date cannot be in the past');
        }
        return true;
      }),
    body('end_date')
      .isISO8601()
      .withMessage('End date must be a valid date')
      .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.body.start_date)) {
          throw new Error('End date must be after start date');
        }
        return true;
      }),
    body('reason')
      .isLength({ min: 10, max: 500 })
      .withMessage('Reason must be between 10 and 500 characters'),
    handleValidationErrors
  ],
  
  updateStatus: [
    body('status')
      .isIn(['pending', 'approved', 'rejected'])
      .withMessage('Invalid status'),
    body('comments')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Comments cannot exceed 500 characters'),
    handleValidationErrors
  ]
};

// Payroll validation rules
const payrollValidations = {
  create: [
    body('employee_id')
      .isUUID()
      .withMessage('Invalid employee ID'),
    body('pay_period_start')
      .isISO8601()
      .withMessage('Pay period start must be a valid date'),
    body('pay_period_end')
      .isISO8601()
      .withMessage('Pay period end must be a valid date'),
    body('gross_salary')
      .isFloat({ min: 0 })
      .withMessage('Gross salary must be a positive number'),
    body('deductions')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Deductions must be a positive number'),
    body('bonus')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Bonus must be a positive number'),
    handleValidationErrors
  ]
};

// Performance review validation rules
const performanceValidations = {
  create: [
    body('employee_id')
      .isUUID()
      .withMessage('Invalid employee ID'),
    body('reviewer_id')
      .isUUID()
      .withMessage('Invalid reviewer ID'),
    body('review_period_start')
      .isISO8601()
      .withMessage('Review period start must be a valid date'),
    body('review_period_end')
      .isISO8601()
      .withMessage('Review period end must be a valid date'),
    body('goals')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Goals cannot exceed 1000 characters'),
    body('achievements')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Achievements cannot exceed 1000 characters'),
    body('areas_for_improvement')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Areas for improvement cannot exceed 1000 characters'),
    body('overall_rating')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Overall rating must be between 1 and 5'),
    handleValidationErrors
  ]
};

// Query parameter validations
const queryValidations = {
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    handleValidationErrors
  ],
  
  search: [
    query('q')
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage('Search query must be between 1 and 100 characters'),
    handleValidationErrors
  ]
};

module.exports = {
  userValidations,
  employeeValidations,
  departmentValidations,
  leaveValidations,
  payrollValidations,
  performanceValidations,
  queryValidations,
  commonValidations,
  handleValidationErrors
};
