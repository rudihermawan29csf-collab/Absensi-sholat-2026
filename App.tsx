
import React, { useState, useEffect } from 'react';
// Fix: Removed incorrect import from 'lucide-center' which doesn't exist.
import { Shield as ShieldIcon, Users as UsersIcon, QrCode as QrCodeIcon, Trophy as TrophyIcon, LogOut as LogOutIcon, User as UserIcon, Home as HomeIcon, Loader2 as LoaderIcon, RefreshCw as RefreshCwIcon, AlertTriangle, ClipboardCheck, UserCheck, Briefcase, Settings } from 'lucide-react';
import ScannerTab from './components/ScannerTab';
import StudentList from './components/StudentList';
import TeacherList from './components/TeacherList';
import SettingsTab from './components/SettingsTab';
import Reports from './components/Reports';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { Student, AttendanceRecord, TabView, UserRole, Teacher, SchoolConfig, Holiday } from './types';
import { getStudents, getAttendance, getTeachers, getSchoolConfig, getHolidays } from './services/storageService';
import { STORAGE_KEYS, INITIAL_STUDENTS, INITIAL_TEACHERS, INITIAL_CONFIG, GOOGLE_SCRIPT_URL } from './constants';
import { isFirebaseConfigured } from './services/firebase';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('TEACHER');
  const [parentStudentData, setParentStudentData] = useState<Student | null>(null);

  const [activeTab, setActiveTab] = useState<TabView>('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>(INITIAL_CONFIG);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Inisialisasi dari Local Storage (Sangat Cepat)
  useEffect(() => {
    const localStuds = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    const localTeachers = localStorage.getItem(STORAGE_KEYS.TEACHERS);
    const localRecs = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    const localConfig = localStorage.getItem(STORAGE_KEYS.CONFIG);
    const localHolidays = localStorage.getItem(STORAGE_KEYS.HOLIDAYS);
    
    // Validasi data lokal siswa
    if (localStuds) {
      try {
        const parsed = JSON.parse(localStuds);
        if (Array.isArray(parsed) && parsed.length > 0) setStudents(parsed);
        else setStudents(INITIAL_STUDENTS);
      } catch (e) { setStudents(INITIAL_STUDENTS); }
    } else { setStudents(INITIAL_STUDENTS); }

    // Validasi data lokal guru
    if (localTeachers) {
      try {
        const parsed = JSON.parse(localTeachers);
        if (Array.isArray(parsed) && parsed.length > 0) setTeachers(parsed);
        else setTeachers(INITIAL_TEACHERS);
      } catch (e) { setTeachers(INITIAL_TEACHERS); }
    } else { setTeachers(INITIAL_TEACHERS); }

    if (localRecs) setRecords(JSON.parse(localRecs));

    // Validasi Config
    if (localConfig) {
      try {
        setSchoolConfig(JSON.parse(localConfig));
      } catch (e) { setSchoolConfig(INITIAL_CONFIG); }
    }

    if (localHolidays) {
      try { setHolidays(JSON.parse(localHolidays)); } catch (e) { setHolidays([]); }
    }

    const sessionAuth = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (sessionAuth) {
      try {
        const parsedAuth = JSON.parse(sessionAuth);
        setCurrentUser(parsedAuth.username);
        setUserRole(parsedAuth.role);
        if (parsedAuth.role === 'PARENT' && parsedAuth.studentData) {
            setParentStudentData(parsedAuth.studentData);
            setActiveTab('reports');
        }
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem(STORAGE_KEYS.AUTH);
      }
    }
    
    // Auto sync sekali saat startup di background
    syncFullData();
  }, []);

  const syncFullData = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const sheetId = GOOGLE_SCRIPT_URL;
      if (sheetId) {
        // Load from sheets
        const { loadAllDataFromSheets } = await import('./services/sheetsService');
        const sheetsData = await loadAllDataFromSheets(sheetId);
        
        if (sheetsData.students.length > 0) setStudents(sheetsData.students);
        if (sheetsData.teachers.length > 0) setTeachers(sheetsData.teachers);
        if (sheetsData.attendance.length > 0) setRecords(sheetsData.attendance);
        if (sheetsData.holidays.length > 0) setHolidays(sheetsData.holidays);
        
        // Simpan ke local storage (Hanya timpa jika ada data, agar tidak hilang jika terhapus)
        if (sheetsData.students.length > 0) localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(sheetsData.students));
        if (sheetsData.teachers.length > 0) localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(sheetsData.teachers));
        if (sheetsData.attendance.length > 0) localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(sheetsData.attendance));
        if (sheetsData.holidays.length > 0) localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(sheetsData.holidays));
      } else {
        const [studentData, teacherData, attendanceData, configData, holidayData] = await Promise.all([
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
        
        setRecords(attendanceData);
      }
    } catch (error: any) {
      console.warn("Sync error, continuing with local data:", error.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRecordUpdate = () => {
    const localRecs = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (localRecs) {
        setRecords(JSON.parse(localRecs));
    }
  };

  const handleLogin = (username: string, role: UserRole, studentData?: Student) => {
    const authData = { username, role, studentData };
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authData));
    setCurrentUser(username);
    setUserRole(role);
    setParentStudentData(studentData || null);
    setIsAuthenticated(true);
    if (role === 'PARENT') setActiveTab('reports');
    else setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    setIsAuthenticated(false);
    setCurrentUser('');
    setUserRole('TEACHER');
    setParentStudentData(null);
    setActiveTab('dashboard');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} students={students} teachers={teachers} />;
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden text-slate-200">
      <div className="fixed inset-0 z-0 bg-[#0f172a]">
        <div className="absolute top-0 left-0 w-full h-96 bg-blue-900/20 blur-[100px] rounded-full mix-blend-screen"></div>
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <header className="relative z-50 pt-6 px-4 pb-4">
        {!isFirebaseConfigured && (
            <div className="max-w-5xl mx-auto mb-4 bg-amber-900/80 border border-amber-500/50 p-3 rounded-xl flex items-center gap-3 animate-pulse">
                <AlertTriangle className="text-amber-400" />
                <div className="text-xs text-amber-100">
                    <strong>Mode Offline Aktif:</strong> Firebase belum dikonfigurasi. Edit file <code>services/firebase.ts</code> dengan API Key Anda untuk mengaktifkan sinkronisasi online.
                </div>
            </div>
        )}
        <div className="max-w-5xl mx-auto flex items-center gap-6 border-b border-white/10 pb-6 bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-md rounded-2xl shadow-xl px-6 py-4 border-t border-white/5 relative">
          <div className="relative group shrink-0">
             <div className="absolute -inset-4 bg-gradient-to-r from-amber-600 to-amber-600 rounded-full blur-xl opacity-40 group-hover:opacity-80 transition duration-1000"></div>
             <div className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-b from-amber-400 to-amber-700 shadow-2xl">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                   <img src="https://iili.io/fEhQpTX.png" alt="Logo" className="w-full h-full object-contain p-2" />
                </div>
             </div>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 font-gaming truncate">
              SMPN 3 PACET
            </h1>
            <div className="flex flex-wrap gap-2 mt-1">
               <button 
                  onClick={syncFullData}
                  disabled={isSyncing}
                  className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase border border-cyan-500/30 px-2 py-1 rounded bg-cyan-950/30 text-cyan-400 hover:bg-cyan-500/20 transition-all"
               >
                 {isSyncing ? <RefreshCwIcon size={10} className="animate-spin" /> : <RefreshCwIcon size={10} />}
                 {isSyncing ? 'SYNCING...' : 'REFRESH DATABASE'}
               </button>
            </div>
          </div>

          <button onClick={handleLogout} className="p-2 text-red-400 bg-red-900/20 rounded-lg border border-red-500/20 active:scale-90 transition-transform">
              <LogOutIcon size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 relative z-10">
        <div className="animate-fade-in">
          {activeTab === 'dashboard' && userRole !== 'PARENT' && <Dashboard students={students} records={records} config={schoolConfig} />}
          
          {/* TAB GURU: Manual Absen */}
          {activeTab === 'scan' && userRole === 'TEACHER' && (
            <ScannerTab students={students} records={records} onRecordUpdate={handleRecordUpdate} currentUser={currentUser} userRole={userRole} schoolConfig={schoolConfig} />
          )}
          
          {/* TAB ADMIN: Data Siswa */}
          {activeTab === 'students' && userRole === 'ADMIN' && <StudentList students={students} setStudents={setStudents} />}
          
          {/* TAB ADMIN: Data Guru */}
          {activeTab === 'teachers' && userRole === 'ADMIN' && <TeacherList teachers={teachers} setTeachers={setTeachers} />}

          {/* TAB ADMIN: Settings */}
          {activeTab === 'settings' && userRole === 'ADMIN' && <SettingsTab config={schoolConfig} setConfig={setSchoolConfig} holidays={holidays} setHolidays={setHolidays} students={students} />}
          
          {activeTab === 'reports' && <Reports records={records} students={students} onRecordUpdate={handleRecordUpdate} viewOnlyStudent={parentStudentData} holidays={holidays} />}
        </div>
      </main>

      {userRole !== 'PARENT' && (
        <nav className="fixed bottom-0 left-0 right-0 z-40">
          <div className="max-w-xl mx-auto flex justify-center items-end pb-4 gap-2 md:gap-6">
             <button onClick={() => setActiveTab('dashboard')} className={`group flex flex-col items-center transition-all w-16 ${activeTab === 'dashboard' ? '-translate-y-2 scale-110' : 'opacity-70'}`}>
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl transform rotate-45 border-2 ${activeTab === 'dashboard' ? 'bg-slate-800 border-amber-400' : 'bg-slate-900 border-slate-700'}`}>
                  <HomeIcon size={22} className={`transform -rotate-45 ${activeTab === 'dashboard' ? 'text-amber-400' : 'text-slate-400'}`} />
                </div>
             </button>
             
             {userRole === 'TEACHER' && (
                <button onClick={() => setActiveTab('scan')} className={`group flex flex-col items-center transition-all w-16 ${activeTab === 'scan' ? '-translate-y-2 scale-110' : 'opacity-70'}`}>
                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl transform rotate-45 border-2 ${activeTab === 'scan' ? 'bg-slate-800 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'bg-slate-900 border-slate-700'}`}>
                      <UserCheck size={22} className={`transform -rotate-45 ${activeTab === 'scan' ? 'text-cyan-400' : 'text-slate-400'}`} />
                    </div>
                </button>
             )}

             {userRole === 'ADMIN' && (
               <>
               <button onClick={() => setActiveTab('students')} className={`group flex flex-col items-center transition-all w-16 ${activeTab === 'students' ? '-translate-y-2 scale-110' : 'opacity-70'}`}>
                  <div className={`w-12 h-12 flex items-center justify-center rounded-xl transform rotate-45 border-2 ${activeTab === 'students' ? 'bg-slate-800 border-amber-400' : 'bg-slate-900 border-slate-700'}`}>
                    <UsersIcon size={22} className={`transform -rotate-45 ${activeTab === 'students' ? 'text-amber-400' : 'text-slate-400'}`} />
                  </div>
               </button>
               <button onClick={() => setActiveTab('teachers')} className={`group flex flex-col items-center transition-all w-16 ${activeTab === 'teachers' ? '-translate-y-2 scale-110' : 'opacity-70'}`}>
                  <div className={`w-12 h-12 flex items-center justify-center rounded-xl transform rotate-45 border-2 ${activeTab === 'teachers' ? 'bg-slate-800 border-cyan-400' : 'bg-slate-900 border-slate-700'}`}>
                    <Briefcase size={22} className={`transform -rotate-45 ${activeTab === 'teachers' ? 'text-cyan-400' : 'text-slate-400'}`} />
                  </div>
               </button>
               <button onClick={() => setActiveTab('settings')} className={`group flex flex-col items-center transition-all w-16 ${activeTab === 'settings' ? '-translate-y-2 scale-110' : 'opacity-70'}`}>
                  <div className={`w-12 h-12 flex items-center justify-center rounded-xl transform rotate-45 border-2 ${activeTab === 'settings' ? 'bg-slate-800 border-pink-400' : 'bg-slate-900 border-slate-700'}`}>
                    <Settings size={22} className={`transform -rotate-45 ${activeTab === 'settings' ? 'text-pink-400' : 'text-slate-400'}`} />
                  </div>
               </button>
               </>
             )}
             
             <button onClick={() => setActiveTab('reports')} className={`group flex flex-col items-center transition-all w-16 ${activeTab === 'reports' ? '-translate-y-2 scale-110' : 'opacity-70'}`}>
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl transform rotate-45 border-2 ${activeTab === 'reports' ? 'bg-slate-800 border-amber-400' : 'bg-slate-900 border-slate-700'}`}>
                  <TrophyIcon size={22} className={`transform -rotate-45 ${activeTab === 'reports' ? 'text-amber-400' : 'text-slate-400'}`} />
                </div>
             </button>
          </div>
        </nav>
      )}
    </div>
  );
}

export default App;
