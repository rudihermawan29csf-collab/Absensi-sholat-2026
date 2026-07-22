const fs = require('fs');
let content = fs.readFileSync('services/storageService.ts', 'utf8');

content = content.replace(
  "export const addAttendanceRecordToSheet = async (\n  student: Student, \n  operatorName: string, \n  status: 'PRESENT' | 'HAID' = 'PRESENT'\n): Promise<{ success: boolean; message: string; record?: AttendanceRecord }> => {",
  "export const addAttendanceRecordToSheet = async (\n  student: Student, \n  operatorName: string, \n  status: 'PRESENT' | 'HAID' = 'PRESENT',\n  type: 'DHUHUR' | 'DHUHA' = 'DHUHUR'\n): Promise<{ success: boolean; message: string; record?: AttendanceRecord }> => {"
);

content = content.replace(
  "  if (cachedRecords.some((r) => r.studentId === student.id && r.date === today)) {",
  "  if (cachedRecords.some((r) => r.studentId === student.id && r.date === today && (r.type || 'DHUHUR') === type)) {"
);

content = content.replace(
  "    operatorName: operatorName || 'System',\n    status: status || 'PRESENT'\n  };",
  "    operatorName: operatorName || 'System',\n    status: status || 'PRESENT',\n    type: type\n  };"
);

fs.writeFileSync('services/storageService.ts', content);
console.log('patched addAttendanceRecordToSheet');
