const fs = require('fs');
let content = fs.readFileSync('services/sheetsService.ts', 'utf8');

content = content.replace('console.error("Error loading data from Apps Script:", error);', 
  'console.warn("Could not load from Apps Script (might be blocked by browser/CORS):", error);');

content = content.replace('console.error(`Error saving ${action}:`, error);',
  'console.warn(`Could not save ${action}:`, error);');

fs.writeFileSync('services/sheetsService.ts', content);
