// TD Learning Academy - Private Business Configuration
// This file contains all TD Learning Academy specific settings and branding

export const businessConfig = {
  // Company Information
  company: {
    name: "TD Learning Academy",
    shortName: "TDLA",
    tagline: "Excellence in Education",
    description: "Personalized tutoring services for academic success",
    website: "https://tdla.co.za",
    domain: "tdla.co.za",
  },

  // Contact Information
  contact: {
    email: "info@tdla.co.za",
    phone: "+27 XX XXX XXXX", // Update with your actual phone
    address: {
      street: "Your Business Address",
      city: "Your City",
      province: "Your Province",
      country: "South Africa",
      postalCode: "XXXX"
    },
    socialMedia: {
      facebook: "https://facebook.com/tdlearningacademy",
      instagram: "https://instagram.com/tdlearningacademy",
      linkedin: "https://linkedin.com/company/tdlearningacademy"
    }
  },

  // Business Type Configuration
  businessType: {
    mode: "private", // private | saas
    multiTenant: false, // Single business instance
    publicSignup: false, // No public registration
    adminOnly: true, // Admin manages all users
  },

  // Branding Configuration
  branding: {
    logo: {
      main: "/assets/logos/tdla-logo-main.png",
      icon: "/assets/logos/tdla-icon.png",
      favicon: "/assets/logos/tdla-favicon.ico",
      loginLogo: "/assets/logos/tdla-login-logo.png",
      darkMode: "/assets/logos/tdla-logo-dark.png",
      lightMode: "/assets/logos/tdla-logo-light.png",
      // SVG Logo - OPTION 2: Geometric Faceted + Braided Tassels (User's Final Choice)
      svg: `<svg viewBox="0 0 250 130" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="emeraldPremium" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#00E676;stop-opacity:1" />
            <stop offset="25%" style="stop-color:#00C853;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#00A843;stop-opacity:1" />
            <stop offset="75%" style="stop-color:#00796B;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#004D40;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FFECB3;stop-opacity:1" />
            <stop offset="20%" style="stop-color:#FFD700;stop-opacity:1" />
            <stop offset="40%" style="stop-color:#FFC107;stop-opacity:1" />
            <stop offset="60%" style="stop-color:#FF8F00;stop-opacity:1" />
            <stop offset="80%" style="stop-color:#E65100;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#BF360C;stop-opacity:1" />
          </linearGradient>
          <filter id="premiumShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="3" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.25"/>
          </filter>
        </defs>

        <!-- Bold Geometric Faceted Graduation Cap -->
        <g filter="url(#premiumShadow)">
          <polygon points="20,35 80,35 90,40 85,48 15,48 10,40" fill="url(#emeraldPremium)" stroke="#004D40" stroke-width="2"/>
          <polygon points="10,40 20,35 30,45 15,48" fill="#00A843" opacity="0.95"/>
          <polygon points="40,32 60,32 65,42 45,42" fill="url(#emeraldPremium)" opacity="0.85"/>
          <polygon points="20,35 50,25 80,35 50,40" fill="url(#emeraldPremium)"/>
          <polygon points="35,28 50,20 65,28 50,25" fill="#00E676" opacity="0.6"/>
        </g>

        <!-- Sophisticated Braided Tassels with Extended Length -->
        <g filter="url(#premiumShadow)">
          <circle cx="90" cy="38" r="8" fill="url(#goldMetallic)" stroke="#BF360C" stroke-width="2.5"/>
          <circle cx="90" cy="38" r="5" fill="url(#goldMetallic)"/>
          <path d="M90,46 Q95,54 90,62 Q85,70 90,78 Q95,86 90,94 Q85,102 90,110" stroke="url(#goldMetallic)" stroke-width="5" fill="none" stroke-linecap="round"/>
          <path d="M87,47 Q82,55 87,63 Q92,71 87,79 Q82,87 87,95 Q92,103 87,111" stroke="#FFD700" stroke-width="4" fill="none" stroke-linecap="round"/>
          <path d="M93,47 Q98,55 93,63 Q88,71 93,79 Q98,87 93,95 Q88,103 93,111" stroke="#FFD700" stroke-width="4" fill="none" stroke-linecap="round"/>
          <ellipse cx="90" cy="62" rx="3" ry="2" fill="url(#goldMetallic)" opacity="0.8"/>
          <ellipse cx="90" cy="78" rx="3.5" ry="2.5" fill="#FFD700" opacity="0.9"/>
          <ellipse cx="90" cy="94" rx="4" ry="3" fill="#FFD700" opacity="0.7"/>
        </g>

        <!-- Premium TDLA Letters -->
        <g filter="url(#premiumShadow)">
          <text x="110" y="45" font-family="Arial Black, sans-serif" font-size="32" font-weight="900" fill="url(#emeraldPremium)" letter-spacing="3px" stroke="#004D40" stroke-width="0.5">TD</text>
          <text x="110" y="80" font-family="Arial Black, sans-serif" font-size="32" font-weight="900" fill="url(#goldMetallic)" letter-spacing="3px" stroke="#BF360C" stroke-width="0.5">LA</text>
        </g>

        <ellipse cx="60" cy="120" rx="45" ry="5" fill="#000000" opacity="0.2"/>
      </svg>`
    },
    colors: {
      // TD Learning Academy Brand Colors
      primary: "#00D4AA", // Emerald Green
      secondary: "#FFD93D", // Gold
      tertiary: "#1a1a1a", // Dark
      accent: "#4A90E2", // Blue accent
      success: "#00D4AA",
      warning: "#FFD93D",
      error: "#FF6B6B",
      info: "#4A90E2"
    },
    fonts: {
      primary: "'Inter', 'Roboto', sans-serif",
      secondary: "'Poppins', 'Inter', sans-serif",
      heading: "'Poppins', 'Inter', sans-serif"
    }
  },

  // South African Education System Configuration
  education: {
    system: "south-african",
    currency: "ZAR",
    currencySymbol: "R",
    locale: "en-ZA",
    
    // South African Grade System
    grades: [
      { value: "8", label: "Grade 8", phase: "Senior Phase" },
      { value: "9", label: "Grade 9", phase: "Senior Phase" },
      { value: "10", label: "Grade 10", phase: "FET Phase" },
      { value: "11", label: "Grade 11", phase: "FET Phase" },
      { value: "12", label: "Grade 12", phase: "FET Phase" }
    ],

    // South African Subjects
    subjects: [
      // Core Subjects
      { name: "Mathematics", category: "Core", required: true },
      { name: "Mathematical Literacy", category: "Core", required: false },
      { name: "English Home Language", category: "Languages", required: true },
      { name: "English First Additional Language", category: "Languages", required: false },
      { name: "Afrikaans Home Language", category: "Languages", required: false },
      { name: "Afrikaans First Additional Language", category: "Languages", required: false },
      
      // Sciences
      { name: "Physical Sciences", category: "Sciences", required: false },
      { name: "Life Sciences", category: "Sciences", required: false },
      { name: "Natural Science (NS)", category: "Sciences", required: false },
      { name: "Geography", category: "Sciences", required: false },
      
      // Commercial Subjects
      { name: "Accounting", category: "Commercial", required: false },
      { name: "Business Studies", category: "Commercial", required: false },
      { name: "Economics", category: "Commercial", required: false },
      
      // Other Subjects
      { name: "History", category: "Humanities", required: false },
      { name: "Social Studies (SS)", category: "Humanities", required: false },
      { name: "Life Orientation (LO)", category: "Life Skills", required: true },
      { name: "Technical Drawing", category: "Technology", required: false },
      { name: "Information Technology", category: "Technology", required: false },
      { name: "Computer Applications Technology", category: "Technology", required: false }
    ],

    // Assessment Terms (South African System)
    terms: [
      { value: "term1", label: "Term 1", months: ["January", "March"] },
      { value: "term2", label: "Term 2", months: ["April", "June"] },
      { value: "term3", label: "Term 3", months: ["July", "September"] },
      { value: "term4", label: "Term 4", months: ["October", "December"] }
    ],

    // Session Types for TD Learning Academy
    sessionTypes: [
      { value: "individual", label: "Individual Tutoring", rate: 350 },
      { value: "group", label: "Group Session (2-3 students)", rate: 250 },
      { value: "intensive", label: "Intensive Session", rate: 450 },
      { value: "exam-prep", label: "Exam Preparation", rate: 400 },
      { value: "homework-help", label: "Homework Assistance", rate: 200 },
      { value: "online", label: "Online Session", rate: 300 }
    ]
  },

  // Business Features Configuration
  features: {
    // Core Features
    studentManagement: true,
    attendanceTracking: true,
    marksManagement: true,
    billingSystem: true,
    reportGeneration: true,
    
    // Advanced Features
    parentCommunication: true,
    documentManagement: true,
    analyticsReporting: true,
    exportFunctionality: true,
    
    // TD Learning Academy Specific
    southAfricanCurriculum: true,
    multiLanguageSupport: true, // English & Afrikaans
    localizedReports: true,
    parentPortal: false, // Future feature
    mobileApp: false, // Future feature
  },

  // Default Settings
  defaults: {
    sessionDuration: 60, // minutes
    currency: "ZAR",
    timeZone: "Africa/Johannesburg",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "HH:mm",
    language: "en-ZA",
    
    // Default rates (in ZAR)
    rates: {
      individual: 350,
      group: 250,
      online: 300
    },
    
    // Business Hours
    businessHours: {
      monday: { start: "14:00", end: "18:00" },
      tuesday: { start: "14:00", end: "18:00" },
      wednesday: { start: "14:00", end: "18:00" },
      thursday: { start: "14:00", end: "18:00" },
      friday: { start: "14:00", end: "18:00" },
      saturday: { start: "08:00", end: "12:00" },
      sunday: { closed: true }
    }
  },

  // Version and Environment
  version: "1.0.0",
  environment: "production",
  lastUpdated: new Date().toISOString(),
  
  // Feature Flags
  featureFlags: {
    newDashboard: true,
    advancedAnalytics: true,
    mobileOptimization: true,
    darkMode: true,
    exportToPDF: true,
    whatsappIntegration: false, // Future feature
    smsNotifications: false, // Future feature
  }
};

// Helper functions for business configuration
export const getBusinessConfig = () => businessConfig;

export const getCompanyInfo = () => businessConfig.company;

export const getBrandingConfig = () => businessConfig.branding;

export const getEducationConfig = () => businessConfig.education;

export const isPrivateBusiness = () => businessConfig.businessType.mode === "private";

export const getSupportedGrades = () => businessConfig.education.grades;

export const getSupportedSubjects = () => businessConfig.education.subjects;

export const getSessionTypes = () => businessConfig.education.sessionTypes;

export const getDefaultRates = () => businessConfig.defaults.rates;

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: businessConfig.education.currency,
    minimumFractionDigits: 2
  }).format(amount);
};

export default businessConfig;
