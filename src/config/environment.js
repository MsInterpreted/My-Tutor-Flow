// TD Learning Academy - Environment Configuration
// Centralized environment variable management with validation and defaults

/**
 * Environment Configuration for TD Learning Academy
 * Provides type-safe access to environment variables with validation
 */

// Application Configuration
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'TD Learning Academy',
  shortName: import.meta.env.VITE_APP_SHORT_NAME || 'TDLA',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  environment: import.meta.env.VITE_APP_ENVIRONMENT || 'production',
  mode: import.meta.env.VITE_APP_MODE || 'private',
};

// Business Information
export const BUSINESS_INFO = {
  name: import.meta.env.VITE_BUSINESS_NAME || 'TD Learning Academy',
  domain: import.meta.env.VITE_BUSINESS_DOMAIN || 'tdla.co.za',
  email: import.meta.env.VITE_BUSINESS_EMAIL || 'info@tdla.co.za',
  phone: import.meta.env.VITE_BUSINESS_PHONE || '+27 XX XXX XXXX',
  address: import.meta.env.VITE_CONTACT_ADDRESS || 'Your Business Address',
  postalCode: import.meta.env.VITE_CONTACT_POSTAL_CODE || 'XXXX',
  registrationNumber: import.meta.env.VITE_BUSINESS_REGISTRATION_NUMBER || '',
  vatNumber: import.meta.env.VITE_VAT_NUMBER || '',
  taxReference: import.meta.env.VITE_TAX_REFERENCE || '',
};

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Theme Configuration
export const THEME_CONFIG = {
  defaultTheme: import.meta.env.VITE_DEFAULT_THEME || 'light',
  primaryColor: import.meta.env.VITE_BRAND_PRIMARY_COLOR || '#00D4AA',
  secondaryColor: import.meta.env.VITE_BRAND_SECONDARY_COLOR || '#FFD93D',
  enableDarkMode: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
};

// Feature Flags
export const FEATURE_FLAGS = {
  multiTenant: import.meta.env.VITE_ENABLE_MULTI_TENANT === 'true',
  publicSignup: import.meta.env.VITE_ENABLE_PUBLIC_SIGNUP === 'true',
  parentPortal: import.meta.env.VITE_ENABLE_PARENT_PORTAL === 'true',
  mobileApp: import.meta.env.VITE_ENABLE_MOBILE_APP === 'true',
  whatsappIntegration: import.meta.env.VITE_ENABLE_WHATSAPP_INTEGRATION === 'true',
  smsNotifications: import.meta.env.VITE_ENABLE_SMS_NOTIFICATIONS === 'true',
  advancedAnalytics: import.meta.env.VITE_ENABLE_ADVANCED_ANALYTICS === 'true',
  exportFeatures: import.meta.env.VITE_ENABLE_EXPORT_FEATURES === 'true',
  fingerprintAuth: import.meta.env.VITE_ENABLE_FINGERPRINT_AUTH === 'true',
  analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  errorTracking: import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true',
  performanceMonitoring: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true',
  debugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
  mockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  codeSplitting: import.meta.env.VITE_ENABLE_CODE_SPLITTING === 'true',
  lazyLoading: import.meta.env.VITE_ENABLE_LAZY_LOADING === 'true',
  serviceWorker: import.meta.env.VITE_ENABLE_SERVICE_WORKER === 'true',
  pwa: import.meta.env.VITE_ENABLE_PWA === 'true',
};

// Localization Configuration
export const LOCALE_CONFIG = {
  locale: import.meta.env.VITE_LOCALE || 'en-ZA',
  currency: import.meta.env.VITE_CURRENCY || 'ZAR',
  timezone: import.meta.env.VITE_TIMEZONE || 'Africa/Johannesburg',
  dateFormat: import.meta.env.VITE_DATE_FORMAT || 'DD/MM/YYYY',
  timeFormat: import.meta.env.VITE_TIME_FORMAT || 'HH:mm',
};

// Business Hours Configuration
export const BUSINESS_HOURS = {
  monday: {
    start: import.meta.env.VITE_BUSINESS_HOURS_MON_START || '14:00',
    end: import.meta.env.VITE_BUSINESS_HOURS_MON_END || '18:00',
  },
  tuesday: {
    start: import.meta.env.VITE_BUSINESS_HOURS_TUE_START || '14:00',
    end: import.meta.env.VITE_BUSINESS_HOURS_TUE_END || '18:00',
  },
  wednesday: {
    start: import.meta.env.VITE_BUSINESS_HOURS_WED_START || '14:00',
    end: import.meta.env.VITE_BUSINESS_HOURS_WED_END || '18:00',
  },
  thursday: {
    start: import.meta.env.VITE_BUSINESS_HOURS_THU_START || '14:00',
    end: import.meta.env.VITE_BUSINESS_HOURS_THU_END || '18:00',
  },
  friday: {
    start: import.meta.env.VITE_BUSINESS_HOURS_FRI_START || '14:00',
    end: import.meta.env.VITE_BUSINESS_HOURS_FRI_END || '18:00',
  },
  saturday: {
    start: import.meta.env.VITE_BUSINESS_HOURS_SAT_START || '08:00',
    end: import.meta.env.VITE_BUSINESS_HOURS_SAT_END || '12:00',
  },
  sunday: {
    closed: import.meta.env.VITE_BUSINESS_HOURS_SUN_CLOSED === 'true',
  },
};

// Default Rates (in ZAR)
export const DEFAULT_RATES = {
  individual: parseInt(import.meta.env.VITE_DEFAULT_RATE_INDIVIDUAL) || 350,
  group: parseInt(import.meta.env.VITE_DEFAULT_RATE_GROUP) || 250,
  online: parseInt(import.meta.env.VITE_DEFAULT_RATE_ONLINE) || 300,
  intensive: parseInt(import.meta.env.VITE_DEFAULT_RATE_INTENSIVE) || 450,
  examPrep: parseInt(import.meta.env.VITE_DEFAULT_RATE_EXAM_PREP) || 400,
  homework: parseInt(import.meta.env.VITE_DEFAULT_RATE_HOMEWORK) || 200,
};

// Security Configuration
export const SECURITY_CONFIG = {
  sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 3600000, // 1 hour
  maxLoginAttempts: parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS) || 5,
  enableFingerprintAuth: FEATURE_FLAGS.fingerprintAuth,
};

// File Upload Configuration
export const FILE_UPLOAD_CONFIG = {
  maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760, // 10MB
  allowedFileTypes: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'pdf,doc,docx,jpg,jpeg,png').split(','),
};

// API Configuration
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.tdla.co.za',
  version: import.meta.env.VITE_API_VERSION || 'v1',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
};

// Social Media Links
export const SOCIAL_MEDIA = {
  facebook: import.meta.env.VITE_FACEBOOK_URL || '',
  instagram: import.meta.env.VITE_INSTAGRAM_URL || '',
  linkedin: import.meta.env.VITE_LINKEDIN_URL || '',
};

// Legal and Compliance
export const LEGAL_CONFIG = {
  privacyPolicyUrl: import.meta.env.VITE_PRIVACY_POLICY_URL || 'https://tdla.co.za/privacy',
  termsOfServiceUrl: import.meta.env.VITE_TERMS_OF_SERVICE_URL || 'https://tdla.co.za/terms',
  gdprCompliance: import.meta.env.VITE_GDPR_COMPLIANCE === 'true',
  popiaCompliance: import.meta.env.VITE_POPIA_COMPLIANCE === 'true',
};

// Branding Assets
export const BRANDING_ASSETS = {
  logoPath: import.meta.env.VITE_LOGO_PATH || '/assets/logos/tdla-logo-main.png',
  faviconPath: import.meta.env.VITE_FAVICON_PATH || '/assets/logos/tdla-favicon.ico',
  appleTouchIcon: import.meta.env.VITE_APPLE_TOUCH_ICON || '/assets/logos/tdla-icon.png',
};

// SEO Meta Tags
export const SEO_CONFIG = {
  title: import.meta.env.VITE_META_TITLE || 'TD Learning Academy - Excellence in Education',
  description: import.meta.env.VITE_META_DESCRIPTION || 'Professional tutoring services for academic success in South Africa',
  keywords: import.meta.env.VITE_META_KEYWORDS || 'tutoring, education, South Africa, academic support, TDLA',
  author: import.meta.env.VITE_META_AUTHOR || 'TD Learning Academy',
};

// Monitoring and Logging
export const MONITORING_CONFIG = {
  logLevel: import.meta.env.VITE_LOG_LEVEL || 'error',
  enableCrashReporting: import.meta.env.VITE_ENABLE_CRASH_REPORTING === 'true',
  sentryDsn: import.meta.env.VITE_SENTRY_DSN || '',
};

// Validation Functions
export const validateEnvironment = () => {
  const errors = [];
  
  // Check required Firebase configuration
  if (!FIREBASE_CONFIG.apiKey) {
    errors.push('VITE_FIREBASE_API_KEY is required');
  }
  if (!FIREBASE_CONFIG.projectId) {
    errors.push('VITE_FIREBASE_PROJECT_ID is required');
  }
  
  // Check business information
  if (!BUSINESS_INFO.email || !BUSINESS_INFO.email.includes('@')) {
    errors.push('Valid VITE_BUSINESS_EMAIL is required');
  }
  
  // Check rates are valid numbers
  Object.entries(DEFAULT_RATES).forEach(([key, value]) => {
    if (isNaN(value) || value <= 0) {
      errors.push(`Invalid rate for ${key}: ${value}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Environment utilities
export const isDevelopment = () => APP_CONFIG.environment === 'development';
export const isProduction = () => APP_CONFIG.environment === 'production';
export const isPrivateBusiness = () => APP_CONFIG.mode === 'private';
export const isSaasMode = () => APP_CONFIG.mode === 'saas';

// Get environment summary
export const getEnvironmentSummary = () => ({
  app: APP_CONFIG,
  business: BUSINESS_INFO,
  features: FEATURE_FLAGS,
  locale: LOCALE_CONFIG,
  theme: THEME_CONFIG,
  validation: validateEnvironment(),
});

// Export all configurations
export default {
  APP_CONFIG,
  BUSINESS_INFO,
  FIREBASE_CONFIG,
  THEME_CONFIG,
  FEATURE_FLAGS,
  LOCALE_CONFIG,
  BUSINESS_HOURS,
  DEFAULT_RATES,
  SECURITY_CONFIG,
  FILE_UPLOAD_CONFIG,
  API_CONFIG,
  SOCIAL_MEDIA,
  LEGAL_CONFIG,
  BRANDING_ASSETS,
  SEO_CONFIG,
  MONITORING_CONFIG,
  validateEnvironment,
  isDevelopment,
  isProduction,
  isPrivateBusiness,
  isSaasMode,
  getEnvironmentSummary,
};
