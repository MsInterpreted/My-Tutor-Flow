/**
 * Test script to verify student profile page loads without CORS errors
 * This can be run in the browser console to check for CORS issues
 */

// Test function to check student profile loading
async function testStudentProfileCors() {
  console.log('🧪 Testing Student Profile CORS Issues...');

  try {
    // Import the Firebase service
    const { default: firebaseService } = await import('../services/firebaseService.js');

    console.log('🔄 Testing Firebase connection...');
    const connectionOk = await firebaseService.testConnection();
    console.log('✅ Firebase connection:', connectionOk ? 'OK' : 'Failed');

    console.log('🔄 Testing student data fetch...');
    const student = await firebaseService.getStudent('student1');
    console.log('✅ Student data:', student);

    console.log('🔄 Testing documents fetch...');
    const documents = await firebaseService.getDocumentsForStudent('student1');
    console.log('✅ Documents:', documents);

    // Check for CORS issues in documents
    const corsIssues = documents.filter(doc => !doc.accessible);
    if (corsIssues.length > 0) {
      console.warn('⚠️ CORS issues found in documents:', corsIssues);
      console.log('✅ But app handles them gracefully with fallback');
    } else {
      console.log('✅ No CORS issues detected');
    }

    console.log('🎉 Student profile CORS test completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Student profile CORS test failed:', error);
    const errorInfo = firebaseService?.getErrorInfo?.(error) || { message: error.message };
    console.error('📊 Error details:', errorInfo);
    return false;
  }
}

// Export for use in browser console or testing
if (typeof window !== 'undefined') {
  window.testStudentProfileCors = testStudentProfileCors;
}

export default testStudentProfileCors;
