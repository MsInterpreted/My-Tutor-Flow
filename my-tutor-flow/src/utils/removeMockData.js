// Utility script to remove all mock data references from Firebase service
// This will be used to clean up the service file

import fs from 'fs';
import path from 'path';

const firebaseServicePath = path.join(process.cwd(), 'src/services/firebaseService.js');

function removeMockDataReferences() {
  try {
    let content = fs.readFileSync(firebaseServicePath, 'utf8');
    
    // Remove all mock data conditional blocks
    const mockDataPatterns = [
      // Pattern: if (await this.shouldUseMockData()) { return mockDataService.method(); }
      /if \(await this\.shouldUseMockData\(\)\) \{\s*return mockDataService\.[^}]+\}\s*/g,
      
      // Pattern: this.useMockData = true;
      /this\.useMockData = true;/g,
      
      // Pattern: this.useMockData = false;
      /this\.useMockData = false;/g,
      
      // Pattern: mockDataService references
      /mockDataService\.[^;]+;/g,
      
      // Pattern: comments about mock data
      /\/\/ .*mock.*data.*/gi,
    ];
    
    // Apply all patterns
    mockDataPatterns.forEach(pattern => {
      content = content.replace(pattern, '');
    });
    
    // Clean up extra whitespace
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Write back to file
    fs.writeFileSync(firebaseServicePath, content, 'utf8');
    
    console.log('✅ Mock data references removed from Firebase service');
    return true;
  } catch (error) {
    console.error('❌ Error removing mock data references:', error);
    return false;
  }
}

export default removeMockDataReferences;
