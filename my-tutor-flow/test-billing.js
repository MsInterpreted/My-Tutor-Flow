// Node.js Test Runner for Billing Workflow
// This script runs the comprehensive billing tests

import { executeComprehensiveBillingTest } from './src/utils/testRunner.js';

async function runTests() {
  try {
    console.log('Starting Comprehensive Billing Workflow Tests...');
    const results = await executeComprehensiveBillingTest();

    console.log('\n=== FINAL TEST RESULTS ===');
    console.log(JSON.stringify(results, null, 2));

    process.exit(results.summary.failed === 0 ? 0 : 1);
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  }
}

runTests();
