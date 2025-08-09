# 🔧 HOSTAFRICA PRODUCTION ENVIRONMENT SETUP

## **PRODUCTION ENVIRONMENT CONFIGURATION**

This guide provides comprehensive production environment setup for My Tutor Flow on HostAfrica infrastructure using the tdla.co.za domain.

---

## **1. ENVIRONMENT VARIABLES CONFIGURATION**

### **1.1 Create Production Environment File**

```bash
# Create HostAfrica-specific production environment
touch .env.production

# Copy template and customize
cp .env.production.example .env.production
```

### **1.2 Complete Production Environment Variables**

```env
# =============================================================================
# HOSTAFRICA PRODUCTION ENVIRONMENT - TDLA.CO.ZA
# =============================================================================

# Firebase Production Configuration
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
VITE_API_URL=https://tdla.co.za/api

# Business Information
VITE_BUSINESS_NAME=TD Learning Academy
VITE_BUSINESS_EMAIL=admin@tdla.co.za
VITE_BUSINESS_PHONE=+27-xxx-xxx-xxxx
VITE_BUSINESS_ADDRESS=Your Business Address, Cape Town, South Africa
VITE_BUSINESS_WEBSITE=https://tdla.co.za
VITE_BUSINESS_LOGO_URL=https://tdla.co.za/assets/images/tdla-logo.png

# HostAfrica Hosting Configuration
VITE_HOSTING_PROVIDER=hostafrica
VITE_SERVER_LOCATION=south_africa
VITE_CDN_ENABLED=true
VITE_LOCAL_HOSTING=true
VITE_TIMEZONE=Africa/Johannesburg
VITE_LOCALE=en-ZA

# Security Configuration
VITE_FORCE_HTTPS=true
VITE_SECURE_COOKIES=true
VITE_ENABLE_SECURITY_HEADERS=true
VITE_ENABLE_CSRF_PROTECTION=true
VITE_SESSION_TIMEOUT=3600
VITE_ENABLE_2FA=false

# Performance Configuration
VITE_ENABLE_COMPRESSION=true
VITE_ENABLE_CACHING=true
VITE_CACHE_DURATION=86400
VITE_ENABLE_SERVICE_WORKER=true
VITE_PRELOAD_CRITICAL_RESOURCES=true
VITE_LAZY_LOAD_IMAGES=true

# Analytics and Monitoring
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CRASHLYTICS=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
VITE_HOTJAR_ID=XXXXXXX

# Feature Flags
VITE_FORCE_MOCK_DATA=false
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_ANIMATIONS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_PWA=true
VITE_ENABLE_BETA_FEATURES=false

# South African Specific Features
VITE_ENABLE_WHATSAPP_INTEGRATION=true
VITE_ENABLE_SA_PAYMENT_METHODS=true
VITE_SA_SCHOOL_TERMS=true
VITE_POPI_COMPLIANCE=true
VITE_SA_CURRICULUM_SUPPORT=true

# API Configuration
VITE_API_TIMEOUT=30000
VITE_MAX_RETRY_ATTEMPTS=3
VITE_ENABLE_API_CACHING=true
VITE_API_RATE_LIMIT=100

# File Upload Configuration
VITE_MAX_FILE_SIZE_MB=10
VITE_ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,csv,xlsx
VITE_UPLOAD_ENDPOINT=https://tdla.co.za/api/upload
VITE_STORAGE_PROVIDER=firebase

# Email Configuration (HostAfrica Email)
VITE_SMTP_HOST=mail.tdla.co.za
VITE_SMTP_PORT=587
VITE_SMTP_SECURE=true
VITE_FROM_EMAIL=noreply@tdla.co.za
VITE_SUPPORT_EMAIL=support@tdla.co.za
VITE_ADMIN_EMAIL=admin@tdla.co.za

# Payment Configuration (South African)
VITE_PAYMENT_PROVIDER=payfast
VITE_PAYFAST_MERCHANT_ID=your_merchant_id
VITE_PAYFAST_MERCHANT_KEY=your_merchant_key
VITE_ENABLE_EFT_PAYMENTS=true
VITE_ENABLE_SNAPSCAN=true
VITE_CURRENCY=ZAR

# WhatsApp Business Integration
VITE_WHATSAPP_BUSINESS_ACCOUNT_ID=your_whatsapp_business_id
VITE_WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_id
VITE_WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
VITE_WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token

# Backup Configuration
VITE_BACKUP_ENABLED=true
VITE_BACKUP_FREQUENCY=daily
VITE_BACKUP_RETENTION_DAYS=30
VITE_BACKUP_STORAGE=firebase

# Legal and Compliance
VITE_PRIVACY_POLICY_URL=https://tdla.co.za/privacy
VITE_TERMS_OF_SERVICE_URL=https://tdla.co.za/terms
VITE_COOKIE_POLICY_URL=https://tdla.co.za/cookies
VITE_GDPR_COMPLIANCE=false
VITE_POPI_COMPLIANCE=true
VITE_DATA_RETENTION_YEARS=7

# Support Configuration
VITE_SUPPORT_PHONE=+27-xxx-xxx-xxxx
VITE_SUPPORT_HOURS=Monday-Friday 8AM-5PM SAST
VITE_EMERGENCY_CONTACT=emergency@tdla.co.za
VITE_SUPPORT_WHATSAPP=+27-xxx-xxx-xxxx

# Development and Debugging (Production = false)
VITE_ENABLE_DEBUG_MODE=false
VITE_ENABLE_CONSOLE_LOGS=false
VITE_ENABLE_REDUX_DEVTOOLS=false
VITE_LOG_LEVEL=error

# HostAfrica Specific Optimizations
VITE_HOSTAFRICA_CDN_URL=https://cdn.hostafrica.co.za
VITE_ENABLE_HOSTAFRICA_CDN=true
VITE_HOSTAFRICA_REGION=cape-town
VITE_ENABLE_LOCAL_CACHING=true
```

---

## **2. FIREBASE PRODUCTION PROJECT SETUP**

### **2.1 Create Firebase Production Project**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Create production project
firebase projects:create tdla-co-za-prod --display-name "TD Learning Academy Production"

# Initialize Firebase in your project
firebase init

# Select services:
# - Firestore
# - Authentication
# - Storage
# - Hosting (optional)
# - Functions (if needed)
```

### **2.2 Configure Firebase for tdla.co.za**

```javascript
// firebase.json - Production configuration
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  },
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  }
}
```

### **2.3 Production Security Rules**

```javascript
// firestore.rules - Production security
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    function isTutor() {
      return isAuthenticated() &&
             exists(/databases/$(database)/documents/tutors/$(request.auth.uid));
    }

    function isAdmin() {
      return isAuthenticated() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Production data access rules
    match /users/{userId} {
      allow read, write: if isAuthenticated() && isOwner(userId);
      allow create: if isAuthenticated() && isOwner(userId);
    }

    match /tutors/{tutorId} {
      allow read, write: if isAuthenticated() && isOwner(tutorId);
      allow create: if isAuthenticated() && isOwner(tutorId);
    }

    match /students/{studentId} {
      allow read, write: if isTutor();
      allow create: if isTutor();
      allow delete: if isTutor() || isAdmin();
    }

    match /attendance/{attendanceId} {
      allow read, write: if isTutor();
      allow create: if isTutor();
      allow delete: if isTutor() || isAdmin();
    }

    match /billing/{billingId} {
      allow read, write: if isTutor();
      allow create: if isTutor();
      allow delete: if isTutor() || isAdmin();
    }

    match /reports/{reportId} {
      allow read, write: if isTutor();
      allow create: if isTutor();
      allow delete: if isTutor() || isAdmin();
    }

    // Audit logs - read-only for tutors
    match /auditLogs/{logId} {
      allow read: if isTutor() || isAdmin();
      allow write: if false; // Only system can write
    }

    // System settings - admin only
    match /settings/{settingId} {
      allow read: if isTutor();
      allow write: if isAdmin();
    }
  }
}
```

---

## **3. HOSTAFRICA DIRECTADMIN CONFIGURATION**

### **3.1 DirectAdmin Email Setup**

```
Email Accounts to Create:
├── admin@tdla.co.za (Primary admin account)
├── support@tdla.co.za (Customer support)
├── noreply@tdla.co.za (System notifications)
├── billing@tdla.co.za (Invoice and payment notifications)
└── backup@tdla.co.za (Backup notifications)

Email Configuration:
├── IMAP/POP3: Enabled
├── SMTP: Enabled (Port 587, STARTTLS)
├── Webmail: RoundCube enabled
├── Spam Protection: SpamAssassin enabled
└── Autoresponders: Set up for support
```

### **3.2 Database Configuration**

```sql
-- Create production databases via DirectAdmin
-- MySQL Management → Create Database

Database Names:
├── tdla_co_za_main (Primary application data)
├── tdla_co_za_cache (Caching layer)
├── tdla_co_za_logs (Application logs)
└── tdla_co_za_backup (Backup metadata)

Database Users:
├── tdla_main_user (Full access to main DB)
├── tdla_cache_user (Cache DB access)
├── tdla_logs_user (Logs DB access)
└── tdla_backup_user (Backup DB access)

-- Grant appropriate privileges for each user
GRANT ALL PRIVILEGES ON tdla_co_za_main.* TO 'tdla_main_user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON tdla_co_za_cache.* TO 'tdla_cache_user'@'localhost';
GRANT INSERT, SELECT ON tdla_co_za_logs.* TO 'tdla_logs_user'@'localhost';
GRANT SELECT ON tdla_co_za_backup.* TO 'tdla_backup_user'@'localhost';
FLUSH PRIVILEGES;
```

### **3.3 Cron Jobs Setup**

```bash
# DirectAdmin → Cron Jobs
# Set up automated tasks

# Daily backup (2 AM SAST)
0 2 * * * /usr/bin/php /home/username/domains/tdla.co.za/public_html/scripts/backup.php

# Weekly database optimization (Sunday 3 AM)
0 3 * * 0 /usr/bin/mysql -u root -p -e "OPTIMIZE TABLE tdla_co_za_main.*;"

# Monthly log cleanup (1st of month, 4 AM)
0 4 1 * * /usr/bin/find /home/username/domains/tdla.co.za/logs -name "*.log" -mtime +30 -delete

# Daily health check (Every hour during business hours)
0 8-17 * * 1-5 /usr/bin/curl -f https://tdla.co.za/health || echo "Site down" | mail -s "TDLA Site Alert" admin@tdla.co.za
```

---

## **4. SECURITY CONFIGURATION**

### **4.1 SSL Certificate Management**

```bash
# DirectAdmin SSL Certificate Setup
# Navigate to: SSL Certificates → Let's Encrypt

Domains to Include:
├── tdla.co.za
├── www.tdla.co.za
├── mail.tdla.co.za
└── ftp.tdla.co.za

Auto-Renewal: Enabled
Certificate Type: Let's Encrypt (Free)
Key Size: 2048 bits
Renewal Period: 60 days before expiry
```

### **4.2 Security Headers Configuration**

```apache
# .htaccess security headers (already included in main config)
<IfModule mod_headers.c>
    # HSTS
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

    # XSS Protection
    Header always set X-XSS-Protection "1; mode=block"

    # Content Type Options
    Header always set X-Content-Type-Options "nosniff"

    # Frame Options
    Header always set X-Frame-Options "DENY"

    # Referrer Policy
    Header always set Referrer-Policy "strict-origin-when-cross-origin"

    # Content Security Policy
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.firebaseapp.com https://*.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.firebaseapp.com https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com;"
</IfModule>
```

### **4.3 File Permissions**

```bash
# Set correct file permissions for HostAfrica
find /home/username/domains/tdla.co.za/public_html -type f -exec chmod 644 {} \;
find /home/username/domains/tdla.co.za/public_html -type d -exec chmod 755 {} \;

# Secure sensitive files
chmod 600 /home/username/domains/tdla.co.za/public_html/.env*
chmod 644 /home/username/domains/tdla.co.za/public_html/.htaccess

# Secure upload directories
chmod 755 /home/username/domains/tdla.co.za/public_html/uploads
chmod 644 /home/username/domains/tdla.co.za/public_html/uploads/*
```

---

## **5. MONITORING AND LOGGING**

### **5.1 Application Monitoring**

```javascript
// src/utils/monitoring.js
class ProductionMonitoring {
  constructor() {
    this.environment = import.meta.env.VITE_ENVIRONMENT;
    this.domain = import.meta.env.VITE_DOMAIN;
  }

  // Error tracking
  logError(error, context = {}) {
    if (this.environment === 'production') {
      console.error('Production Error:', {
        error: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        domain: this.domain,
        userAgent: navigator.userAgent,
      });

      // Send to Firebase Analytics
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: error.message,
          fatal: false,
        });
      }
    }
  }

  // Performance tracking
  trackPerformance(metric, value) {
    if (this.environment === 'production') {
      console.log(`Performance Metric - ${metric}:`, value);

      if (window.gtag) {
        window.gtag('event', 'timing_complete', {
          name: metric,
          value: Math.round(value),
        });
      }
    }
  }

  // User action tracking
  trackUserAction(action, properties = {}) {
    if (this.environment === 'production') {
      if (window.gtag) {
        window.gtag('event', action, {
          ...properties,
          domain: this.domain,
        });
      }
    }
  }
}

export const monitoring = new ProductionMonitoring();
```

### **5.2 Health Check Endpoint**

```javascript
// public/health.json - Simple health check
{
  "status": "healthy",
  "timestamp": "2025-01-03T10:00:00Z",
  "version": "1.0.0",
  "environment": "production",
  "domain": "tdla.co.za",
  "hosting": "hostafrica",
  "services": {
    "frontend": "operational",
    "firebase": "operational",
    "ssl": "valid"
  }
}
```

This production environment configuration ensures optimal performance, security, and monitoring for your TD Learning Academy deployment on HostAfrica infrastructure.
