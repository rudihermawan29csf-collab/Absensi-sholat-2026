const fs = require('fs');
let content = fs.readFileSync('services/sheetsService.ts', 'utf8');

content = content.replace(
  `  if (!res.ok) {
    throw new Error(\`Failed to update \${range}\`);
  }`,
  `  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(\`Gagal mengupdate \${range}. Pastikan nama sheet benar (Students, Attendance, Teachers, Holidays). Detail: \${errorData.error?.message || res.statusText}\`);
  }`
);

fs.writeFileSync('services/sheetsService.ts', content);
console.log('Patched sheetsService.ts');
