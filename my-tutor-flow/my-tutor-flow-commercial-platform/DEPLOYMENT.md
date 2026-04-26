# TD Learning Academy - Deployment Guide

This guide provides step-by-step instructions for deploying the TD Learning Academy platform.

## Pre-Deployment Checklist

### Technical Requirements
- [ ] Node.js 18+ installed
- [ ] Firebase project created and configured
- [ ] Domain name registered (tdla.co.za)
- [ ] SSL certificate (handled by most hosting providers)
- [ ] Email service configured (for notifications)

### Business Requirements
- [ ] Terms of Service and Privacy Policy prepared
- [ ] Customer support procedures established
- [ ] Pricing and billing structure defined

## Environment Setup

### 1. Clone and Configure

```bash
# Clone the platform
git clone <your-repo-url>
cd my-tutor-flow-commercial-platform

# Install dependencies
npm install

# Copy environment template
cp .env.template .env
```

### 2. Configure Environment Variables

Edit `.env` file with your specific configuration:

```env
# Firebase Configuration (Required)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=my-tutor-flow-commercial.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-tutor-flow-commercial
VITE_FIREBASE_STORAGE_BUCKET=my-tutor-flow-commercial.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Application Configuration
VITE_APP_NAME=TD Learning Academy
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production

# Business Configuration
VITE_BRAND_NAME=TD Learning Academy
VITE_SUPPORT_EMAIL=support@tdla.co.za
VITE_WEBSITE_URL=https://tdla.co.za
```

### 3. Build and Deploy

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Firebase Hosting
firebase deploy
```

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/project/my-tutor-flow-commercial)
2. Enable Authentication > Email/Password
3. Deploy Firestore rules: `firebase deploy --only firestore:rules`
4. Deploy Storage rules: `firebase deploy --only storage`
5. Add your domain (tdla.co.za) to Authentication > Settings > Authorized domains

### 5. First User Setup

1. Navigate to `/signup`
2. Use authorization code `MASTER-TUTOR-2024` for admin access
3. Create your admin account with email and password
4. You'll be redirected to the dashboard

## Production Considerations

- Enable Firebase App Check for API security
- Set up Firebase Performance Monitoring
- Configure backup schedules for Firestore data
- Set up error tracking (Sentry or similar)
- Enable HTTPS-only access

## TD Learning Academy is now ready for business!
