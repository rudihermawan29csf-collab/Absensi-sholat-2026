const fs = require('fs');
let content = fs.readFileSync('components/ScannerTab.tsx', 'utf8');

content = content.replace(
  "import { Student, AttendanceRecord, UserRole } from '../types';",
  "import { Student, AttendanceRecord, UserRole, SchoolConfig } from '../types';"
);

content = content.replace(
  "  userRole: UserRole;\n}",
  "  userRole: UserRole;\n  schoolConfig?: SchoolConfig;\n}"
);

content = content.replace(
  "({ students, records, onRecordUpdate, currentUser, userRole }) => {",
  "({ students, records, onRecordUpdate, currentUser, userRole, schoolConfig }) => {"
);

content = content.replace(
  "const [isHaidMode, setIsHaidMode] = useState(false);",
  "const [isHaidMode, setIsHaidMode] = useState(false);\n  const [prayerType, setPrayerType] = useState<'DHUHUR' | 'DHUHA'>('DHUHUR');"
);

content = content.replace(
  "records.filter(r => r.date === todayStr).forEach(r => {",
  "records.filter(r => r.date === todayStr && (r.type || 'DHUHUR') === prayerType).forEach(r => {"
);

content = content.replace(
  "const isAttended = todayAttendanceMap.has(s.id);",
  `const isAttended = todayAttendanceMap.has(s.id);
      
      // Filter untuk Sholat Dhuha berdasarkan jadwal hari ini
      if (prayerType === 'DHUHA' && schoolConfig?.dhuhaSchedule) {
        const todayDay = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...
        const classDays = schoolConfig.dhuhaSchedule[s.className];
        if (classDays && Array.isArray(classDays) && !classDays.includes(todayDay)) {
           return false; // Bukan jadwal dhuha untuk kelas ini
        }
      }`
);

fs.writeFileSync('components/ScannerTab.tsx', content);
console.log('patched ScannerTab.tsx');
