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
    const attendance: AttendanceRecord[] = data.attendance || [];
    const teachers: Teacher[] = data.teachers || [];
    const holidays: Holiday[] = data.holidays || [];

    return { students, attendance, teachers, holidays };
  } catch (error) {
    console.error("Error loading data from Apps Script:", error);
    throw error;
  }
};

const sendPostData = async (url: string, action: string, data: any) => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      credentials: 'omit',
      // Send as text/plain to avoid CORS preflight issues with Google Apps Script
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({ action, data })
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.error || 'Failed to save');
    return result;
  } catch (error) {
    console.error(`Error saving ${action}:`, error);
    throw error;
  }
};

export const saveStudentsToSheets = async (appScriptUrl: string, students: Student[]) => {
  await sendPostData(appScriptUrl, 'saveStudents', students);
};

export const saveAttendanceToSheets = async (appScriptUrl: string, records: AttendanceRecord[]) => {
  await sendPostData(appScriptUrl, 'saveAttendance', records);
};

export const saveTeachersToSheets = async (appScriptUrl: string, teachers: Teacher[]) => {
  await sendPostData(appScriptUrl, 'saveTeachers', teachers);
};

export const saveHolidaysToSheets = async (appScriptUrl: string, holidays: Holiday[]) => {
  await sendPostData(appScriptUrl, 'saveHolidays', holidays);
};
