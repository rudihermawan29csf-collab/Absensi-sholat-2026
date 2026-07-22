const fs = require('fs');
let content = fs.readFileSync('services/storageService.ts', 'utf8');

const newContent = content.replace(
  `  if (!isFirebaseConfigured) {
    return { 
       success: true, 
       message: \`\${newRecord.studentName} berhasil ABSEN (Mode Offline).\`,
      record: newRecord 
    };
  }`,
  `  if (isSheetsEnabled()) {
    try {
      await saveAttendanceToSheets(getSheetId(), updatedRecords);
      return { 
        success: true, 
        message: \`\${newRecord.studentName} berhasil ABSEN (Google Sheets).\`,
        record: newRecord 
      };
    } catch (e: any) {
      console.warn("Error adding attendance to Sheets:", e.message);
      return { success: true, message: "Tersimpan Lokal (Gagal Sync ke Sheets).", record: newRecord };
    }
  }

  if (!isFirebaseConfigured) {
    return { 
       success: true, 
       message: \`\${newRecord.studentName} berhasil ABSEN (Mode Offline).\`,
      record: newRecord 
    };
  }`
);

fs.writeFileSync('services/storageService.ts', newContent);
console.log('patched attendance');
