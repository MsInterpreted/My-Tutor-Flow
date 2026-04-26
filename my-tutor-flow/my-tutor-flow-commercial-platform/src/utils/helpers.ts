import dayjs from 'dayjs';
import { DATE_FORMATS, VALIDATION_RULES } from './constants';
import type { Student, AttendanceRecord, Invoice } from '../types';

// Date Utilities
export const formatDate = (date: string | Date, format: string = DATE_FORMATS.DISPLAY): string => {
  return dayjs(date).format(format);
};

export const isDateInRange = (
  date: string | Date,
  startDate: string | Date,
  endDate: string | Date
): boolean => {
  const targetDate = dayjs(date);
  return targetDate.isAfter(dayjs(startDate)) && targetDate.isBefore(dayjs(endDate));
};

export const getDateRangeForMonth = (year: number, month: number) => {
  const startOfMonth = dayjs().year(year).month(month).startOf('month');
  const endOfMonth = dayjs().year(year).month(month).endOf('month');
  return {
    start: startOfMonth.toDate(),
    end: endOfMonth.toDate(),
  };
};

// Validation Utilities
export const validateEmail = (email: string): boolean => {
  return VALIDATION_RULES.EMAIL.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return VALIDATION_RULES.PHONE.test(phone);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return {
      isValid: false,
      message: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long`,
    };
  }
  return { isValid: true };
};

export const validateName = (name: string): { isValid: boolean; message?: string } => {
  if (name.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    return {
      isValid: false,
      message: `Name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters long`,
    };
  }
  if (name.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
    return {
      isValid: false,
      message: `Name must be less than ${VALIDATION_RULES.NAME_MAX_LENGTH} characters`,
    };
  }
  return { isValid: true };
};

// String Utilities
export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Number Utilities
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

export const roundToDecimalPlaces = (num: number, decimalPlaces: number = 2): number => {
  return Math.round(num * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
};

// Array Utilities
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce(
    (groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    },
    {} as Record<string, T[]>
  );
};

export const sortBy = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// Student Utilities
export const getStudentFullName = (student: Student): string => {
  return `${student.firstName} ${student.lastName}`;
};

export const getStudentsByGrade = (students: Student[]): Record<string, Student[]> => {
  return groupBy(students, 'grade');
};

// Attendance Utilities
export const calculateAttendanceRate = (attendanceRecords: AttendanceRecord[]): number => {
  if (attendanceRecords.length === 0) return 0;
  const presentCount = attendanceRecords.filter(record => record.present).length;
  return calculatePercentage(presentCount, attendanceRecords.length);
};

export const getTotalHours = (attendanceRecords: AttendanceRecord[]): number => {
  return attendanceRecords
    .filter(record => record.present)
    .reduce((total, record) => total + record.duration, 0);
};

// Invoice Utilities
export const getOverdueInvoices = (invoices: Invoice[]): Invoice[] => {
  const today = dayjs();
  return invoices.filter(
    invoice => invoice.status === 'unpaid' && dayjs(invoice.dueDate).isBefore(today)
  );
};

export const getTotalAmount = (invoices: Invoice[]): number => {
  return invoices.reduce((total, invoice) => total + invoice.amount, 0);
};

export const getUnpaidAmount = (invoices: Invoice[]): number => {
  return invoices
    .filter(invoice => invoice.status === 'unpaid' || invoice.status === 'overdue')
    .reduce((total, invoice) => total + invoice.amount, 0);
};

// File Utilities
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

// Error Handling Utilities
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.code) return error.code;
  return 'An unexpected error occurred';
};

// Local Storage Utilities
export const setLocalStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// Debounce Utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Generate Random ID (for temporary use before Firebase generates real IDs)
export const generateTempId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
