const fs = require('fs');
let content = fs.readFileSync('components/Reports.tsx', 'utf8');

content = content.replace(
  "return (\n    <div className=\"space-y-6 pb-20\">\n      <div className=\"flex bg-slate-900 p-1.5 rounded-xl border border-white/10 w-full mx-auto mb-8 shadow-xl overflow-x-auto no-scrollbar\">",
  "return (\n    <div className=\"space-y-6 pb-20\">\n      <div className=\"flex justify-center mb-4\">\n        <div className=\"flex bg-slate-900 rounded-lg p-1 border border-slate-700\">\n          <button onClick={() => setReportPrayerType('DHUHUR')} className={`px-6 py-2 rounded-md text-xs font-bold transition-all \${reportPrayerType === 'DHUHUR' ? 'bg-cyan-900/60 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>SHOLAT DHUHUR</button>\n          <button onClick={() => setReportPrayerType('DHUHA')} className={`px-6 py-2 rounded-md text-xs font-bold transition-all \${reportPrayerType === 'DHUHA' ? 'bg-amber-900/60 text-amber-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>SHOLAT DHUHA</button>\n        </div>\n      </div>\n      <div className=\"flex bg-slate-900 p-1.5 rounded-xl border border-white/10 w-full mx-auto mb-8 shadow-xl overflow-x-auto no-scrollbar\">"
);

fs.writeFileSync('components/Reports.tsx', content);
console.log('patched Reports.tsx');
