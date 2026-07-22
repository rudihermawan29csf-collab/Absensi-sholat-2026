const fs = require('fs');
let content = fs.readFileSync('components/ScannerTab.tsx', 'utf8');

content = content.replace(
  "if (classDays && Array.isArray(classDays) && !classDays.includes(todayDay)) {",
  "if (!classDays || !Array.isArray(classDays) || !classDays.includes(todayDay)) {"
);

fs.writeFileSync('components/ScannerTab.tsx', content);
console.log('patched ScannerTab.tsx logic');
