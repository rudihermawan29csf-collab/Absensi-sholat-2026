const fs = require('fs');
let content = fs.readFileSync('components/SettingsTab.tsx', 'utf8');

content = content.replace(
  "import { SchoolConfig, Holiday } from '../types';",
  "import { SchoolConfig, Holiday, Student } from '../types';"
);

content = content.replace(
  "  setHolidays: React.Dispatch<React.SetStateAction<Holiday[]>>;\n}",
  "  setHolidays: React.Dispatch<React.SetStateAction<Holiday[]>>;\n  students: Student[];\n}"
);

content = content.replace(
  "const SettingsTab: React.FC<SettingsTabProps> = ({ config, setConfig, holidays, setHolidays }) => {",
  "const SettingsTab: React.FC<SettingsTabProps> = ({ config, setConfig, holidays, setHolidays, students }) => {\n  const uniqueClasses = Array.from(new Set(students.map(s => s.className))).sort();"
);

fs.writeFileSync('components/SettingsTab.tsx', content);
console.log('patched SettingsTab.tsx prop');
