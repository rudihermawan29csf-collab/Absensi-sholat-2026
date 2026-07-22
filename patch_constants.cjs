const fs = require('fs');
let content = fs.readFileSync('constants.ts', 'utf8');

content = content.replace(
  "academicYear: '2025/2026',\n  semester: 'GANJIL'\n};",
  "academicYear: '2025/2026',\n  semester: 'GANJIL',\n  dhuhaSchedule: {}\n};"
);

fs.writeFileSync('constants.ts', content);
console.log('patched constants.ts');
