# 🇿🇦 HOSTAFRICA DEPLOYMENT GUIDE - TD LEARNING ACADEMY (tdla.co.za)

## **EXECUTIVE OVERVIEW**

This guide provides step-by-step instructions for deploying My Tutor Flow to HostAfrica hosting using your new **tdla.co.za** domain. This deployment will establish TD Learning Academy as a professional, locally-hosted South African tutoring business.

**Deployment Target**: https://tdla.co.za
**Hosting Provider**: HostAfrica Power Hosting Plan
**Control Panel**: DirectAdmin
**Timeline**: 3-4 days for complete deployment

---

## **PHASE 1: HOSTAFRICA ACCOUNT SETUP**

### **Step 1: Order HostAfrica Power Hosting**

#### **1.1 Purchase Hosting Plan**

```
Visit: https://hostafrica.co.za/web-hosting/
Select: Power Hosting (R245/month)
Domain: Use existing tdla.co.za domain
Billing: Monthly (can change to annual later for savings)
```

#### **1.2 Account Information Required**

```
Business Details:
├── Business Name: TD Learning Academy
├── Contact Person: [Your Name]
├── Email: admin@tdla.co.za
├── Phone: [Your Phone Number]
├── Address: [Your Business Address]
└── VAT Number: [If applicable]
```

#### **1.3 Payment Options**

```
Recommended Payment Methods:
├── EFT (Electronic Funds Transfer)
├── Credit/Debit Card (Visa/MasterCard)
├── PayFast (Local payment gateway)
└── SnapScan (Mobile payment)
```

### **Step 2: Domain Configuration**

#### **2.1 Point tdla.co.za to HostAfrica**

```bash
# You'll receive HostAfrica nameservers via email
# Update your domain registrar with these nameservers:

Primary Nameserver: ns1.hostafrica.co.za
Secondary Nameserver: ns2.hostafrica.co.za

# Or use A Record if keeping current nameservers:
A Record: @ → [HostAfrica IP Address]
A Record: www → [HostAfrica IP Address]
```

#### **2.2 DNS Propagation**

```
Expected Timeline:
├── Local DNS: 1-2 hours
├── ISP DNS: 4-8 hours
├── Global DNS: 24-48 hours
└── Full Propagation: 48-72 hours
```

---

## **PHASE 2: DIRECTADMIN SETUP**

### **Step 3: Access DirectAdmin Control Panel**

#### **3.1 Login Credentials**

```
You'll receive via email:
├── DirectAdmin URL: https://server.hostafrica.co.za:2222
├── Username: [your_username]
├── Password: [generated_password]
├── Domain: tdla.co.za
└── Server IP: [server_ip_address]
```

#### **3.2 Initial DirectAdmin Configuration**

```
First Login Tasks:
1. Change default password
2. Set up email forwarding
3. Configure SSL certificate
4. Create FTP accounts (if needed)
5. Set up databases
```

### **Step 4: SSL Certificate Setup**

#### **4.1 Automatic Let's Encrypt SSL**

```
DirectAdmin Path:
├── Login to DirectAdmin
├── Navigate to: SSL Certificates
├── Select: Let's Encrypt
├── Domain: tdla.co.za
├── Include: www.tdla.co.za
└── Click: Create Certificate

Expected Result: Automatic HTTPS activation
```

#### **4.2 Verify SSL Installation**

```bash
# Test SSL certificate
curl -I https://tdla.co.za

# Expected response:
HTTP/2 200
server: nginx
content-type: text/html
# SSL certificate should be valid
```

---

## **PHASE 3: APPLICATION DEPLOYMENT**

### **Step 5: Prepare Production Build**

#### **5.1 Update Environment Configuration**

```bash
# Create HostAfrica production environment
cp .env.production.example .env.production.hostafrica

# Edit .env.production.hostafrica
nano .env.production.hostafrica
```

#### **5.2 HostAfrica Production Environment Variables**

```env
# Firebase Production Configuration
VITE_FIREBASE_API_KEY=your_production_api_key
VITE_FIREBASE_AUTH_DOMAIN=tdla-co-za.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tdla-co-za-prod
VITE_FIREBASE_STORAGE_BUCKET=tdla-co-za-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Application Configuration
VITE_APP_NAME=TD Learning Academy
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
VITE_DOMAIN=tdla.co.za

# Business Information
VITE_BUSINESS_NAME=TD Learning Academy
VITE_BUSINESS_EMAIL=admin@tdla.co.za
VITE_BUSINESS_PHONE=+27-xxx-xxx-xxxx
VITE_BUSINESS_ADDRESS=Your Business Address, South Africa
VITE_BUSINESS_WEBSITE=https://tdla.co.za

# HostAfrica Specific
VITE_HOSTING_PROVIDER=hostafrica
VITE_SERVER_LOCATION=south_africa
VITE_CDN_ENABLED=true
VITE_LOCAL_HOSTING=true

# Security Configuration
VITE_FORCE_HTTPS=true
VITE_SECURE_COOKIES=true
VITE_ENABLE_SECURITY_HEADERS=true

# Performance Configuration
VITE_ENABLE_COMPRESSION=true
VITE_ENABLE_CACHING=true
VITE_CACHE_DURATION=86400
```

#### **5.3 Build Production Version**

```bash
# Install dependencies
npm install

# Build for production with HostAfrica environment
cp .env.production.hostafrica .env.production
npm run build

# Verify build
npm run preview
# Test at http://localhost:4173

# Create deployment package
cd dist
zip -r ../tdla-co-za-production.zip *
cd ..
```

### **Step 6: Upload to HostAfrica**

#### **6.1 DirectAdmin File Upload Method**

```
DirectAdmin Steps:
1. Login to DirectAdmin
2. Navigate to: File Manager
3. Go to: domains/tdla.co.za/public_html/
4. Delete default files (index.html, etc.)
5. Upload: tdla-co-za-production.zip
6. Extract: Right-click → Extract
7. Move files: Move all files from dist/ to public_html/
8. Verify: index.html is in public_html/ root
```

#### **6.2 FTP Upload Method (Alternative)**

```bash
# If you prefer FTP (credentials from HostAfrica)
ftp ftp.tdla.co.za
# Username: [your_ftp_username]
# Password: [your_ftp_password]

# Upload files
cd public_html
put tdla-co-za-production.zip
# Extract via DirectAdmin File Manager
```

### **Step 7: Configure React Router for HostAfrica**

#### **7.1 Create .htaccess File**

```apache
# Create: public_html/.htaccess
# This file handles React Router on HostAfrica

RewriteEngine On
RewriteBase /

# Security Headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

# HTTPS Redirect
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# React Router Support
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Security - Block access to sensitive files
<Files ".env*">
    Order allow,deny
    Deny from all
</Files>

<Files "*.config.js">
    Order allow,deny
    Deny from all
</Files>
```

---

## **PHASE 4: FIREBASE CONFIGURATION**

### **Step 8: Update Firebase Project**

#### **8.1 Create Production Firebase Project**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Create new project for production
firebase projects:create tdla-co-za-prod

# Initialize Firebase in your project
firebase init
```

#### **8.2 Configure Firebase for tdla.co.za**

```javascript
// Update Firebase authorized domains
// Firebase Console → Authentication → Settings → Authorized domains
// Add: tdla.co.za, www.tdla.co.za

// Update CORS settings
// Firebase Console → Storage → Rules
// Ensure CORS allows tdla.co.za domain
```

#### **8.3 Deploy Firebase Security Rules**

```bash
# Copy production rules
cp firestore.rules.production firestore.rules
cp storage.rules.production storage.rules

# Deploy to production project
firebase use tdla-co-za-prod
firebase deploy --only firestore:rules,storage:rules
```

---

## **PHASE 5: PERFORMANCE OPTIMIZATION**

### **Step 9: HostAfrica Performance Features**

#### **9.1 Enable CDN (if available)**

```
DirectAdmin Steps:
1. Navigate to: Advanced Features
2. Look for: CDN or CloudFlare
3. Enable: CDN for tdla.co.za
4. Configure: Automatic optimization
```

#### **9.2 Database Optimization**

```
DirectAdmin Database Setup:
1. Navigate to: MySQL Management
2. Create Database: tdla_co_za_cache
3. Create User: tdla_cache_user
4. Grant Privileges: All on tdla_co_za_cache.*
5. Note credentials for caching (if needed)
```

#### **9.3 Email Configuration**

```
DirectAdmin Email Setup:
1. Navigate to: E-Mail Accounts
2. Create: admin@tdla.co.za
3. Create: support@tdla.co.za
4. Create: noreply@tdla.co.za
5. Configure: Email forwarding to your main email
```

---

## **PHASE 6: TESTING AND VERIFICATION**

### **Step 10: Comprehensive Testing**

#### **10.1 Basic Functionality Tests**

```bash
# Test domain resolution
nslookup tdla.co.za

# Test HTTPS
curl -I https://tdla.co.za

# Test redirect
curl -I http://tdla.co.za
# Should redirect to HTTPS

# Test React Router
curl -I https://tdla.co.za/students
curl -I https://tdla.co.za/reports
# Should return 200 OK
```

#### **10.2 Application Testing Checklist**

```
Manual Testing:
├── [ ] Homepage loads correctly
├── [ ] User authentication works
├── [ ] Student management functional
├── [ ] Attendance tracking works
├── [ ] Billing system operational
├── [ ] Reports generation works
├── [ ] PDF downloads functional
├── [ ] Mobile responsiveness verified
├── [ ] Cross-browser compatibility
└── [ ] Performance acceptable
```

#### **10.3 Performance Testing**

```bash
# Test page load speed
curl -w "@curl-format.txt" -o /dev/null -s https://tdla.co.za

# Create curl-format.txt:
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
```

---

## **TROUBLESHOOTING GUIDE**

### **Common Issues and Solutions**

#### **Issue 1: 404 Errors on React Routes**

```
Problem: Direct URLs like tdla.co.za/students return 404
Solution: Verify .htaccess file is correctly configured
Check: File permissions (644 for .htaccess)
```

#### **Issue 2: SSL Certificate Not Working**

```
Problem: HTTPS not working or certificate errors
Solution:
1. Wait 24-48 hours for DNS propagation
2. Re-generate SSL certificate in DirectAdmin
3. Contact HostAfrica support if persistent
```

#### **Issue 3: Firebase Connection Issues**

```
Problem: Firebase authentication or database not working
Solution:
1. Verify authorized domains in Firebase Console
2. Check CORS settings
3. Ensure environment variables are correct
4. Test Firebase connection in browser console
```

#### **Issue 4: Slow Loading Times**

```
Problem: Website loads slowly
Solution:
1. Enable compression in .htaccess
2. Optimize images
3. Enable browser caching
4. Contact HostAfrica about CDN activation
```

---

## **SUPPORT CONTACTS**

### **HostAfrica Support**

```
Technical Support:
├── Live Chat: Available on hostafrica.co.za
├── Support Tickets: my.hostafrica.com
├── Phone: +27 21 554 3096
├── Email: support@hostafrica.co.za
├── Hours: 7AM-11PM SAST (Monday-Sunday)
└── Emergency: 24/7 for critical issues
```

### **Migration Assistance**

```
Free Migration Services:
├── Website migration from other hosts
├── Domain transfer assistance
├── DNS configuration help
├── SSL certificate setup
└── Email migration support
```

**NEXT PHASE**: Once deployment is complete, proceed to business strategy implementation and marketing launch for TD Learning Academy.
