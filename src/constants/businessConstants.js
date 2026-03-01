// TD Learning Academy - Business Constants
// Centralized constants for the TD Learning Academy platform

import { businessConfig } from '../config/businessConfig';

// Company Constants
export const COMPANY_NAME = businessConfig.company.name;
export const COMPANY_SHORT_NAME = businessConfig.company.shortName;
export const COMPANY_TAGLINE = businessConfig.company.tagline;
export const COMPANY_WEBSITE = businessConfig.company.website;

// Contact Constants
export const COMPANY_EMAIL = businessConfig.contact.email;
export const COMPANY_PHONE = businessConfig.contact.phone;

// Branding Constants
export const BRAND_COLORS = businessConfig.branding.colors;
export const LOGO_PATHS = businessConfig.branding.logo;

// Education System Constants
export const EDUCATION_SYSTEM = businessConfig.education.system;
export const CURRENCY = businessConfig.education.currency;
export const CURRENCY_SYMBOL = businessConfig.education.currencySymbol;
export const LOCALE = businessConfig.education.locale;

// South African Grade System
export const SA_GRADES = businessConfig.education.grades;
export const SA_SUBJECTS = businessConfig.education.subjects;
export const SA_TERMS = businessConfig.education.terms;

// Session Types with Rates (ZAR)
export const SESSION_TYPES = businessConfig.education.sessionTypes;

// Default Business Settings
export const DEFAULT_SESSION_DURATION = businessConfig.defaults.sessionDuration;
export const DEFAULT_RATES = businessConfig.defaults.rates;
export const BUSINESS_HOURS = businessConfig.defaults.businessHours;
export const TIME_ZONE = businessConfig.defaults.timeZone;

// Feature Flags
export const FEATURES = businessConfig.features;
export const FEATURE_FLAGS = businessConfig.featureFlags;

// Business Type
export const IS_PRIVATE_BUSINESS = businessConfig.businessType.mode === "private";
export const IS_MULTI_TENANT = businessConfig.businessType.multiTenant;

// Date and Time Formats
export const DATE_FORMAT = businessConfig.defaults.dateFormat;
export const TIME_FORMAT = businessConfig.defaults.timeFormat;
export const DATETIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;

// Grade Categories for South African System
export const GRADE_PHASES = {
  SENIOR_PHASE: "Senior Phase", // Grades 8-9
  FET_PHASE: "FET Phase" // Grades 10-12
};

// Subject Categories
export const SUBJECT_CATEGORIES = {
  CORE: "Core",
  LANGUAGES: "Languages", 
  SCIENCES: "Sciences",
  COMMERCIAL: "Commercial",
  HUMANITIES: "Humanities",
  LIFE_SKILLS: "Life Skills",
  TECHNOLOGY: "Technology"
};

// Assessment Types
export const ASSESSMENT_TYPES = [
  "Formal Assessment Task",
  "Test",
  "Assignment", 
  "Project",
  "Practical",
  "Oral",
  "Examination"
];

// Mark Categories (South African System)
export const MARK_CATEGORIES = {
  OUTSTANDING: { min: 80, max: 100, level: 7, description: "Outstanding Achievement" },
  MERITORIOUS: { min: 70, max: 79, level: 6, description: "Meritorious Achievement" },
  SUBSTANTIAL: { min: 60, max: 69, level: 5, description: "Substantial Achievement" },
  ADEQUATE: { min: 50, max: 59, level: 4, description: "Adequate Achievement" },
  MODERATE: { min: 40, max: 49, level: 3, description: "Moderate Achievement" },
  ELEMENTARY: { min: 30, max: 39, level: 2, description: "Elementary Achievement" },
  NOT_ACHIEVED: { min: 0, max: 29, level: 1, description: "Not Achieved" }
};

// Session Status Options
export const SESSION_STATUS = {
  SCHEDULED: "scheduled",
  COMPLETED: "completed", 
  CANCELLED: "cancelled",
  NO_SHOW: "no-show",
  RESCHEDULED: "rescheduled"
};

// Payment Status Options
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  OVERDUE: "overdue",
  CANCELLED: "cancelled",
  REFUNDED: "refunded"
};

// Invoice Status Options
export const INVOICE_STATUS = {
  DRAFT: "draft",
  SENT: "sent", 
  VIEWED: "viewed",
  PAID: "paid",
  OVERDUE: "overdue",
  CANCELLED: "cancelled"
};

// User Roles for TD Learning Academy
export const USER_ROLES = {
  ADMIN: "admin", // You (business owner)
  TUTOR: "tutor", // Additional tutors (if any)
  STUDENT: "student", // Students
  PARENT: "parent" // Parents (future feature)
};

// Communication Preferences
export const COMMUNICATION_METHODS = {
  EMAIL: "email",
  WHATSAPP: "whatsapp",
  SMS: "sms",
  PHONE: "phone"
};

// Report Types
export const REPORT_TYPES = {
  STUDENT_PROGRESS: "student-progress",
  ATTENDANCE_SUMMARY: "attendance-summary", 
  FINANCIAL_REPORT: "financial-report",
  ACADEMIC_PERFORMANCE: "academic-performance",
  BILLING_SUMMARY: "billing-summary"
};

// Export Formats
export const EXPORT_FORMATS = {
  PDF: "pdf",
  CSV: "csv", 
  EXCEL: "xlsx"
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SESSION_REMINDER: "session-reminder",
  PAYMENT_DUE: "payment-due",
  PROGRESS_UPDATE: "progress-update",
  SYSTEM_ALERT: "system-alert"
};

// Theme Modes
export const THEME_MODES = {
  LIGHT: "light",
  DARK: "dark",
  AUTO: "auto"
};

// Application Routes (TD Learning Academy specific)
export const ROUTES = {
  DASHBOARD: "/dashboard",
  STUDENTS: "/students", 
  ATTENDANCE: "/attendance",
  MARKS: "/marks",
  BILLING: "/billing",
  REPORTS: "/reports",
  BUSINESS: "/business",
  PROFILE: "/profile",
  SETTINGS: "/settings"
};

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: "tdla_theme",
  USER_PREFERENCES: "tdla_user_preferences",
  LAST_BACKUP: "tdla_last_backup",
  SESSION_DATA: "tdla_session_data"
};

// API Endpoints (if needed for future integrations)
export const API_ENDPOINTS = {
  STUDENTS: "/api/students",
  ATTENDANCE: "/api/attendance", 
  MARKS: "/api/marks",
  BILLING: "/api/billing",
  REPORTS: "/api/reports"
};

// Validation Rules
export const VALIDATION_RULES = {
  STUDENT_NAME: {
    minLength: 2,
    maxLength: 50,
    required: true
  },
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    required: true
  },
  PHONE: {
    pattern: /^(\+27|0)[0-9]{9}$/, // South African phone format
    required: false
  },
  GRADE: {
    options: SA_GRADES.map(g => g.value),
    required: true
  },
  SUBJECT: {
    options: SA_SUBJECTS.map(s => s.name),
    required: true
  },
  MARK: {
    min: 0,
    max: 100,
    required: true
  },
  CURRENCY: {
    options: ['ZAR', 'USD', 'GBP', 'EUR', 'AED'],
    required: true,
    default: 'ZAR'
  },
  CURRENCY_AMOUNT: {
    min: 0,
    max: 999999,
    decimalPlaces: 2,
    required: false
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PHONE: "Please enter a valid South African phone number",
  INVALID_MARK: "Mark must be between 0 and 100",
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action",
  NOT_FOUND: "The requested resource was not found"
};

// Success Messages  
export const SUCCESS_MESSAGES = {
  STUDENT_ADDED: "Student added successfully",
  STUDENT_UPDATED: "Student updated successfully",
  ATTENDANCE_RECORDED: "Attendance recorded successfully", 
  MARK_ADDED: "Mark added successfully",
  INVOICE_GENERATED: "Invoice generated successfully",
  DATA_EXPORTED: "Data exported successfully"
};

export default {
  COMPANY_NAME,
  COMPANY_SHORT_NAME,
  BRAND_COLORS,
  LOGO_PATHS,
  SA_GRADES,
  SA_SUBJECTS,
  SESSION_TYPES,
  DEFAULT_RATES,
  FEATURES,
  IS_PRIVATE_BUSINESS
};
