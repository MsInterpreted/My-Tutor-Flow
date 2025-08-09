// Simple test script to verify Students page functionality
import firebaseService from './src/services/firebaseService.js';

async function testStudentsPageFunctionality() {
  console.log('🧪 Testing Students Page Functionality...\n');

  try {
    // Test 1: Firebase connection test
    console.log('1. Testing Firebase connection...');
    const connectionResult = await firebaseService.testConnection();
    console.log(`   Connection result: ${connectionResult}`);
    console.log(`   Using mock data: ${firebaseService.useMockData}\n`);

    // Test 2: Get students
    console.log('2. Testing getStudents...');
    const students = await firebaseService.getStudents();
    console.log(`   Students count: ${students.length}`);
    if (students.length > 0) {
      console.log(`   First student: ${students[0].firstName} ${students[0].lastName}`);
    }
    console.log('');

    // Test 3: Test environment variables
    console.log('3. Testing environment configuration...');
    console.log(`   VITE_FORCE_MOCK_DATA: ${process.env.VITE_FORCE_MOCK_DATA}`);
    console.log('');

    console.log('✅ All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testStudentsPageFunctionality();
