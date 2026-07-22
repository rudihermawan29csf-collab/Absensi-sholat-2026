const fs = require('fs');
let content = fs.readFileSync('components/ScannerTab.tsx', 'utf8');

content = content.replace(
  "const result = await addAttendanceRecordToSheet(student, currentUser, status);",
  "const result = await addAttendanceRecordToSheet(student, currentUser, status, prayerType);"
);

content = content.replace(
  "const result = await addAttendanceRecordToSheet(student, currentUser, status);",
  "const result = await addAttendanceRecordToSheet(student, currentUser, status, prayerType);"
);

content = content.replace(
  "sendWhatsappMessage(student, status);",
  "sendWhatsappMessage(student, status, prayerType);"
);

content = content.replace(
  "const sendWhatsappMessage = (student: Student, status: 'PRESENT' | 'HAID' = 'PRESENT') => {",
  "const sendWhatsappMessage = (student: Student, status: 'PRESENT' | 'HAID' = 'PRESENT', pType: 'DHUHUR' | 'DHUHA' = 'DHUHUR') => {"
);

content = content.replace(
  "let text = status === 'HAID' \n      ? `Assalamualaikum. Diberitahukan bahwa ananda *${student.name}* (Kelas ${student.className}) telah hadir di sekolah pada hari ini ${today}, namun sedang berhalangan (haid). Petugas: ${currentUser}. Terima kasih.`\n      : `Assalamualaikum. Diberitahukan bahwa ananda *${student.name}* (Kelas ${student.className}) telah melaksanakan sholat Dhuhur berjamaah di sekolah pada hari ini ${today}. Petugas: ${currentUser}. Terima kasih.`;",
  `let text = status === 'HAID' 
      ? \`Assalamualaikum. Diberitahukan bahwa ananda *\${student.name}* (Kelas \${student.className}) telah hadir di sekolah pada hari ini \${today}, namun sedang berhalangan (haid) sehingga tidak mengikuti Sholat \${pType === 'DHUHA' ? 'Dhuha' : 'Dhuhur'}. Petugas: \${currentUser}. Terima kasih.\`
      : \`Assalamualaikum. Diberitahukan bahwa ananda *\${student.name}* (Kelas \${student.className}) telah melaksanakan Sholat \${pType === 'DHUHA' ? 'Dhuha' : 'Dhuhur'} berjamaah di sekolah pada hari ini \${today}. Petugas: \${currentUser}. Terima kasih.\`;`
);

fs.writeFileSync('components/ScannerTab.tsx', content);
console.log('patched ScannerTab.tsx');
