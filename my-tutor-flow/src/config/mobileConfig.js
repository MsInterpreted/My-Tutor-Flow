// TD Learning Academy - Latest Android Compatibility (Android 15 & Beyond - July 2025)
// Optimized for cutting-edge Android devices with advanced features

export const MOBILE_CONFIG = {
  // Android Version Compatibility
  androidVersions: {
    minimum: 8.0,      // API Level 26 (minimum support)
    recommended: 13.0, // API Level 33 (recommended)
    latest: 15.0,      // API Level 35 (latest features)
    target: 15.0,      // Target latest for best experience
  },

  // Advanced Screen Breakpoints for Latest Android Devices
  breakpoints: {
    mobile: {
      compact: '320px',     // Older/budget Android devices
      small: '360px',       // Galaxy S series base
      medium: '390px',      // Standard flagship size
      large: '428px',       // Large flagship phones
      xlarge: '480px',      // Foldable phones unfolded
      ultrawide: '540px',   // Ultra-wide aspect ratio phones
    },
    foldable: {
      folded: '360px',      // Foldable in folded state
      unfolded: '768px',    // Foldable in unfolded state
      bookMode: '1024px',   // Book mode for large foldables
    },
    tablet: {
      small: '768px',       // 7-8 inch tablets
      medium: '1024px',     // 10-11 inch tablets
      large: '1366px',      // 12+ inch tablets
    },
  },

  // Touch Target Sizes (Android Material Design 3.0)
  touchTargets: {
    minimum: '48px',     // Minimum touch target
    comfortable: '56px', // Comfortable touch target
    large: '64px',       // Large touch target for primary actions
  },

  // Viewport Configuration
  viewport: {
    width: 'device-width',
    initialScale: 1.0,
    maximumScale: 5.0,
    userScalable: 'yes',
    viewportFit: 'cover', // For notched displays
  },

  // Performance Optimizations
  performance: {
    // Lazy loading thresholds
    lazyLoadThreshold: '50px',
    
    // Animation preferences
    reducedMotion: false, // Premium phones can handle animations
    
    // Image optimization
    imageFormats: ['webp', 'avif', 'jpg'], // Modern format support
    
    // Caching strategies
    cacheStrategy: 'stale-while-revalidate',
  },

  // Latest Android Features (Android 15 & Beyond)
  android: {
    // Android 15 Specific Features
    android15: {
      // Enhanced Privacy Controls
      privacyDashboard: true,
      permissionManager: true,
      dataAccess: 'minimal',

      // Performance Optimizations
      thermalThrottling: true,
      batteryOptimization: true,
      memoryManagement: 'aggressive',

      // UI Enhancements
      materialYou: true,
      dynamicColors: true,
      monet: true, // Material You color system
    },

    // Chrome Custom Tabs (Latest Version)
    customTabs: {
      enabled: true,
      version: 'latest',
      features: ['partial-custom-tabs', 'engagement-signals', 'activity-resize'],
    },

    // Advanced Web App Manifest
    manifest: {
      name: 'TD Learning Academy',
      shortName: 'TDLA',
      description: 'Professional Tutoring Management System',
      startUrl: '/',
      display: 'standalone',
      displayOverride: ['window-controls-overlay', 'minimal-ui'],
      orientation: 'portrait-primary',
      themeColor: '#00796B',
      backgroundColor: '#FFFFFF',
      categories: ['education', 'productivity', 'business'],

      // Android 15 Manifest Features
      launchHandler: {
        clientMode: 'navigate-existing'
      },
      fileHandlers: [
        {
          action: '/handle-files',
          accept: {
            'application/pdf': ['.pdf'],
            'image/*': ['.jpg', '.jpeg', '.png', '.webp']
          }
        }
      ],
      protocolHandlers: [
        {
          protocol: 'web+tdla',
          url: '/handle-protocol?url=%s'
        }
      ],
    },

    // Enhanced PWA Features
    pwa: {
      installable: true,
      offlineSupport: true,
      pushNotifications: true,
      backgroundSync: true,

      // Android 15 PWA Features
      webShare: true,
      webShareTarget: true,
      badging: true,
      shortcuts: true,
      windowControlsOverlay: true,
    },

    // Advanced Gesture Navigation
    gestures: {
      swipeNavigation: true,
      pullToRefresh: false, // Disabled to prevent logout
      longPress: true,

      // Android 15 Gesture Features
      edgeSwipe: true,
      predictiveBack: true,
      gestureNavigation: true,
      systemGestures: true,
    },

    // Foldable Device Support
    foldable: {
      enabled: true,
      continuity: true,
      multiWindow: true,
      flexMode: true,
      hinge: {
        detection: true,
        avoidance: true,
      },
    },
  },

  // UI Adaptations
  ui: {
    // Navigation
    navigation: {
      type: 'bottom-tabs', // Better for one-handed use
      height: '72px',
      safeArea: true,
    },

    // Cards and Lists
    cards: {
      borderRadius: '16px', // Modern rounded corners
      elevation: '2dp',     // Material Design elevation
      padding: '16px',
    },

    // Forms
    forms: {
      inputHeight: '56px',
      borderRadius: '12px',
      focusRingWidth: '2px',
    },

    // Typography Scale for Mobile
    typography: {
      scale: 1.1, // Slightly larger for mobile readability
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
  },

  // Accessibility (Android TalkBack Support)
  accessibility: {
    minContrastRatio: 4.5,
    focusIndicators: true,
    semanticMarkup: true,
    screenReaderOptimized: true,
    
    // Android TalkBack specific
    talkback: {
      announcements: true,
      customActions: true,
      roleDescriptions: true,
    },
  },

  // Battery and Performance
  battery: {
    // Reduce animations on low battery
    adaptiveAnimations: true,
    
    // Background processing limits
    backgroundLimits: true,
    
    // Network-aware loading
    networkAdaptive: true,
  },

  // Advanced Security Features (Android 15)
  security: {
    // Enhanced Biometric Authentication
    biometric: {
      fingerprint: true,
      faceUnlock: true,
      voiceUnlock: false,

      // Android 15 Biometric Features
      biometricPrompt: {
        version: 'latest',
        fallback: 'device-credential',
        negativeButton: 'Cancel',
        subtitle: 'Authenticate to access TD Learning Academy',
      },

      // Advanced Biometric Options
      strongBiometrics: true,
      weakBiometrics: false,
      deviceCredential: true,
    },

    // Enhanced Security
    secureStorage: {
      enabled: true,
      encryption: 'AES-256',
      keystore: 'android-keystore',
      biometricProtected: true,
    },

    // Network Security
    network: {
      certificatePinning: true,
      tlsVersion: '1.3',
      hsts: true,
      certificateTransparency: true,
    },

    // Android 15 Security Features
    privacy: {
      permissionManager: true,
      dataAccess: 'minimal',
      locationAccuracy: 'coarse',
      backgroundAccess: 'restricted',
    },
  },

  // Notification Configuration
  notifications: {
    // Android notification channels
    channels: {
      reminders: {
        name: 'Session Reminders',
        importance: 'high',
        sound: true,
        vibration: true,
      },
      updates: {
        name: 'App Updates',
        importance: 'low',
        sound: false,
        vibration: false,
      },
      billing: {
        name: 'Billing Notifications',
        importance: 'default',
        sound: true,
        vibration: false,
      },
    },
  },

  // Camera and Media
  media: {
    // Camera permissions for document scanning
    camera: {
      enabled: true,
      quality: 'high',
      formats: ['jpg', 'png', 'pdf'],
    },
    
    // File upload optimization
    upload: {
      maxSize: '10MB',
      compression: true,
      progressIndicator: true,
    },
  },

  // Offline Support
  offline: {
    enabled: true,
    cacheSize: '50MB',
    syncStrategy: 'background',
    
    // Critical data to cache
    criticalData: [
      'students',
      'attendance',
      'recent-marks',
      'user-profile',
    ],
  },

  // Analytics and Monitoring
  monitoring: {
    // Performance monitoring
    performance: true,
    
    // Error tracking
    errorTracking: true,
    
    // User behavior (privacy-compliant)
    userBehavior: false, // Disabled for privacy
    
    // Network monitoring
    networkMonitoring: true,
  },
};

// Demo Data Configuration for Mobile
export const DEMO_CONFIG = {
  ENABLE_DEMO_DATA: true, // Enable rich demo data for mobile
  FORCE_MOBILE_MODE: true, // Force mobile mode for demonstrations
  DEMO_STUDENT_COUNT: 6,
  DEMO_SESSIONS_PER_DAY: 3,
  DEMO_ATTENDANCE_RATE: 91,
  DEMO_MONTHLY_REVENUE: 18750,
  DEMO_CURRENCY: 'ZAR',
};

// Mobile Detection Utilities
export const isMobile = () => {
  // Force mobile mode for demo if enabled
  if (DEMO_CONFIG.FORCE_MOBILE_MODE) {
    return true;
  }
  return window.innerWidth <= 768;
};

// Check if demo data should be used
export const shouldUseDemoData = () => {
  return isMobile() && DEMO_CONFIG.ENABLE_DEMO_DATA;
};

export const isAndroid = () => {
  return /Android/i.test(navigator.userAgent);
};

export const isPremiumAndroid = () => {
  // Detect high-end Android devices
  const ua = navigator.userAgent;
  const premiumBrands = ['Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Huawei'];
  return isAndroid() && premiumBrands.some(brand => ua.includes(brand));
};

export const getScreenDensity = () => {
  return window.devicePixelRatio || 1;
};

export const supportsWebP = () => {
  const canvas = document.createElement('canvas');
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

// Responsive Design Helpers
export const getResponsiveValue = (mobile, tablet, desktop) => {
  const width = window.innerWidth;
  if (width <= 768) return mobile;
  if (width <= 1024) return tablet;
  return desktop;
};

export const adaptForMobile = (component) => {
  if (!isMobile()) return component;
  
  return {
    ...component,
    // Apply mobile-specific adaptations
    touchOptimized: true,
    gestureEnabled: true,
    reducedAnimations: false, // Premium phones can handle animations
  };
};

export default MOBILE_CONFIG;
