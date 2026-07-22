const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(
  `        // Simpan ke local storage
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(sheetsData.students));
        localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(sheetsData.teachers));
        localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(sheetsData.attendance));
        localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(sheetsData.holidays));`,
  `        // Simpan ke local storage (Hanya timpa jika ada data, agar tidak hilang jika terhapus)
        if (sheetsData.students.length > 0) localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(sheetsData.students));
        if (sheetsData.teachers.length > 0) localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(sheetsData.teachers));
        if (sheetsData.attendance.length > 0) localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(sheetsData.attendance));
        if (sheetsData.holidays.length > 0) localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(sheetsData.holidays));`
);

fs.writeFileSync('App.tsx', content);
console.log('Patched App.tsx');
