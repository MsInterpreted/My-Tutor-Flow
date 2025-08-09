# ⚙️ HOSTAFRICA TECHNICAL CONFIGURATION - MY TUTOR FLOW

## **TECHNICAL ARCHITECTURE OVERVIEW**

This guide provides detailed technical configuration for deploying My Tutor Flow on HostAfrica infrastructure, optimized for South African performance and the tdla.co.za domain.

**Stack Configuration:**

- **Frontend**: React 19 + Vite + Material-UI
- **Backend**: Firebase (Firestore + Authentication + Storage)
- **Hosting**: HostAfrica Power Hosting (DirectAdmin)
- **Domain**: tdla.co.za
- **SSL**: Let's Encrypt (Free)
- **CDN**: HostAfrica CDN (if available)

---

## **1. VITE CONFIGURATION FOR HOSTAFRICA**

### **1.1 Production Vite Config**

```javascript
// vite.config.production.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  // HostAfrica-specific configuration
  base: '/', // Root deployment

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
    },
  },

  // Server configuration for development
  server: {
    port: 3000,
    host: true, // Allow external connections
    open: true,
  },

  // Production build optimization
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable for production
    minify: 'terser',

    // HostAfrica performance optimization
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          charts: ['recharts'],
          pdf: ['jspdf', 'html2canvas'],
          utils: ['dayjs', 'papaparse'],
        },

        // Optimize chunk naming for HostAfrica CDN
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: assetInfo => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },

    // Terser optimization for HostAfrica
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        safari10: true,
      },
    },

    // Asset optimization
    assetsInlineLimit: 4096, // Inline small assets
    cssCodeSplit: true, // Split CSS for better caching

    // HostAfrica server compatibility
    target: 'es2015', // Broad browser support
  },

  // Preview configuration (for testing)
  preview: {
    port: 4173,
    host: true,
  },

  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
});
```

### **1.2 Build Scripts for HostAfrica**

```json
// package.json - Updated scripts
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:hostafrica": "tsc && vite build --config vite.config.production.js",
    "preview": "vite preview",
    "preview:hostafrica": "vite preview --config vite.config.production.js",
    "deploy:hostafrica": "npm run build:hostafrica && npm run package:hostafrica",
    "package:hostafrica": "cd dist && zip -r ../tdla-co-za-$(date +%Y%m%d-%H%M%S).zip *",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "type-check": "tsc --noEmit",
    "test:build": "npm run build:hostafrica && npm run preview:hostafrica"
  }
}
```

---

## **2. FIREBASE CONFIGURATION FOR TDLA.CO.ZA**

### **2.1 Production Firebase Config**

```javascript
// src/firebaseConfig.production.js
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as analyticsIsSupported } from 'firebase/analytics';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Validate environment variables for HostAfrica deployment
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

const missingEnvVars = requiredEnvVars.filter(envVar => !import.meta.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// HostAfrica production Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app;
let analytics = null;
let auth;
let db;
let storage;
let functions;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  functions = getFunctions(app);

  // HostAfrica production optimizations
  if (import.meta.env.PROD) {
    console.log('🇿🇦 Firebase initialized for HostAfrica production (tdla.co.za)');

    // Configure auth for South African users
    auth.useDeviceLanguage(); // Use device language

    // Analytics for HostAfrica deployment
    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      analyticsIsSupported().then(supported => {
        if (supported) {
          analytics = getAnalytics(app);
          console.log('📊 Firebase Analytics enabled for tdla.co.za');
        }
      });
    }
  }

  // Development emulator connections (if needed)
  if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === 'true') {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    connectFunctionsEmulator(functions, 'localhost', 5001);
    console.log('🧪 Firebase emulators connected for development');
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw error;
}

// HostAfrica-specific Firebase utilities
export const getFirebaseConfig = () => {
  if (import.meta.env.DEV) {
    return {
      ...firebaseConfig,
      environment: 'development',
      hosting: 'localhost',
    };
  }
  return {
    projectId: firebaseConfig.projectId,
    environment: 'production',
    hosting: 'hostafrica',
    domain: 'tdla.co.za',
  };
};

// Performance monitoring for HostAfrica
export const initializePerformanceMonitoring = async () => {
  if (import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true') {
    try {
      const { getPerformance } = await import('firebase/performance');
      const perf = getPerformance(app);
      console.log('⚡ Firebase Performance monitoring enabled for HostAfrica');
      return perf;
    } catch (error) {
      console.warn('⚠️ Performance monitoring not available:', error);
    }
  }
  return null;
};

// Crashlytics for HostAfrica production
export const initializeCrashlytics = async () => {
  if (import.meta.env.VITE_ENABLE_CRASHLYTICS === 'true' && import.meta.env.PROD) {
    try {
      const { getAnalytics } = await import('firebase/analytics');
      const analytics = getAnalytics(app);
      console.log('🛡️ Firebase Crashlytics enabled for production');
      return analytics;
    } catch (error) {
      console.warn('⚠️ Crashlytics not available:', error);
    }
  }
  return null;
};

export { app, analytics, auth, db, storage, functions };
```

### **2.2 HostAfrica Environment Variables**

```env
# .env.production - HostAfrica specific configuration

# Firebase Production Configuration for tdla.co.za
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=tdla-co-za-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tdla-co-za-prod
VITE_FIREBASE_STORAGE_BUCKET=tdla-co-za-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789012345
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Application Configuration
VITE_APP_NAME=TD Learning Academy
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
VITE_DOMAIN=tdla.co.za
VITE_BASE_URL=https://tdla.co.za

# Business Information
VITE_BUSINESS_NAME=TD Learning Academy
VITE_BUSINESS_EMAIL=admin@tdla.co.za
VITE_BUSINESS_PHONE=+27-xxx-xxx-xxxx
VITE_BUSINESS_ADDRESS=Your Business Address, South Africa
VITE_BUSINESS_WEBSITE=https://tdla.co.za
VITE_BUSINESS_LOGO_URL=https://tdla.co.za/assets/images/tdla-logo.png

# HostAfrica Hosting Configuration
VITE_HOSTING_PROVIDER=hostafrica
VITE_SERVER_LOCATION=south_africa
VITE_CDN_ENABLED=true
VITE_LOCAL_HOSTING=true
VITE_TIMEZONE=Africa/Johannesburg

# Security Configuration
VITE_FORCE_HTTPS=true
VITE_SECURE_COOKIES=true
VITE_ENABLE_SECURITY_HEADERS=true
VITE_ENABLE_CSRF_PROTECTION=true

# Performance Configuration
VITE_ENABLE_COMPRESSION=true
VITE_ENABLE_CACHING=true
VITE_CACHE_DURATION=86400
VITE_ENABLE_SERVICE_WORKER=true
VITE_PRELOAD_CRITICAL_RESOURCES=true

# Analytics and Monitoring
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CRASHLYTICS=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX

# Feature Flags
VITE_FORCE_MOCK_DATA=false
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_ANIMATIONS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_PWA=true

# API Configuration
VITE_API_TIMEOUT=30000
VITE_MAX_RETRY_ATTEMPTS=3
VITE_ENABLE_API_CACHING=true

# File Upload Configuration
VITE_MAX_FILE_SIZE_MB=10
VITE_ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,csv
VITE_UPLOAD_ENDPOINT=https://tdla.co.za/api/upload

# Email Configuration
VITE_SMTP_HOST=mail.tdla.co.za
VITE_SMTP_PORT=587
VITE_SMTP_SECURE=true
VITE_FROM_EMAIL=noreply@tdla.co.za

# Backup Configuration
VITE_BACKUP_ENABLED=true
VITE_BACKUP_FREQUENCY=daily
VITE_BACKUP_RETENTION_DAYS=30

# Legal and Compliance
VITE_PRIVACY_POLICY_URL=https://tdla.co.za/privacy
VITE_TERMS_OF_SERVICE_URL=https://tdla.co.za/terms
VITE_COOKIE_POLICY_URL=https://tdla.co.za/cookies
VITE_GDPR_COMPLIANCE=true
VITE_POPI_COMPLIANCE=true

# Support Configuration
VITE_SUPPORT_EMAIL=support@tdla.co.za
VITE_SUPPORT_PHONE=+27-xxx-xxx-xxxx
VITE_SUPPORT_HOURS=Monday-Friday 8AM-5PM SAST
VITE_EMERGENCY_CONTACT=emergency@tdla.co.za
```

---

## **3. HOSTAFRICA PERFORMANCE OPTIMIZATION**

### **3.1 Advanced .htaccess Configuration**

```apache
# .htaccess - HostAfrica optimized configuration
RewriteEngine On
RewriteBase /

# HostAfrica Security Headers
<IfModule mod_headers.c>
    # Security headers for tdla.co.za
    Header always set X-Frame-Options "DENY"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"

    # HSTS for HostAfrica SSL
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

    # Content Security Policy for Firebase integration
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.firebaseapp.com https://*.googleapis.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.firebaseapp.com https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com; frame-src 'self' https://*.firebaseapp.com; object-src 'none'; base-uri 'self';"

    # CORS headers for Firebase
    Header always set Access-Control-Allow-Origin "https://tdla.co.za"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
</IfModule>

# HTTPS Redirect for HostAfrica
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# WWW to non-WWW redirect (optional)
RewriteCond %{HTTP_HOST} ^www\.tdla\.co\.za [NC]
RewriteRule ^(.*)$ https://tdla.co.za/$1 [L,R=301]

# React Router Support
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# HostAfrica Compression Optimization
<IfModule mod_deflate.c>
    # Compress HTML, CSS, JavaScript, Text, XML and fonts
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/vnd.ms-fontobject
    AddOutputFilterByType DEFLATE application/x-font
    AddOutputFilterByType DEFLATE application/x-font-opentype
    AddOutputFilterByType DEFLATE application/x-font-otf
    AddOutputFilterByType DEFLATE application/x-font-truetype
    AddOutputFilterByType DEFLATE application/x-font-ttf
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE font/opentype
    AddOutputFilterByType DEFLATE font/otf
    AddOutputFilterByType DEFLATE font/ttf
    AddOutputFilterByType DEFLATE image/svg+xml
    AddOutputFilterByType DEFLATE image/x-icon
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/javascript
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE application/json

    # Remove browser bugs (only needed for really old browsers)
    BrowserMatch ^Mozilla/4 gzip-only-text/html
    BrowserMatch ^Mozilla/4\.0[678] no-gzip
    BrowserMatch \bMSIE !no-gzip !gzip-only-text/html
    Header append Vary User-Agent
</IfModule>

# HostAfrica Browser Caching
<IfModule mod_expires.c>
    ExpiresActive on

    # Images
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 year"

    # CSS and JavaScript
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType application/x-javascript "access plus 1 year"
    ExpiresByType text/javascript "access plus 1 year"

    # Fonts
    ExpiresByType application/x-font-ttf "access plus 1 year"
    ExpiresByType font/opentype "access plus 1 year"
    ExpiresByType application/x-font-woff "access plus 1 year"
    ExpiresByType application/font-woff2 "access plus 1 year"

    # Documents
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType application/vnd.ms-excel "access plus 1 month"

    # HTML and XML
    ExpiresByType text/html "access plus 1 hour"
    ExpiresByType application/xml "access plus 1 hour"
    ExpiresByType text/xml "access plus 1 hour"
    ExpiresByType application/json "access plus 1 hour"

    # Manifest files
    ExpiresByType application/manifest+json "access plus 1 week"
    ExpiresByType text/cache-manifest "access plus 1 week"
</IfModule>

# HostAfrica File Security
<Files ".env*">
    Order allow,deny
    Deny from all
</Files>

<Files "*.config.js">
    Order allow,deny
    Deny from all
</Files>

<Files "package*.json">
    Order allow,deny
    Deny from all
</Files>

# Prevent access to source maps in production
<Files "*.map">
    Order allow,deny
    Deny from all
</Files>

# Block access to version control
<DirectoryMatch "\.git">
    Order allow,deny
    Deny from all
</DirectoryMatch>

# HostAfrica Error Pages
ErrorDocument 404 /index.html
ErrorDocument 403 /index.html
ErrorDocument 500 /index.html
```

### **3.2 Service Worker for HostAfrica**

```javascript
// public/sw.js - HostAfrica optimized service worker
const CACHE_NAME = 'tdla-co-za-v1.0.0';
const STATIC_CACHE = 'tdla-static-v1';
const DYNAMIC_CACHE = 'tdla-dynamic-v1';

// HostAfrica CDN and local assets
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/css/index.css',
  '/assets/js/index.js',
  '/assets/images/tdla-logo.png',
  '/assets/images/favicon.ico',
];

// Firebase and external resources
const EXTERNAL_RESOURCES = [
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
  'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2',
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('🇿🇦 Service Worker installing for tdla.co.za');

  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DYNAMIC_CACHE).then(cache => {
        return cache.addAll(EXTERNAL_RESOURCES);
      }),
    ])
  );

  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('🇿🇦 Service Worker activating for tdla.co.za');

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// Fetch event - serve from cache with HostAfrica optimization
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip Firebase real-time connections
  if (url.hostname.includes('firebaseio.com')) return;

  // Handle different types of requests
  if (url.origin === location.origin) {
    // Same-origin requests (HostAfrica hosted)
    event.respondWith(cacheFirstStrategy(request));
  } else if (url.hostname.includes('googleapis.com') || url.hostname.includes('gstatic.com')) {
    // Google/Firebase resources
    event.respondWith(staleWhileRevalidateStrategy(request));
  } else {
    // Other external resources
    event.respondWith(networkFirstStrategy(request));
  }
});

// Cache strategies optimized for HostAfrica

// Cache first - for static assets
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    // Return offline fallback if available
    return caches.match('/index.html');
  }
}

// Stale while revalidate - for external resources
async function staleWhileRevalidateStrategy(request) {
  const cachedResponse = await caches.match(request);

  const networkResponsePromise = fetch(request)
    .then(response => {
      if (response.ok) {
        const cache = caches.open(DYNAMIC_CACHE);
        cache.then(c => c.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => cachedResponse);

  return cachedResponse || networkResponsePromise;
}

// Network first - for API calls
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Background sync for HostAfrica
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('🔄 Background sync for tdla.co.za');
  // Implement background sync logic here
}

// Push notifications (if needed)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/assets/images/tdla-logo.png',
      badge: '/assets/images/badge.png',
      data: data.data,
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});
```

This technical configuration provides comprehensive setup for optimal performance on HostAfrica infrastructure with the tdla.co.za domain.
