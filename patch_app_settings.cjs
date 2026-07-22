const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(
  "<SettingsTab config={schoolConfig} setConfig={setSchoolConfig} holidays={holidays} setHolidays={setHolidays} />",
  "<SettingsTab config={schoolConfig} setConfig={setSchoolConfig} holidays={holidays} setHolidays={setHolidays} students={students} />"
);

fs.writeFileSync('App.tsx', content);
console.log('patched App.tsx SettingsTab prop');
