import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Presentation Generator Script
 * Generates PDF and PowerPoint versions of the hackathon pitch
 */

async function generatePresentations() {
  console.log('🎨 My Tutor Flow Presentation Generator');
  console.log('=====================================\n');

  try {
    // Launch browser
    console.log('🚀 Launching browser...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set viewport for presentation size
    await page.setViewport({
      width: 1024,
      height: 768,
      deviceScaleFactor: 2
    });

    console.log('📄 Generating PDF presentation...');

    // Navigate to the HTML slides
    const htmlPath = path.join(__dirname, 'public', 'presentations', 'My_Tutor_Flow_Hackathon_Slides.html');
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfPath = path.join(__dirname, 'My_Tutor_Flow_Hackathon_Pitch.pdf');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    console.log('✅ PDF generated successfully!');
    console.log(`📁 Location: ${pdfPath}`);

    // Close browser
    await browser.close();

    // Copy HTML file for PowerPoint import
    const slidesSource = htmlPath;
    const slidesDestination = path.join(__dirname, 'My_Tutor_Flow_Hackathon_Slides.html');
    
    if (fs.existsSync(slidesSource)) {
      fs.copyFileSync(slidesSource, slidesDestination);
      console.log('✅ PowerPoint HTML generated successfully!');
      console.log(`📁 Location: ${slidesDestination}`);
    }

    console.log('\n🎉 Presentation generation complete!');
    console.log('\n📋 Files created:');
    console.log(`   📄 PDF: My_Tutor_Flow_Hackathon_Pitch.pdf`);
    console.log(`   📊 PowerPoint HTML: My_Tutor_Flow_Hackathon_Slides.html`);
    
    console.log('\n📱 How to use:');
    console.log('   PDF: Ready to share and present');
    console.log('   PowerPoint: Open HTML file in PowerPoint to import slides');
    
    console.log('\n🎯 Next steps:');
    console.log('   1. Add your logo: Replace 🎓 emoji with My_Tutor_Flow_Logo.png');
    console.log('   2. Customize content as needed');
    console.log('   3. Practice your 4-minute pitch');
    console.log('   4. Win the hackathon! 🏆');

  } catch (error) {
    console.error('❌ Error generating presentations:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure you have installed: npm install puppeteer');
    console.log('   2. Check that the HTML file exists in public/presentations/');
    console.log('   3. Try running: node generate-presentation.js');
  }
}

// Run the generator
generatePresentations();

export { generatePresentations };
