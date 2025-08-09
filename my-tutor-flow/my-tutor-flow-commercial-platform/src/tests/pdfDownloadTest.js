// PDF Download Test - Node.js test to verify PDF functionality
const puppeteer = require('puppeteer');

async function testPDFDownload() {
  console.log('🧪 Starting PDF Download Test...');

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Browser Error:', msg.text());
      }
    });

    // Navigate to reports page
    console.log('📊 Navigating to Reports page...');
    await page.goto('http://localhost:3001/reports', { waitUntil: 'networkidle0' });

    // Wait for page to load
    await page.waitForTimeout(3000);

    // Check if PDF libraries are loaded
    const pdfLibrariesLoaded = await page.evaluate(async () => {
      try {
        const { jsPDF } = await import('jspdf');
        const html2canvas = await import('html2canvas');
        return !!(jsPDF && html2canvas);
      } catch (error) {
        console.error('PDF libraries error:', error);
        return false;
      }
    });

    if (pdfLibrariesLoaded) {
      console.log('✅ PDF libraries loaded successfully');
    } else {
      console.log('❌ PDF libraries failed to load');
      return false;
    }

    // Test PDF generation
    const pdfGenerationTest = await page.evaluate(async () => {
      try {
        const { jsPDF } = await import('jspdf');
        const pdf = new jsPDF();
        pdf.text('Test PDF Generation', 20, 20);
        return true;
      } catch (error) {
        console.error('PDF generation error:', error);
        return false;
      }
    });

    if (pdfGenerationTest) {
      console.log('✅ PDF generation test passed');
    } else {
      console.log('❌ PDF generation test failed');
      return false;
    }

    console.log('🎉 All PDF tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testPDFDownload().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = testPDFDownload;
