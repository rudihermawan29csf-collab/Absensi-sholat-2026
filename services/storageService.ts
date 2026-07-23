
import { Student, AttendanceRecord, Teacher, SchoolConfig, Holiday } from '../types';
import { INITIAL_STUDENTS, INITIAL_TEACHERS, INITIAL_CONFIG, STORAGE_KEYS, GOOGLE_SCRIPT_URL } from '../constants';
import { db, isFirebaseConfigured } from './firebase';
import { loadAllDataFromSheets, saveStudentsToSheets, saveAttendanceToSheets, appendAttendanceToSheet, saveTeachersToSheets, saveHolidaysToSheets } from './sheetsService';
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  addDoc, 
  query, 
  orderBy, 
  deleteDoc, 
  updateDoc,
  where,
  limit,
  getDoc
} from 'firebase/firestore';

// Nama Koleksi di Database
const COLL_STUDENTS = 'students';
const COLL_TEACHERS = 'teachers';
const COLL_ATTENDANCE = 'attendance';
const COLL_CONFIG = 'config';
const COLL_HOLIDAYS = 'holidays';
const DOC_SCHOOL_CONFIG = 'school_settings';

// --- HELPER UNTUK SHEETS ---
const isSheetsEnabled = () => {
  return !!GOOGLE_SCRIPT_URL;
};
const getSheetId = () => GOOGLE_SCRIPT_URL;


// --- HOLIDAY SERVICE ---

export const getHolidays = async (): Promise<Holiday[]> => {
  if (!isFirebaseConfigured) {
    const stored = localStorage.getItem(STORAGE_KEYS.HOLIDAYS);
    return stored ? JSON.parse(stored) : [];
  }

  try {
    const querySnapshot = await getDocs(collection(db, COLL_HOLIDAYS));
    const holidays: Holiday[] = [];
    querySnapshot.forEach((doc) => {
      holidays.push(doc.data() as Holiday);
    });
    
    // Sort by date desc
    holidays.sort((a, b) => b.date.localeCompare(a.date));

    localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(holidays));
    return holidays;
  } catch (e) {
    console.warn("Error fetching holidays, falling back to local storage:", e.message);
    const stored = localStorage.getItem(STORAGE_KEYS.HOLIDAYS);
    return stored ? JSON.parse(stored) : [];
  }
};

export const saveHolidays = async (holidays: Holiday[]): Promise<boolean> => {
  localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(holidays));

  if (isSheetsEnabled()) {
    try {
      await saveHolidaysToSheets(getSheetId(), holidays);
    } catch (e) {
      console.warn("Error saving holidays to Sheets:", e);
    }
  }

  if (!isFirebaseConfigured) return true;

  try {
      // Simple strategy: We loop through local array. 
      // For a proper sync we should handle deletes, but for now we rely on the App logic 
      // where we pass the full list. Ideally, we should deleteDoc for removed items.
      
      // Let's just upsert for now.
      const promises = holidays.map(h => {
        return setDoc(doc(db, COLL_HOLIDAYS, h.id), h);
      });
      await Promise.all(promises);
      return true;
  } catch (error) {
    console.warn("Error saving holidays, data only saved locally:", error.message);
    return false;
  }
};

export const deleteHoliday = async (id: string): Promise<boolean> => {
   // Update local
   const stored = localStorage.getItem(STORAGE_KEYS.HOLIDAYS);
   if (stored) {
     const list = JSON.parse(stored) as Holiday[];
     const filtered = list.filter(h => h.id !== id);
     localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(filtered));

     if (isSheetsEnabled()) {
        try {
           await saveHolidaysToSheets(getSheetId(), filtered);
        } catch (e) {
           console.warn("Error deleting holiday in Sheets:", e);
        }
     }
   }

   if (!isFirebaseConfigured) return true;

   try {
     await deleteDoc(doc(db, COLL_HOLIDAYS, id));
     return true;
   } catch (e) {
     console.warn("Error deleting holiday:", e.message);
     return false;
   }
};

// --- CONFIG SERVICE ---

export const getSchoolConfig = async (): Promise<SchoolConfig> => {
  if (!isFirebaseConfigured) {
    const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return stored ? JSON.parse(stored) : INITIAL_CONFIG;
  }

  try {
    const docRef = doc(db, COLL_CONFIG, DOC_SCHOOL_CONFIG);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const config = docSnap.data() as SchoolConfig;
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
      return config;
    } else {
      return INITIAL_CONFIG;
    }
  } catch (e) {
    console.warn("Error fetching config, falling back to local storage:", e.message);
    const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return stored ? JSON.parse(stored) : INITIAL_CONFIG;
  }
};

export const saveSchoolConfig = async (config: SchoolConfig): Promise<boolean> => {
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));

  if (!isFirebaseConfigured) return true;

  try {
    await setDoc(doc(db, COLL_CONFIG, DOC_SCHOOL_CONFIG), config);
    return true;
  } catch (error) {
    console.warn("Error saving config, data only saved locally:", error.message);
    return false;
  }
};

// --- STUDENTS SERVICE ---

export const getStudents = async (): Promise<Student[]> => {
  // Jika Firebase belum dikonfigurasi, gunakan Local Storage saja
  if (!isFirebaseConfigured) {
    const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return stored ? JSON.parse(stored) : INITIAL_STUDENTS;
  }

  try {
    const querySnapshot = await getDocs(collection(db, COLL_STUDENTS));
    const students: Student[] = [];
    
    querySnapshot.forEach((doc) => {
      students.push(doc.data() as Student);
    });

    if (students.length === 0) {
      return INITIAL_STUDENTS;
    }

    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    return students;
  } catch (e) {
    console.warn("Error fetching students from Firebase, falling back to local storage:", e.message);
    const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return stored ? JSON.parse(stored) : INITIAL_STUDENTS;
  }
};

export const saveStudents = async (students: Student[]): Promise<boolean> => {
  // Selalu simpan ke local storage agar UI responsif instan
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));

  if (isSheetsEnabled()) {
    try {
      await saveStudentsToSheets(getSheetId(), students);
    } catch (e: any) {
      console.warn("Error saving to Sheets:", e);
      alert("Gagal menyimpan ke Google Sheets (Data Siswa): " + e.message);
    }
  }

  if (!isFirebaseConfigured) {
    console.warn("Firebase belum dikonfigurasi. Data hanya tersimpan di browser ini.");
    return true;
  }

  try {
    const promises = students.map(student => {
      const safeStudent = {
         id: student.id || '',
         name: student.name || '',
         className: student.className || 'Unknown',
         gender: student.gender || 'L',
         parentPhone: student.parentPhone || null
      };
      return setDoc(doc(db, COLL_STUDENTS, safeStudent.id), safeStudent);
    });
    await Promise.all(promises);
    return true;
  } catch (error: any) {
    console.warn("Error saving students to Firebase, data only saved locally:", error.message);
    return false;
  }
};

export const deleteStudent = async (id: string): Promise<boolean> => {
  // Update local storage first
  let updatedStudents: Student[] = [];
  const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  if (stored) {
    try {
      updatedStudents = JSON.parse(stored).filter((s: Student) => s.id !== id);
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedStudents));
    } catch (e) {}
  }

  if (isSheetsEnabled()) {
    try {
      await saveStudentsToSheets(getSheetId(), updatedStudents);
    } catch (e) {
      console.warn("Error deleting in Sheets:", e);
    }
  }

  if (!isFirebaseConfigured) {
    return true;
  }

  try {
    await deleteDoc(doc(db, COLL_STUDENTS, id));
    return true;
  } catch (e) {
    console.warn("Error deleting student:", (e as Error).message);
    return false;
  }
};

export const deleteStudentsByClass = async (className: string): Promise<boolean> => {
  let updatedStudents: Student[] = [];
  const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  if (stored) {
    try {
      updatedStudents = JSON.parse(stored).filter((s: Student) => s.className !== className);
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedStudents));
    } catch (e) {}
  }

  if (isSheetsEnabled()) {
    try {
      await saveStudentsToSheets(getSheetId(), updatedStudents);
    } catch (e) {
      console.warn("Error deleting in Sheets:", e);
    }
  }

  if (!isFirebaseConfigured) {
    return true;
  }

  try {
    const q = query(collection(db, COLL_STUDENTS), where('className', '==', className));
    const querySnapshot = await getDocs(q);
    const promises = querySnapshot.docs.map(document => deleteDoc(document.ref));
    await Promise.all(promises);
    return true;
  } catch (e) {
    console.warn("Error deleting students by class:", (e as Error).message);
    return false;
  }
};

// --- TEACHERS SERVICE ---

export const getTeachers = async (): Promise<Teacher[]> => {
  if (!isFirebaseConfigured) {
    const stored = localStorage.getItem(STORAGE_KEYS.TEACHERS);
    return stored ? JSON.parse(stored) : INITIAL_TEACHERS;
  }

  try {
    const querySnapshot = await getDocs(collection(db, COLL_TEACHERS));
    const teachers: Teacher[] = [];
    
    querySnapshot.forEach((doc) => {
      teachers.push(doc.data() as Teacher);
    });

    if (teachers.length === 0) {
      return INITIAL_TEACHERS;
    }

    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
    return teachers;
  } catch (e) {
    console.warn("Error fetching teachers, falling back to local storage:", e.message);
    const stored = localStorage.getItem(STORAGE_KEYS.TEACHERS);
    return stored ? JSON.parse(stored) : INITIAL_TEACHERS;
  }
};

export const saveTeachers = async (teachers: Teacher[]): Promise<boolean> => {
  localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));

  if (isSheetsEnabled()) {
    try {
      await saveTeachersToSheets(getSheetId(), teachers);
    } catch (e) {
      console.warn("Error saving teachers to Sheets:", e);
    }
  }

  if (!isFirebaseConfigured) return true;

  try {
    const promises = teachers.map(teacher => {
      return setDoc(doc(db, COLL_TEACHERS, teacher.id), teacher);
    });
    await Promise.all(promises);
    return true;
  } catch (error: any) {
    console.warn("Error saving teachers, data only saved locally:", error.message);
    return false;
  }
};

export const deleteTeacher = async (id: string): Promise<boolean> => {
  let updatedTeachers: Teacher[] = [];
  const stored = localStorage.getItem(STORAGE_KEYS.TEACHERS);
  if (stored) {
    updatedTeachers = JSON.parse(stored) as Teacher[];
    updatedTeachers = updatedTeachers.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(updatedTeachers));
  }

  if (isSheetsEnabled()) {
    try {
      await saveTeachersToSheets(getSheetId(), updatedTeachers);
    } catch (e) {
      console.warn("Error deleting teacher in Sheets:", e);
    }
  }

  if (!isFirebaseConfigured) return true;

  try {
    await deleteDoc(doc(db, COLL_TEACHERS, id));
    return true;
  } catch (e: any) {
    console.warn("Error deleting teacher:", e.message);
    return false;
  }
};


// --- ATTENDANCE SERVICE ---

export const getAttendance = async (): Promise<AttendanceRecord[]> => {
  if (!isFirebaseConfigured) {
    const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return stored ? JSON.parse(stored) : [];
  }

  try {
    const q = query(collection(db, COLL_ATTENDANCE), orderBy('timestamp', 'desc'), limit(2000));
    const querySnapshot = await getDocs(q);
    
    const records: AttendanceRecord[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as AttendanceRecord;
      records.push({ ...data, id: doc.id });
    });

    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
    return records;
  } catch (e) {
    console.warn("Error fetching attendance, falling back to local storage:", e.message);
    const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return stored ? JSON.parse(stored) : [];
  }
};

export const deleteAttendanceRecord = async (id: string): Promise<boolean> => {
  // Update local cache manually
  const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
  if (stored) {
      const records = JSON.parse(stored) as AttendanceRecord[];
      const filtered = records.filter(r => r.id !== id);
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(filtered));

      if (isSheetsEnabled()) {
        try {
          await saveAttendanceToSheets(getSheetId(), filtered);
        } catch (e) {
          console.warn("Error deleting attendance in Sheets:", e);
        }
      }
  }

  if (!isFirebaseConfigured) return true;

  try {
    await deleteDoc(doc(db, COLL_ATTENDANCE, id));
    return true;
  } catch (e) {
    console.warn("Error deleting:", e.message);
    return false;
  }
};

export const updateAttendanceStatus = async (id: string, newStatus: 'PRESENT' | 'HAID'): Promise<boolean> => {
  // Update local cache
  const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
  if (stored) {
      const records = JSON.parse(stored) as AttendanceRecord[];
      const index = records.findIndex(r => r.id === id);
      if (index !== -1) {
          records[index].status = newStatus;
          localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));

          if (isSheetsEnabled()) {
             try {
                await saveAttendanceToSheets(getSheetId(), records);
             } catch (e) {
                console.warn("Error updating attendance in Sheets:", e);
             }
          }
      }
  }

  if (!isFirebaseConfigured) return true;

  try {
    const recordRef = doc(db, COLL_ATTENDANCE, id);
    await updateDoc(recordRef, { status: newStatus });
    return true;
  } catch (e) {
    console.warn("Error updating:", e.message);
    return false;
  }
};

export const addAttendanceRecordToSheet = async (
  student: Student, 
  operatorName: string, 
  status: 'PRESENT' | 'HAID' = 'PRESENT',
  type: 'DHUHUR' | 'DHUHA' = 'DHUHUR'
): Promise<{ success: boolean; message: string; record?: AttendanceRecord }> => {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
  const cachedRecords: AttendanceRecord[] = stored ? JSON.parse(stored) : [];
  
  if (cachedRecords.some((r) => r.studentId === student.id && r.date === today && (r.type || 'DHUHUR') === type)) {
    return { success: false, message: `${student.name} sudah absen hari ini.` };
  }

  // Buat ID sementara jika offline, atau biarkan Firestore generate nanti
  const offlineId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const newRecord: AttendanceRecord = {
    id: offlineId, // Temporary ID
    studentId: student.id || 'N/A',
    studentName: student.name || 'Unknown',
    className: student.className || 'Unknown',
    date: today,
    timestamp: Date.now(),
    operatorName: operatorName || 'System',
    status: status || 'PRESENT',
    type: type
  };

  // Update Local Storage SEGERA
  const updatedRecords = [newRecord, ...cachedRecords];
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(updatedRecords));

  if (isSheetsEnabled()) {
    appendAttendanceToSheet(getSheetId(), newRecord).catch(e => {
      console.warn("Error saving attendance to Sheets:", e);
    });
  }

  if (!isFirebaseConfigured) {
    return { 
      success: true, 
      message: `${newRecord.studentName} berhasil ABSEN (Mode Offline).`,
      record: newRecord 
    };
  }

  // Async upload to Firestore to avoid blocking UI
  (async () => {
    try {
      const { id, ...recordData } = newRecord;
      const safeRecordData = JSON.parse(JSON.stringify(recordData));
      const docRef = await addDoc(collection(db, COLL_ATTENDANCE), safeRecordData);
      
      // Update ID in local storage when Firestore is done
      const storedAfter = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      if (storedAfter) {
          const recs = JSON.parse(storedAfter) as AttendanceRecord[];
          const finalRecord = { ...newRecord, id: docRef.id };
          const fixedRecords = recs.map(r => r.id === offlineId ? finalRecord : r);
          localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(fixedRecords));
      }
    } catch (error: any) {
      console.warn("Error adding attendance, data only saved locally:", error.message);
    }
  })();

  return { 
    success: true, 
    message: `${newRecord.studentName} berhasil ABSEN.`,
    record: newRecord 
  };
};
