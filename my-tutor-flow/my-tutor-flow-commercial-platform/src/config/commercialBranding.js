// My Tutor Flow Commercial Platform - Branding Configuration
// This file contains all branding and configuration for the commercial version

export const COMMERCIAL_BRANDING = {
  // Application Information
  appName: 'My Tutor Flow',
  appShortName: 'MTF',
  appDescription: 'Professional Tutoring Management Platform',
  appTagline: 'Streamline Your Tutoring Business',
  version: '1.0.0',
  
  // Company Information
  companyName: 'My Tutor Flow',
  companyWebsite: 'https://mytutorflow.com',
  supportEmail: 'support@mytutorflow.com',
  salesEmail: 'sales@mytutorflow.com',
  
  // Branding Colors (Professional Blue & Green Theme)
  colors: {
    primary: '#1976D2',      // Professional Blue
    secondary: '#00C853',    // Success Green
    accent: '#FF6F00',       // Orange Accent
    background: {
      light: '#FAFAFA',
      dark: '#121212',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
  
  // Logo Configuration
  logos: {
    main: '/assets/mtf-logo-main.png',
    light: '/assets/mtf-logo-light.png',
    dark: '/assets/mtf-logo-dark.png',
    icon: '/assets/mtf-icon.png',
    favicon: '/assets/mtf-favicon.ico',
  },
  
  // Feature Configuration
  features: {
    // Core Features (Always Enabled)
    studentManagement: true,
    attendanceTracking: true,
    basicBilling: true,
    basicReports: true,
    
    // Premium Features (Can be toggled)
    advancedAnalytics: true,
    multiCurrency: true,
    exportFeatures: true,
    mobileApp: true,
    darkMode: true,
    
    // Enterprise Features (For higher tiers)
    multiTenant: false,
    whiteLabel: false,
    apiAccess: false,
    customBranding: false,
  },
  
  // Subscription Tiers
  subscriptionTiers: {
    free: {
      name: 'Free',
      price: 0,
      currency: 'USD',
      students: 5,
      features: ['studentManagement', 'attendanceTracking', 'basicReports'],
      description: 'Perfect for individual tutors getting started',
    },
    professional: {
      name: 'Professional',
      price: 29,
      currency: 'USD',
      students: 50,
      features: ['studentManagement', 'attendanceTracking', 'basicBilling', 'basicReports', 'multiCurrency'],
      description: 'Ideal for growing tutoring businesses',
    },
    business: {
      name: 'Business',
      price: 79,
      currency: 'USD',
      students: 200,
      features: ['studentManagement', 'attendanceTracking', 'basicBilling', 'basicReports', 'multiCurrency', 'advancedAnalytics', 'exportFeatures'],
      description: 'Perfect for established tutoring centers',
    },
    enterprise: {
      name: 'Enterprise',
      price: 199,
      currency: 'USD',
      students: -1, // Unlimited
      features: ['all'],
      description: 'Complete solution for large organizations',
    },
  },
  
  // Marketing Content
  marketing: {
    heroTitle: 'Transform Your Tutoring Business',
    heroSubtitle: 'Comprehensive management platform designed for modern tutoring professionals',
    
    features: [
      {
        title: 'Student Management',
        description: 'Complete student profiles with academic tracking and progress monitoring',
        icon: 'people',
      },
      {
        title: 'Smart Billing',
        description: 'Multi-currency billing with automatic credit management and payment tracking',
        icon: 'payment',
      },
      {
        title: 'Advanced Analytics',
        description: 'Comprehensive business intelligence with revenue and performance insights',
        icon: 'analytics',
      },
      {
        title: 'Mobile Optimized',
        description: 'Fully responsive design optimized for mobile devices and tablets',
        icon: 'mobile',
      },
    ],
    
    testimonials: [
      {
        name: 'Sarah Johnson',
        role: 'Independent Tutor',
        content: 'My Tutor Flow has completely transformed how I manage my tutoring business. The billing system alone saves me hours every week.',
        rating: 5,
      },
      {
        name: 'Michael Chen',
        role: 'Learning Center Owner',
        content: 'The analytics features help me understand my business better and make data-driven decisions. Highly recommended!',
        rating: 5,
      },
    ],
  },
  
  // Legal Information
  legal: {
    termsOfService: '/legal/terms',
    privacyPolicy: '/legal/privacy',
    cookiePolicy: '/legal/cookies',
    refundPolicy: '/legal/refunds',
    
    copyright: `© ${new Date().getFullYear()} My Tutor Flow. All rights reserved.`,
    
    compliance: {
      gdpr: true,
      ccpa: true,
      coppa: true,
      ferpa: true,
    },
  },
  
  // Social Media Links
  social: {
    website: 'https://mytutorflow.com',
    blog: 'https://blog.mytutorflow.com',
    twitter: 'https://twitter.com/mytutorflow',
    facebook: 'https://facebook.com/mytutorflow',
    linkedin: 'https://linkedin.com/company/mytutorflow',
    youtube: 'https://youtube.com/mytutorflow',
  },
  
  // Contact Information
  contact: {
    support: {
      email: 'support@mytutorflow.com',
      phone: '+1-800-MTF-HELP',
      hours: 'Monday-Friday, 9AM-6PM EST',
    },
    sales: {
      email: 'sales@mytutorflow.com',
      phone: '+1-800-MTF-SALES',
      hours: 'Monday-Friday, 8AM-8PM EST',
    },
    address: {
      street: '123 Education Street',
      city: 'Tech City',
      state: 'CA',
      zip: '90210',
      country: 'USA',
    },
  },
  
  // Integration Settings
  integrations: {
    analytics: {
      googleAnalytics: process.env.VITE_GOOGLE_ANALYTICS_ID,
      mixpanel: process.env.VITE_MIXPANEL_TOKEN,
    },
    payments: {
      stripe: process.env.VITE_STRIPE_PUBLISHABLE_KEY,
      paypal: process.env.VITE_PAYPAL_CLIENT_ID,
    },
    communication: {
      emailjs: {
        serviceId: process.env.VITE_EMAILJS_SERVICE_ID,
        templateId: process.env.VITE_EMAILJS_TEMPLATE_ID,
        publicKey: process.env.VITE_EMAILJS_PUBLIC_KEY,
      },
    },
    monitoring: {
      sentry: process.env.VITE_SENTRY_DSN,
    },
  },
  
  // SEO Configuration
  seo: {
    title: 'My Tutor Flow - Professional Tutoring Management Platform',
    description: 'Streamline your tutoring business with comprehensive student management, billing, and analytics. Perfect for individual tutors and tutoring centers.',
    keywords: 'tutoring management, education platform, student management, billing system, tutoring software, commercial platform',
    ogImage: '/assets/mtf-social-preview.png',
    twitterCard: 'summary_large_image',
  },
};

// Export individual configurations for easy access
export const {
  appName,
  appDescription,
  colors,
  features,
  subscriptionTiers,
  marketing,
  legal,
  social,
  contact,
} = COMMERCIAL_BRANDING;

export default COMMERCIAL_BRANDING;
