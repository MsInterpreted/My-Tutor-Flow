// Session Types
export const SESSION_TYPES = [
  { value: 'online', label: 'Online' },
  { value: 'in_person_class', label: 'In-Person Class' },
  { value: 'in_person_one_on_one', label: 'In-Person One-on-One' },
] as const;

export const SESSION_TYPE_LABELS = {
  online: 'Online',
  in_person_class: 'In-Person Class',
  in_person_one_on_one: 'In-Person One-on-One',
} as const;

export const DURATION_OPTIONS = [
  { value: 1, label: '1 hr' },
  { value: 1.5, label: '1.5 hrs' },
  { value: 2, label: '2 hrs' },
  { value: 2.5, label: '2.5 hrs' },
  { value: 3, label: '3 hrs' },
] as const;

// User Roles
export const USER_ROLES = {
  TUTOR: 'tutor',
  ADMIN: 'admin',
} as const;

// Invoice Status
export const INVOICE_STATUS = {
  PAID: 'paid',
  UNPAID: 'unpaid',
  OVERDUE: 'overdue',
} as const;

export const STATUS_COLORS = {
  paid: 'success',
  unpaid: 'warning',
  overdue: 'error',
} as const;

// Parent Log Types
export const PARENT_LOG_TYPES = [
  { value: 'call', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS/Text' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'other', label: 'Other' },
] as const;

export const PARENT_LOG_TYPE_CATEGORIES = {
  PROGRESS: 'progress',
  BEHAVIOR: 'behavior',
  ATTENDANCE: 'attendance',
  GENERAL: 'general',
} as const;

// Grade Levels
export const GRADE_LEVELS = [
  'Pre-K',
  'K',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
] as const;

// Common Subjects
export const SUBJECTS = [
  'Mathematics',
  'English',
  'Science',
  'History',
  'Geography',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Art',
  'Music',
  'Physical Education',
  'Foreign Language',
  'Technical Drawing',
  'Social Studies (SS)',
  'Natural Science (NS)',
  'Life Orientation (LO)',
  'Other',
] as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  INPUT: 'YYYY-MM-DD',
  DATETIME: 'MMM DD, YYYY HH:mm',
  TIME: 'HH:mm',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'tutorflow_theme',
  USER_PREFERENCES: 'tutorflow_user_preferences',
  LAST_VISITED_PAGE: 'tutorflow_last_page',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  SIGNUP_FAILED: 'Signup failed. Please try again.',
  PASSWORD_MISMATCH: 'Passwords do not match.',
  WEAK_PASSWORD: 'Password must be at least 6 characters long.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  STUDENT_CREATED: 'Student created successfully!',
  STUDENT_UPDATED: 'Student updated successfully!',
  STUDENT_DELETED: 'Student deleted successfully!',
  ATTENDANCE_RECORDED: 'Attendance recorded successfully!',
  MARKS_ADDED: 'Marks added successfully!',
  INVOICE_CREATED: 'Invoice created successfully!',
  PARENT_LOG_ADDED: 'Parent log added successfully!',
  DOCUMENT_UPLOADED: 'Document uploaded successfully!',
  LOGIN_SUCCESS: 'Login successful!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const;

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#1976d2',
  SECONDARY: '#dc004e',
  SUCCESS: '#2e7d32',
  ERROR: '#d32f2f',
  WARNING: '#ed6c02',
  INFO: '#0288d1',
} as const;
