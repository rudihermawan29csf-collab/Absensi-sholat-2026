
import { Student, Teacher, SchoolConfig } from './types';

// URL Google Apps Script Anda
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxncH3dZ6Sc_bRieNlumJ6WLQyOkT2Jagmxq_S0FExaHT7dM4wlesgoYSoTx3P9CQdDyg/exec";

export const INITIAL_CONFIG: SchoolConfig = {
  academicYear: '2025/2026',
  semester: 'GANJIL',
  dhuhaSchedule: {}
};

// DATA SISWA LENGKAP (Sample dipulihkan untuk IX A - IX G)
export const INITIAL_STUDENTS: Student[] = [
  // KELAS IX A
  { id: '1129', className: 'IX A', name: 'ABEL AULIA PASA RAMADANI', gender: 'P' },
  { id: '1132', className: 'IX A', name: 'ADITYA FIRMANSYAH', gender: 'L' },
  { id: '1133', className: 'IX A', name: 'AHMAD DANI', gender: 'L' },
  { id: '1141', className: 'IX A', name: 'ANDINI PUTRI', gender: 'P' },
  { id: '1142', className: 'IX A', name: 'BAGAS KARADENAN', gender: 'L' },
  
  // KELAS IX B
  { id: '1134', className: 'IX B', name: 'ALYA NUR AZIZAH', gender: 'P' },
  { id: '1135', className: 'IX B', name: 'BINTANG RAMADHAN', gender: 'L' },
  { id: '1143', className: 'IX B', name: 'CANTIKA SARI', gender: 'P' },
  { id: '1144', className: 'IX B', name: 'DIMAS ANGGARA', gender: 'L' },

  // KELAS IX C
  { id: '1136', className: 'IX C', name: 'CHAIRUL ANAM', gender: 'L' },
  { id: '1137', className: 'IX C', name: 'DEWI SARTIKA', gender: 'P' },
  { id: '1145', className: 'IX C', name: 'FAJAR SHODIQ', gender: 'L' },
  { id: '1146', className: 'IX C', name: 'GITA GUTAW', gender: 'P' },

  // KELAS IX D
  { id: '1138', className: 'IX D', name: 'EKO PRASETYO', gender: 'L' },
  { id: '1139', className: 'IX D', name: 'FITRIANI', gender: 'P' },
  { id: '1147', className: 'IX D', name: 'HENDRA SETIAWAN', gender: 'L' },
  { id: '1148', className: 'IX D', name: 'INDAH PERMATASARI', gender: 'P' },

  // KELAS IX E
  { id: '1140', className: 'IX E', name: 'GALIH RAKASWI', gender: 'L' },
  { id: '1149', className: 'IX E', name: 'JOKO TINGKIR', gender: 'L' },
  { id: '1150', className: 'IX E', name: 'KARTIKA PUTRI', gender: 'P' },

  // KELAS IX F
  { id: '1151', className: 'IX F', name: 'LUKMAN HAKIM', gender: 'L' },
  { id: '1152', className: 'IX F', name: 'MAWAR MELATI', gender: 'P' },
  { id: '1153', className: 'IX F', name: 'NANDA SAPUTRA', gender: 'L' },

  // KELAS IX G
  { id: '1154', className: 'IX G', name: 'OPICK TOMBOATI', gender: 'L' },
  { id: '1155', className: 'IX G', name: 'PUTRI SALJU', gender: 'P' },
  { id: '1156', className: 'IX G', name: 'QOMARUDDIN', gender: 'L' }
];

export const INITIAL_TEACHERS: Teacher[] = [
  { id: 't1', name: "Dra. Sri Hayati" },
  { id: 't2', name: "Bakhtiar Rifai, SE" },
  { id: 't3', name: "Moch. Husain Rifai Hamzah, S.Pd." },
  { id: 't4', name: "Rudi Hermawan, S.Pd.I" },
  { id: 't5', name: "Okha Devi Anggraini, S.Pd." },
  { id: 't6', name: "Eka Hariyati, S. Pd." },
  { id: 't7', name: "Mikoe Wahyudi Putra, ST., S. Pd." },
  { id: 't8', name: "Purnadi, S. Pd." },
  { id: 't9', name: "Israfin Maria Ulfa, S.Pd" },
  { id: 't10', name: "Syadam Budi Satrianto, S.Pd" },
  { id: 't11', name: "Rebby Dwi Prataopu, S.Si" },
  { id: 't12', name: "Mukhamad Yunus, S.Pd" },
  { id: 't13', name: "Fahmi Wahyuni, S.Pd" },
  { id: 't14', name: "Fakhita Madury, S.Sn" },
  { id: 't15', name: "Retno Nawangwulan, S. Pd." },
  { id: 't16', name: "Emilia Kartika Sari, S.Pd" },
  { id: 't17', name: "Akhmad Hariadi, S.Pd" }
];

export const STORAGE_KEYS = {
  STUDENTS: 'smpn3pacet_students_cache',
  TEACHERS: 'smpn3pacet_teachers_cache',
  ATTENDANCE: 'smpn3pacet_attendance_cache',
  AUTH: 'smpn3pacet_auth_session',
  CONFIG: 'smpn3pacet_school_config',
  HOLIDAYS: 'smpn3pacet_holidays_cache'
};
