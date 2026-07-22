
export interface Student {
  id: string; // Will store NIS
  name: string;
  className: string;
  gender?: 'L' | 'P'; // Laki-laki / Perempuan (Optional now)
  parentPhone?: string; // Optional: Nomor WA Orang Tua (format 628xxx)
}

export interface Teacher {
  id: string;
  name: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  operatorName?: string; // Nama Guru yang melakukan scan
  status?: 'PRESENT' | 'HAID'; // Status kehadiran
  type?: 'DHUHUR' | 'DHUHA';
}

export interface SchoolConfig {
  academicYear: string; // e.g., "2024/2025"
  semester: 'GANJIL' | 'GENAP';
  dhuhaSchedule?: Record<string, number[]>; // class -> array of day indices (1=Mon, 2=Tue, etc.)
}

export interface Holiday {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
}

export type TabView = 'dashboard' | 'scan' | 'students' | 'teachers' | 'reports' | 'settings';
export type UserRole = 'ADMIN' | 'TEACHER' | 'PARENT';

export enum ReportPeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  SEMESTER = 'SEMESTER'
}
