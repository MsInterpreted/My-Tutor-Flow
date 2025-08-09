// Simple PDF Functionality Test
console.log('🧪 Testing PDF Download Functionality...');

async function testPDFLibraries() {
  const results = {
    jsPDFImport: false,
    html2canvasImport: false,
    pdfGeneration: false,
    errors: [],
  };

  try {
    // Test 1: jsPDF Import
    console.log('📄 Testing jsPDF import...');
    const { jsPDF } = await import('jspdf');
    if (jsPDF) {
      results.jsPDFImport = true;
      console.log('✅ jsPDF imported successfully');
    } else {
      results.errors.push('jsPDF import returned undefined');
      console.log('❌ jsPDF import failed');
    }
  } catch (error) {
    results.errors.push(`jsPDF import error: ${error.message}`);
    console.log('❌ jsPDF import error:', error.message);
  }

  try {
    // Test 2: html2canvas Import
    console.log('🖼️ Testing html2canvas import...');
    const html2canvas = await import('html2canvas');
    if (html2canvas.default) {
      results.html2canvasImport = true;
      console.log('✅ html2canvas imported successfully');
    } else {
      results.errors.push('html2canvas import returned undefined');
      console.log('❌ html2canvas import failed');
    }
  } catch (error) {
    results.errors.push(`html2canvas import error: ${error.message}`);
    console.log('❌ html2canvas import error:', error.message);
  }

  try {
    // Test 3: PDF Generation
    if (results.jsPDFImport) {
      console.log('📋 Testing PDF generation...');
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF();
      pdf.text('Test PDF Generation - TD Learning Academy', 20, 20);
      pdf.text('This is a test to verify PDF functionality works correctly.', 20, 30);

      results.pdfGeneration = true;
      console.log('✅ PDF generation test passed');
    }
  } catch (error) {
    results.errors.push(`PDF generation error: ${error.message}`);
    console.log('❌ PDF generation error:', error.message);
  }

  // Summary
  console.log('\n==================================================');
  console.log('🎯 PDF FUNCTIONALITY TEST RESULTS');
  console.log('==================================================');
  console.log(`📄 jsPDF Import: ${results.jsPDFImport ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🖼️ html2canvas Import: ${results.html2canvasImport ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📋 PDF Generation: ${results.pdfGeneration ? '✅ PASS' : '❌ FAIL'}`);

  if (results.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    results.errors.forEach(error => console.log(`   - ${error}`));
  }

  const allPassed = results.jsPDFImport && results.html2canvasImport && results.pdfGeneration;
  console.log(`\n🎯 Overall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  console.log('==================================================\n');

  return results;
}

// Auto-run test when loaded in browser
if (typeof window !== 'undefined') {
  // Browser environment
  window.testPDFLibraries = testPDFLibraries;
  console.log('🌐 PDF test function loaded. Run testPDFLibraries() in console to test.');
} else {
  // Node.js environment
  testPDFLibraries();
}
