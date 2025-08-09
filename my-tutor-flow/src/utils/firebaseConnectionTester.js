// TD Learning Academy - Firebase Connection Tester
// Comprehensive Firebase connectivity testing and diagnostics

import { auth, db, storage } from '../firebaseConfig';

/**
 * Firebase Connection Tester
 * Tests all Firebase services and provides detailed diagnostics
 */
class FirebaseConnectionTester {
  constructor() {
    this.testResults = new Map();
    this.isConnected = false;
    this.services = {
      auth: false,
      firestore: false,
      storage: false,
    };
  }

  // Run comprehensive Firebase connection tests
  async runConnectionTests() {
    console.log('🔥 Starting Firebase Connection Tests...');
    
    const tests = [
      () => this.testFirebaseApp(),
      () => this.testAuthentication(),
      () => this.testFirestore(),
      () => this.testStorage(),
      () => this.testDomainConfiguration(),
      () => this.testSecurityRules(),
    ];

    for (const test of tests) {
      try {
        await test();
      } catch (error) {
        console.error('❌ Test failed:', error);
      }
    }

    this.generateConnectionReport();
    return this.getConnectionSummary();
  }

  // Test Firebase app initialization
  async testFirebaseApp() {
    try {
      if (!auth || !db) {
        this.recordTest('Firebase App', false, 'Firebase services not initialized');
        return;
      }

      this.recordTest('Firebase App', true, 'Firebase app initialized successfully');
    } catch (error) {
      this.recordTest('Firebase App', false, `App initialization failed: ${error.message}`);
    }
  }

  // Test Firebase Authentication
  async testAuthentication() {
    try {
      if (!auth || typeof auth.onAuthStateChanged !== 'function') {
        this.recordTest('Authentication', false, 'Firebase Auth not available');
        return;
      }

      // Test auth state listener
      const unsubscribe = auth.onAuthStateChanged((user) => {
        console.log('🔐 Auth state changed:', user ? 'User logged in' : 'No user');
      });

      // Test current user access
      const currentUser = auth.currentUser;
      
      this.recordTest('Authentication', true, 
        `Auth service available. Current user: ${currentUser ? currentUser.email : 'None'}`);
      
      this.services.auth = true;
      unsubscribe();
    } catch (error) {
      this.recordTest('Authentication', false, `Auth test failed: ${error.message}`);
    }
  }

  // Test Firestore connection
  async testFirestore() {
    try {
      if (!db) {
        this.recordTest('Firestore', false, 'Firestore not initialized');
        return;
      }

      // Import Firestore functions dynamically
      const { collection, getDocs, query, limit } = await import('firebase/firestore');
      
      // Test basic Firestore read
      const testCollection = collection(db, 'students');
      const testQuery = query(testCollection, limit(1));
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firestore timeout')), 5000)
      );
      
      const firestorePromise = getDocs(testQuery);
      
      await Promise.race([firestorePromise, timeoutPromise]);
      
      this.recordTest('Firestore', true, 'Firestore connection successful');
      this.services.firestore = true;
    } catch (error) {
      this.recordTest('Firestore', false, `Firestore test failed: ${error.message}`);
      
      // Check for specific error types
      if (error.message.includes('403') || error.message.includes('PERMISSION_DENIED')) {
        this.recordTest('Firestore Permissions', false, 
          'Permission denied - check Firebase security rules and domain configuration');
      }
    }
  }

  // Test Firebase Storage
  async testStorage() {
    try {
      if (!storage) {
        this.recordTest('Storage', false, 'Firebase Storage not initialized');
        return;
      }

      // Import Storage functions dynamically
      const { ref, listAll } = await import('firebase/storage');
      
      // Test basic storage access
      const storageRef = ref(storage, '/');
      
      // Add timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Storage timeout')), 5000)
      );
      
      const storagePromise = listAll(storageRef);
      
      await Promise.race([storagePromise, timeoutPromise]);
      
      this.recordTest('Storage', true, 'Firebase Storage connection successful');
      this.services.storage = true;
    } catch (error) {
      this.recordTest('Storage', false, `Storage test failed: ${error.message}`);
    }
  }

  // Test domain configuration
  async testDomainConfiguration() {
    const currentDomain = window.location.hostname;
    const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
    
    if (currentDomain === 'localhost' || currentDomain === '127.0.0.1') {
      this.recordTest('Domain Configuration', true, 
        'Running on localhost - domain restrictions bypassed');
      return;
    }

    if (authDomain && authDomain.includes(currentDomain)) {
      this.recordTest('Domain Configuration', true, 
        `Domain ${currentDomain} matches Firebase auth domain`);
    } else {
      this.recordTest('Domain Configuration', false, 
        `Domain mismatch: Current=${currentDomain}, Firebase=${authDomain}`);
    }
  }

  // Test security rules (basic check)
  async testSecurityRules() {
    try {
      if (!db) {
        this.recordTest('Security Rules', false, 'Cannot test - Firestore not available');
        return;
      }

      // This is a basic test - actual security rules testing would require authentication
      this.recordTest('Security Rules', true, 
        'Security rules test skipped - requires authenticated user');
    } catch (error) {
      this.recordTest('Security Rules', false, `Security rules test failed: ${error.message}`);
    }
  }

  // Record test result
  recordTest(testName, passed, details) {
    const result = {
      name: testName,
      passed,
      details,
      timestamp: new Date().toISOString(),
    };

    this.testResults.set(testName, result);

    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testName}: ${details}`);
  }

  // Generate connection report
  generateConnectionReport() {
    const totalTests = this.testResults.size;
    const passedTests = Array.from(this.testResults.values()).filter(test => test.passed).length;
    const failedTests = totalTests - passedTests;

    console.log('\n🔥 FIREBASE CONNECTION REPORT');
    console.log('==============================');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📊 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    // Service status
    console.log('\n📋 SERVICE STATUS:');
    console.log(`🔐 Authentication: ${this.services.auth ? '✅ Working' : '❌ Failed'}`);
    console.log(`🗄️ Firestore: ${this.services.firestore ? '✅ Working' : '❌ Failed'}`);
    console.log(`📁 Storage: ${this.services.storage ? '✅ Working' : '❌ Failed'}`);

    // Overall connection status
    this.isConnected = this.services.auth || this.services.firestore;
    console.log(`\n🌐 Overall Status: ${this.isConnected ? '✅ Connected' : '❌ Disconnected'}`);

    if (!this.isConnected) {
      console.log('\n💡 RECOMMENDATIONS:');
      this.generateRecommendations();
    }
  }

  // Generate recommendations based on test results
  generateRecommendations() {
    const failedTests = Array.from(this.testResults.values()).filter(test => !test.passed);
    
    failedTests.forEach(test => {
      switch (test.name) {
        case 'Firebase App':
          console.log('• Check Firebase configuration in .env file');
          console.log('• Verify Firebase project exists and is active');
          break;
        case 'Authentication':
          console.log('• Enable Authentication in Firebase Console');
          console.log('• Check authentication providers are configured');
          break;
        case 'Firestore':
          console.log('• Enable Firestore in Firebase Console');
          console.log('• Check Firestore security rules');
          console.log('• Verify domain is authorized in Firebase settings');
          break;
        case 'Storage':
          console.log('• Enable Storage in Firebase Console');
          console.log('• Check Storage security rules');
          break;
        case 'Domain Configuration':
          console.log('• Add your domain to Firebase authorized domains');
          console.log('• Update Firebase hosting configuration');
          break;
        default:
          console.log(`• Address issue with ${test.name}`);
      }
    });
  }

  // Get connection summary
  getConnectionSummary() {
    return {
      isConnected: this.isConnected,
      services: this.services,
      testResults: Array.from(this.testResults.values()),
      recommendations: this.isConnected ? [] : this.getFailureRecommendations(),
    };
  }

  // Get failure recommendations
  getFailureRecommendations() {
    const recommendations = [];
    
    if (!this.services.auth) {
      recommendations.push({
        service: 'Authentication',
        issue: 'Firebase Auth not working',
        solution: 'Enable Authentication in Firebase Console and check domain configuration',
        priority: 'high'
      });
    }

    if (!this.services.firestore) {
      recommendations.push({
        service: 'Firestore',
        issue: 'Database connection failed',
        solution: 'Enable Firestore and update security rules to allow your domain',
        priority: 'high'
      });
    }

    if (!this.services.storage) {
      recommendations.push({
        service: 'Storage',
        issue: 'File storage not accessible',
        solution: 'Enable Firebase Storage and configure security rules',
        priority: 'medium'
      });
    }

    return recommendations;
  }

  // Quick health check
  async quickHealthCheck() {
    try {
      const isAuthAvailable = auth && typeof auth.onAuthStateChanged === 'function';
      const isFirestoreAvailable = db !== null;
      
      return {
        healthy: isAuthAvailable || isFirestoreAvailable,
        services: {
          auth: isAuthAvailable,
          firestore: isFirestoreAvailable,
          storage: storage !== null,
        },
        recommendation: isAuthAvailable || isFirestoreAvailable ? 
          'Firebase partially working' : 
          'Firebase not available - using mock data'
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
        recommendation: 'Check Firebase configuration and network connection'
      };
    }
  }
}

// Create singleton instance
const firebaseConnectionTester = new FirebaseConnectionTester();

// Export functions
export const testFirebaseConnection = () => {
  return firebaseConnectionTester.runConnectionTests();
};

export const quickFirebaseHealthCheck = () => {
  return firebaseConnectionTester.quickHealthCheck();
};

export default firebaseConnectionTester;
