const fs = require('fs');
let content = fs.readFileSync('services/sheetsService.ts', 'utf8');

content = content.replace(
  `  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(\`Failed to fetch \${range}\`);
  }`,
  `  if (!res.ok) {
    if (res.status === 404) return null;
    const errorData = await res.json().catch(() => ({}));
    throw new Error(\`Gagal membaca \${range}. Pastikan nama sheet benar. Detail: \${errorData.error?.message || res.statusText}\`);
  }`
);

fs.writeFileSync('services/sheetsService.ts', content);
console.log('Patched sheetsService.ts fetch');
