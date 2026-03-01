// Diagnostic Test for TD Learning Academy
// Run this to check for common errors

export const runDiagnosticTest = async () => {
  const results = {
    timestamp: new Date().toISOString(),
    tests: [],
    errors: [],
    warnings: [],
    summary: {
      passed: 0,
      failed: 0,
      warnings: 0
    }
  };

  // Test 1: Firebase Service Import
  try {
    const firebaseService = (await import('../services/firebaseService')).default;
    results.tests.push({
      name: 'Firebase Service Import',
      status: 'PASS',
      message: 'Firebase service imported successfully'
    });
    results.summary.passed++;

    // Test 2: Firebase Connection
    try {
      const connectionTest = await firebaseService.testConnection();
      results.tests.push({
        name: 'Firebase Connection',
        status: 'PASS',
        message: 'Firebase connection successful'
      });
      results.summary.passed++;
    } catch (error) {
      results.tests.push({
        name: 'Firebase Connection',
        status: 'FAIL',
        message: `Firebase connection failed: ${error.message}`,
        error: error
      });
      results.errors.push(`Firebase Connection: ${error.message}`);
      results.summary.failed++;
    }

    // Test 3: Students Data Access
    try {
      const students = await firebaseService.getStudents();
      results.tests.push({
        name: 'Students Data Access',
        status: 'PASS',
        message: `Successfully loaded ${students.length} students`
      });
      results.summary.passed++;
    } catch (error) {
      results.tests.push({
        name: 'Students Data Access',
        status: 'FAIL',
        message: `Failed to load students: ${error.message}`,
        error: error
      });
      results.errors.push(`Students Data: ${error.message}`);
      results.summary.failed++;
    }

  } catch (error) {
    results.tests.push({
      name: 'Firebase Service Import',
      status: 'FAIL',
      message: `Failed to import Firebase service: ${error.message}`,
      error: error
    });
    results.errors.push(`Firebase Import: ${error.message}`);
    results.summary.failed++;
  }

  // Test 4: Theme Context
  try {
    const { useTheme } = await import('../theme/ThemeContext');
    results.tests.push({
      name: 'Theme Context Import',
      status: 'PASS',
      message: 'Theme context imported successfully'
    });
    results.summary.passed++;
  } catch (error) {
    results.tests.push({
      name: 'Theme Context Import',
      status: 'FAIL',
      message: `Failed to import theme context: ${error.message}`,
      error: error
    });
    results.errors.push(`Theme Context: ${error.message}`);
    results.summary.failed++;
  }

  // Test 5: Auth Context
  try {
    const { AuthContext } = await import('../contexts/AuthContext');
    results.tests.push({
      name: 'Auth Context Import',
      status: 'PASS',
      message: 'Auth context imported successfully'
    });
    results.summary.passed++;
  } catch (error) {
    results.tests.push({
      name: 'Auth Context Import',
      status: 'FAIL',
      message: `Failed to import auth context: ${error.message}`,
      error: error
    });
    results.errors.push(`Auth Context: ${error.message}`);
    results.summary.failed++;
  }

  // Test 6: Environment Variables
  const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID'
  ];

  const missingEnvVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
  
  if (missingEnvVars.length === 0) {
    results.tests.push({
      name: 'Environment Variables',
      status: 'PASS',
      message: 'All required environment variables are present'
    });
    results.summary.passed++;
  } else {
    results.tests.push({
      name: 'Environment Variables',
      status: 'FAIL',
      message: `Missing environment variables: ${missingEnvVars.join(', ')}`
    });
    results.errors.push(`Missing env vars: ${missingEnvVars.join(', ')}`);
    results.summary.failed++;
  }

  // Test 7: Local Storage Access
  try {
    localStorage.setItem('diagnostic_test', 'test');
    localStorage.removeItem('diagnostic_test');
    results.tests.push({
      name: 'Local Storage Access',
      status: 'PASS',
      message: 'Local storage is accessible'
    });
    results.summary.passed++;
  } catch (error) {
    results.tests.push({
      name: 'Local Storage Access',
      status: 'FAIL',
      message: `Local storage access failed: ${error.message}`,
      error: error
    });
    results.errors.push(`Local Storage: ${error.message}`);
    results.summary.failed++;
  }

  // Generate summary
  const totalTests = results.summary.passed + results.summary.failed + results.summary.warnings;
  results.summary.total = totalTests;
  results.summary.successRate = totalTests > 0 ? Math.round((results.summary.passed / totalTests) * 100) : 0;

  return results;
};

// Console-friendly diagnostic runner
export const runConsoleDiagnostic = async () => {
  console.log('🔍 Running TD Learning Academy Diagnostic Test...');
  console.log('================================================');
  
  const results = await runDiagnosticTest();
  
  console.log(`📊 Test Results (${results.timestamp}):`);
  console.log(`✅ Passed: ${results.summary.passed}`);
  console.log(`❌ Failed: ${results.summary.failed}`);
  console.log(`⚠️ Warnings: ${results.summary.warnings}`);
  console.log(`📈 Success Rate: ${results.summary.successRate}%`);
  console.log('');
  
  // Show individual test results
  results.tests.forEach(test => {
    const icon = test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${test.name}: ${test.message}`);
  });
  
  // Show errors if any
  if (results.errors.length > 0) {
    console.log('');
    console.log('🚨 Critical Errors:');
    results.errors.forEach(error => console.log(`   - ${error}`));
  }
  
  console.log('================================================');
  
  return results;
};

export default { runDiagnosticTest, runConsoleDiagnostic };
