const fs = require('fs');
let content = fs.readFileSync('components/ScannerTab.tsx', 'utf8');

content = content.replace(
  '<div className="flex flex-col md:flex-row gap-3">',
  `<div className="flex gap-2 mb-3">
    <button onClick={() => { setPrayerType('DHUHUR'); setSelectedIds(new Set()); }} className={\`flex-1 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all \${prayerType === 'DHUHUR' ? 'bg-cyan-900/40 border-cyan-500 text-cyan-400' : 'bg-slate-900 border-slate-700 text-slate-500'}\`}>SHOLAT DHUHUR</button>
    <button onClick={() => { setPrayerType('DHUHA'); setSelectedIds(new Set()); }} className={\`flex-1 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all \${prayerType === 'DHUHA' ? 'bg-amber-900/40 border-amber-500 text-amber-400' : 'bg-slate-900 border-slate-700 text-slate-500'}\`}>SHOLAT DHUHA</button>
  </div>
  <div className="flex flex-col md:flex-row gap-3">`
);

fs.writeFileSync('components/ScannerTab.tsx', content);
console.log('patched ScannerTab.tsx');
