// Authentication service that handles both Firebase and mock authentication
import mockDataService from './mockDataService';

class AuthService {
  constructor() {
    this.isInitialized = false;
    this.firebaseAuth = null;
    this.firebaseAuthFunctions = null;
  }

  // Initialize Firebase auth only when needed and not in mock mode
  async initializeFirebase() {
    if (this.isInitialized || import.meta.env.VITE_FORCE_MOCK_DATA === 'true') {
      return;
    }

    try {
      const { auth } = await import('../firebaseConfig');
      const { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } =
        await import('firebase/auth');

      this.firebaseAuth = auth;
      this.firebaseAuthFunctions = {
        signInWithEmailAndPassword,
        GoogleAuthProvider,
        signInWithPopup,
        signOut,
      };
      this.isInitialized = true;
      console.log('✅ Firebase auth initialized');
    } catch (error) {
      console.warn('⚠️ Firebase auth initialization failed:', error);
      this.isInitialized = false;
    }
  }

  // Check if we should use mock authentication - PRODUCTION: Only if Firebase unavailable
  shouldUseMockAuth() {
    return !this.firebaseAuth;
  }

  // Sign in with email and password
  async signInWithEmailAndPassword(email, password) {
    if (this.shouldUseMockAuth()) {
      console.log('🧪 Using mock authentication for email/password sign-in');
      return await mockDataService.signInWithEmailAndPassword(email, password);
    }

    await this.initializeFirebase();
    if (!this.firebaseAuth || !this.firebaseAuthFunctions) {
      throw new Error('Firebase authentication not available');
    }

    return await this.firebaseAuthFunctions.signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    );
  }

  // Sign in with Google popup
  async signInWithPopup() {
    if (this.shouldUseMockAuth()) {
      console.log('🧪 Using mock authentication for Google sign-in');
      return await mockDataService.signInWithPopup();
    }

    await this.initializeFirebase();
    if (!this.firebaseAuth || !this.firebaseAuthFunctions) {
      throw new Error('Firebase authentication not available');
    }

    const provider = new this.firebaseAuthFunctions.GoogleAuthProvider();
    return await this.firebaseAuthFunctions.signInWithPopup(this.firebaseAuth, provider);
  }

  // Sign out
  async signOut() {
    if (this.shouldUseMockAuth()) {
      console.log('🧪 Using mock authentication for sign-out');
      return await mockDataService.signOut();
    }

    await this.initializeFirebase();
    if (!this.firebaseAuth || !this.firebaseAuthFunctions) {
      throw new Error('Firebase authentication not available');
    }

    return await this.firebaseAuthFunctions.signOut(this.firebaseAuth);
  }

  // Get user profile (works with both Firebase and mock)
  async getUserProfile(uid) {
    if (this.shouldUseMockAuth()) {
      console.log('🧪 Using mock data for user profile');
      return await mockDataService.getUserProfile(uid);
    }

    // Import and use the real getUserProfile function
    try {
      const { getUserProfile } = await import('./authorizationService');
      return await getUserProfile(uid);
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Validate authorization code (works with both Firebase and mock)
  async validateAuthorizationCode(code) {
    try {
      const { validateAuthorizationCode } = await import('./authorizationService');
      return await validateAuthorizationCode(code);
    } catch (error) {
      console.error('Error validating authorization code:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;
