const fs = require('fs');
let content = fs.readFileSync('types.ts', 'utf8');

content = content.replace(
  "status?: 'PRESENT' | 'HAID'; // Status kehadiran",
  "status?: 'PRESENT' | 'HAID'; // Status kehadiran\n  type?: 'DHUHUR' | 'DHUHA';"
);

content = content.replace(
  "semester: 'GANJIL' | 'GENAP';",
  "semester: 'GANJIL' | 'GENAP';\n  dhuhaSchedule?: Record<string, number[]>; // class -> array of day indices (1=Mon, 2=Tue, etc.)"
);

fs.writeFileSync('types.ts', content);
console.log('patched types.ts');
