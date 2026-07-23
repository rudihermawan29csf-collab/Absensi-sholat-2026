import fs from 'fs';
let content = fs.readFileSync('App.tsx', 'utf8');

const loadLocalDataBlock = `        const [studentData, teacherData, attendanceData, configData, holidayData] = await Promise.all([
          getStudents(),
          getTeachers(),
          getAttendance(),
          getSchoolConfig(),
          getHolidays()
        ]);
        
        if (studentData && studentData.length > 0) setStudents(studentData);
        else if (students.length === 0) setStudents(INITIAL_STUDENTS);

        if (teacherData && teacherData.length > 0) setTeachers(teacherData);
        else if (teachers.length === 0) setTeachers(INITIAL_TEACHERS);
        
        if (configData) setSchoolConfig(configData);
        if (holidayData) setHolidays(holidayData);
        
        setRecords(attendanceData);`;

content = content.replace(
  `} catch (error: any) {
      console.warn("Sync error, continuing with local data:", error.message);
    }`,
  `} catch (error: any) {
      console.warn("Sync error, continuing with local data:", error.message);
${loadLocalDataBlock}
    }`
);

fs.writeFileSync('App.tsx', content);
console.log('patched');
