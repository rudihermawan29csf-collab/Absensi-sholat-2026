const fs = require('fs');
let content = fs.readFileSync('components/Reports.tsx', 'utf8');

content = content.replace(
  "({ records = [], students = [], onRecordUpdate, viewOnlyStudent, holidays = [] }) => {",
  "({ records: allRecords = [], students = [], onRecordUpdate, viewOnlyStudent, holidays = [] }) => {\n  const [reportPrayerType, setReportPrayerType] = useState<'DHUHUR' | 'DHUHA'>('DHUHUR');\n  const records = useMemo(() => allRecords.filter(r => (r.type || 'DHUHUR') === reportPrayerType), [allRecords, reportPrayerType]);"
);

content = content.replace(
  "          <div className=\"flex flex-wrap gap-2\">",
  "          <div className=\"flex flex-wrap gap-2\">\n            <div className=\"flex bg-slate-900 rounded-lg p-1 border border-slate-700\">\n              <button onClick={() => setReportPrayerType('DHUHUR')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all \${reportPrayerType === 'DHUHUR' ? 'bg-cyan-900/60 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>Dhuhur</button>\n              <button onClick={() => setReportPrayerType('DHUHA')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all \${reportPrayerType === 'DHUHA' ? 'bg-amber-900/60 text-amber-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>Dhuha</button>\n            </div>"
);

fs.writeFileSync('components/Reports.tsx', content);
console.log('patched Reports.tsx');
