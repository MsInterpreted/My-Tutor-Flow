// TD Learning Academy Commercial - Firebase Configuration
// Import the functions you need from the Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as analyticsIsSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { FIREBASE_CONFIG, validateEnvironment } from './config/environment';

// Validate environment configuration
const validation = validateEnvironment();
if (!validation.isValid) {
  console.error('Environment validation failed:', validation.errors);
  throw new Error(`Environment configuration errors: ${validation.errors.join(', ')}`);
}

// TD Learning Academy Commercial Firebase configuration
const firebaseConfig = {
  ...FIREBASE_CONFIG,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase for TD Learning Academy Commercial
let app;
let analytics = null;
let auth;
let db;
let storage;

console.log('🎓 Initializing Firebase for TD Learning Academy Commercial...');

try {
  console.log('🔥 Initializing Firebase for TD Learning Academy Commercial...');
  console.log('📋 Firebase Configuration:');
  console.log('- Project ID:', firebaseConfig.projectId);
  console.log('- Auth Domain:', firebaseConfig.authDomain);
  console.log('- Current Domain:', window.location.hostname);

  // Initialize Firebase app
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized');

  // Initialize Firebase services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  console.log('✅ Firebase Auth initialized');
  console.log('✅ Firestore initialized');
  console.log('✅ Firebase Storage initialized');

  // Initialize Analytics (production only)
  if (import.meta.env.PROD && firebaseConfig.measurementId) {
    try {
      analytics = getAnalytics(app);
      console.log('✅ Firebase Analytics initialized');
    } catch (analyticsError) {
      console.warn('⚠️ Firebase Analytics failed:', analyticsError.message);
      analytics = null;
    }
  }

  console.log('🎉 Firebase initialization completed successfully');

} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  console.error('🚨 This will cause the app to fail - Firebase is required');
  throw new Error(`Firebase initialization failed: ${error.message}`);
}

// Export these so they can be used in other files
export { app, analytics, auth, db, storage };

// Export configuration for debugging (only in development)
export const getFirebaseConfig = () => {
  if (import.meta.env.DEV) {
    return firebaseConfig;
  }
  return null;
};
