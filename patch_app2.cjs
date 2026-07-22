const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(
  "<ScannerTab students={students} records={records} onRecordUpdate={handleRecordUpdate} currentUser={currentUser} userRole={userRole} />",
  "<ScannerTab students={students} records={records} onRecordUpdate={handleRecordUpdate} currentUser={currentUser} userRole={userRole} schoolConfig={schoolConfig} />"
);

fs.writeFileSync('App.tsx', content);
console.log('patched App.tsx ScannerTab prop');
