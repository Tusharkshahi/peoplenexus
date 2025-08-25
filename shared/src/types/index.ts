// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  position: string;
  hireDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  HR_MANAGER = 'hr_manager',
  MANAGER = 'manager',
  EMPLOYEE = 'employee'
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Employee Types
export interface Employee extends User {
  employeeId: string;
  salary: number;
  managerId?: string;
  directReports?: string[];
  skills: string[];
  certifications: Certification[];
  performanceReviews: PerformanceReview[];
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
}

// Performance Types
export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  reviewDate: Date;
  rating: number;
  comments: string;
  goals: string[];
  achievements: string[];
  areasForImprovement: string[];
  nextReviewDate: Date;
}

// Leave Types
export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum LeaveType {
  ANNUAL = 'annual',
  SICK = 'sick',
  PERSONAL = 'personal',
  MATERNITY = 'maternity',
  PATERNITY = 'paternity',
  UNPAID = 'unpaid'
}

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

// Payroll Types
export interface PayrollRecord {
  id: string;
  employeeId: string;
  payPeriod: PayPeriod;
  grossPay: number;
  netPay: number;
  deductions: Deduction[];
  allowances: Allowance[];
  overtimeHours: number;
  overtimePay: number;
  status: PayrollStatus;
  paidAt?: Date;
  createdAt: Date;
}

export interface PayPeriod {
  startDate: Date;
  endDate: Date;
  periodType: 'weekly' | 'biweekly' | 'monthly';
}

export interface Deduction {
  type: string;
  amount: number;
  description: string;
}

export interface Allowance {
  type: string;
  amount: number;
  description: string;
}

export enum PayrollStatus {
  PENDING = 'pending',
  PROCESSED = 'processed',
  PAID = 'paid',
  CANCELLED = 'cancelled'
}

// Recruitment Types
export interface JobPosting {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  status: JobStatus;
  postedAt: Date;
  closingDate?: Date;
  applications: JobApplication[];
}

export enum JobStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
  FILLED = 'filled'
}

export interface JobApplication {
  id: string;
  jobId: string;
  applicantId: string;
  resume: string;
  coverLetter?: string;
  status: ApplicationStatus;
  appliedAt: Date;
  reviewedAt?: Date;
  interviewedAt?: Date;
  notes: string[];
}

export enum ApplicationStatus {
  APPLIED = 'applied',
  REVIEWING = 'reviewing',
  INTERVIEWING = 'interviewing',
  SHORTLISTED = 'shortlisted',
  REJECTED = 'rejected',
  HIRED = 'hired'
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Common Types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

