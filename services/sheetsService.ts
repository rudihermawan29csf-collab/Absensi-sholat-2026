import { Student, AttendanceRecord, Teacher, Holiday } from '../types';

export const loadAllDataFromSheets = async (appScriptUrl: string) => {
  try {
    const res = await fetch(`${appScriptUrl}?action=readAll`, {
      method: 'GET',
      redirect: 'follow',
      credentials: 'omit'
    });
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();

    const students: Student[] = data.students || [];
    let attendance: AttendanceRecord[] = data.attendance || [];
    attendance = attendance.map(record => {
      let dStr = record.date;
      if (dStr && typeof dStr === 'string' && dStr.includes('T')) {
        const d = new Date(dStr);
        dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      }
      return { ...record, date: dStr };
    });
    const teachers: Teacher[] = data.teachers || [];
    const holidays: Holiday[] = data.holidays || [];

    return { students, attendance, teachers, holidays };
  } catch (error) {
    console.warn("Error loading data from Apps Script:", error);
    throw error;
  }
};

const sendPostData = async (url: string, action: string, data: any) => {
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      // Send as text/plain to avoid CORS preflight issues with Google Apps Script
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({ action, data })
    });
    // With no-cors, response is opaque. Assume success if fetch didn't throw.
    return { success: true };
  } catch (error) {
    console.warn(`Error saving ${action}:`, error);
    throw error;
  }
};

export const saveStudentsToSheets = async (appScriptUrl: string, students: Student[]) => {
  await sendPostData(appScriptUrl, 'saveStudents', students);
};

export const saveAttendanceToSheets = async (appScriptUrl: string, records: AttendanceRecord[]) => {
  await sendPostData(appScriptUrl, 'saveAttendance', records);
};

export const appendAttendanceToSheet = async (appScriptUrl: string, record: AttendanceRecord) => {
  await sendPostData(appScriptUrl, 'appendAttendance', record);
};

export const saveTeachersToSheets = async (appScriptUrl: string, teachers: Teacher[]) => {
  await sendPostData(appScriptUrl, 'saveTeachers', teachers);
};

export const saveHolidaysToSheets = async (appScriptUrl: string, holidays: Holiday[]) => {
  await sendPostData(appScriptUrl, 'saveHolidays', holidays);
};
