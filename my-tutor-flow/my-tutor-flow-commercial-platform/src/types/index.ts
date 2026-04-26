// User and Authentication Types
export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'tutor' | 'admin';
  createdAt: string;
}

export interface AuthContextType {
  currentUser: any | null; // Firebase User type
  userRole: string | null;
  loadingAuth: boolean;
  handleLogout: () => Promise<void>;
}

// Student Types
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  grade: string;
  subject: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  notes?: string;
  // Multi-Currency Support
  preferredCurrency: string; // Currency code (ZAR, USD, GBP, EUR, AED)
  initialAmount?: number; // Initial amount in preferred currency
  billingRates?: {
    online?: { amount: number; currency: string };
    in_person_class?: { amount: number; currency: string };
    in_person_one_on_one?: { amount: number; currency: string };
    intensive?: { amount: number; currency: string };
    exam_prep?: { amount: number; currency: string };
    homework?: { amount: number; currency: string };
  };
  currencySettings?: {
    displayFormat: 'symbol' | 'code' | 'both';
    showExchangeRate: boolean;
    lastCurrencyUpdate?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Attendance Types
export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  present: boolean;
  sessionType: 'online' | 'in_person_class' | 'in_person_one_on_one';
  duration: number; // in hours
  notes?: string;
  createdAt: string;
}

// Marks/Grades Types
export interface MarksRecord {
  id: string;
  studentId: string;
  subject: string;
  testName: string;
  marks: number;
  totalMarks: number;
  percentage: number;
  date: string;
  notes?: string;
  createdAt: string;
}

// Invoice/Billing Types
export interface Invoice {
  id: string;
  studentId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'unpaid' | 'overdue';
  dueDate: string;
  paidDate?: string;
  description: string;
  // Multi-Currency Support
  exchangeRate?: number; // Exchange rate at time of invoice creation
  baseCurrencyAmount?: number; // Amount in base currency (ZAR)
  currencySymbol?: string; // Currency symbol for display
  sessionBreakdown?: InvoiceSessionItem[];
  additionalCharges?: InvoiceAdditionalCharge[];
  totals?: {
    subtotal: number;
    tax: number;
    total: number;
    formattedSubtotal: string;
    formattedTax: string;
    formattedTotal: string;
  };
  createdAt: string;
}

export interface InvoiceSessionItem {
  sessionId: string;
  date: string;
  sessionType: string;
  duration: number; // in minutes
  rate: number; // hourly rate
  amount: number; // calculated amount
  currency: string;
  formattedAmount: string;
}

export interface InvoiceAdditionalCharge {
  id: string;
  description: string;
  amount: number;
  currency: string;
  formattedAmount: string;
}

// Parent Log Types
export interface ParentLog {
  id: string;
  studentId: string;
  message: string;
  type: 'progress' | 'behavior' | 'attendance' | 'general';
  createdAt: string;
}

// Document Types
export interface Document {
  id: string;
  studentId: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  students: number;
  sessions: number;
  hours: number;
  quickStatsByGrade: Record<string, number>;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: 'tutor' | 'admin';
}

// Component Props Types
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export interface NavBarProps {
  userRole: string;
  handleLogout: () => void;
}

// Hook Return Types
export interface UseStudentProfileDataReturn {
  student: Student | null;
  attendanceSummary: any;
  attendance: AttendanceRecord[];
  marks: MarksRecord[];
  invoices: Invoice[];
  parentLogs: ParentLog[];
  documents: Document[];
  allAttendance: AttendanceRecord[];
  allInvoices: Invoice[];
  loading: boolean;
  error: string | null;
  snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  };
  setSnackbar: (snackbar: any) => void;
  reloadData: () => void;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface NotificationState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

// Environment Variables Type
export interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
