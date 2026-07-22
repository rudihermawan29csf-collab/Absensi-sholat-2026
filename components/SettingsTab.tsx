
import React, { useState, useEffect } from 'react';
import { SchoolConfig, Holiday, Student } from '../types';
import { Settings, Save, Loader2, CalendarRange, BookOpen, CalendarOff, Plus, Trash2, Database, Table } from 'lucide-react';
import { saveSchoolConfig, saveHolidays, deleteHoliday } from '../services/storageService';
import { initAuth, googleSignIn, logout, getAccessToken } from '../services/authService';
import { User } from 'firebase/auth';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface SettingsTabProps {
  config: SchoolConfig;
  setConfig: React.Dispatch<React.SetStateAction<SchoolConfig>>;
  holidays: Holiday[];
  setHolidays: React.Dispatch<React.SetStateAction<Holiday[]>>;
  students: Student[];
}

const SettingsTab: React.FC<SettingsTabProps> = ({ config, setConfig, holidays, setHolidays, students }) => {
  const uniqueClasses = Array.from(new Set(students.map(s => s.className))).sort();
  const [formConfig, setFormConfig] = useState<SchoolConfig>(config);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Sheets State
  const [appScriptUrl, setAppScriptUrl] = useState(localStorage.getItem('APPS_SCRIPT_URL') || '');
  const [sheetsMessage, setSheetsMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (u) => setUser(u),
      () => setUser(null)
    );
    return () => unsubscribe();
  }, []);

  // Holiday State
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayDesc, setNewHolidayDesc] = useState('');
  const [isAddingHoliday, setIsAddingHoliday] = useState(false);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const success = await saveSchoolConfig(formConfig);
    
    if (success) {
      setConfig(formConfig);
      setMessage({ text: 'Pengaturan berhasil disimpan!', type: 'success' });
    } else {
      setMessage({ text: 'Gagal menyimpan pengaturan.', type: 'error' });
    }
    
    setIsSaving(false);
  };

  const handleSaveAppScript = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appScriptUrl.trim()) {
      localStorage.removeItem('APPS_SCRIPT_URL');
      setSheetsMessage({ text: 'Penyimpanan Google Sheets dinonaktifkan.', type: 'success' });
      setTimeout(() => window.location.reload(), 1000);
      return;
    }
    localStorage.setItem('APPS_SCRIPT_URL', appScriptUrl.trim());
    setSheetsMessage({ text: 'Apps Script URL disimpan! Memuat ulang aplikasi...', type: 'success' });
    setTimeout(() => window.location.reload(), 1500);
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) setUser(result.user);
    } catch (err) {
      setSheetsMessage({ text: 'Gagal login ke Google.', type: 'error' });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  const handleAddHoliday = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!newHolidayDate || !newHolidayDesc) return;

      setIsAddingHoliday(true);
      const newHoliday: Holiday = {
          id: `h_${Date.now()}`,
          date: newHolidayDate,
          description: newHolidayDesc
      };

      const updatedHolidays = [...holidays, newHoliday].sort((a,b) => b.date.localeCompare(a.date));
      const success = await saveHolidays(updatedHolidays);

      if(success) {
          setHolidays(updatedHolidays);
          setNewHolidayDate('');
          setNewHolidayDesc('');
      } else {
          alert("Gagal menyimpan hari libur.");
      }
      setIsAddingHoliday(false);
  };

  const handleDeleteHoliday = async (id: string) => {
      if(confirm("Hapus hari libur ini?")) {
          const updated = holidays.filter(h => h.id !== id);
          setHolidays(updated);
          await deleteHoliday(id);
      }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* KOLOM KIRI: PENGATURAN SEKOLAH */}
        <div>
            <h2 className="text-xl font-bold text-amber-500 flex items-center gap-3 font-gaming mb-6 pb-4 border-b border-white/10">
            <Settings className="text-cyan-400" />
            PENGATURAN UMUM
            </h2>
            
            {message && (
                <div className={`mb-6 p-4 rounded-xl border flex items-center justify-center text-sm font-bold ${message.type === 'success' ? 'bg-green-900/30 border-green-500 text-green-400' : 'bg-red-900/30 border-red-500 text-red-400'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSaveConfig} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                            <CalendarRange size={16} className="text-amber-500" />
                            Tahun Pelajaran
                        </label>
                        <input 
                            type="text" 
                            value={formConfig.academicYear}
                            onChange={(e) => setFormConfig({...formConfig, academicYear: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 outline-none focus:border-amber-500 font-mono text-lg text-center"
                            placeholder="Contoh: 2025/2026"
                            required
                        />
                        <p className="text-[10px] text-slate-600 italic text-center">Format: TAHUN/TAHUN (Misal: 2024/2025)</p>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                            <BookOpen size={16} className="text-cyan-500" />
                            Semester Aktif
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormConfig({...formConfig, semester: 'GANJIL'})}
                                className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                                    formConfig.semester === 'GANJIL' 
                                    ? 'bg-amber-600/20 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                                    : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600'
                                }`}
                            >
                                <span className="text-2xl font-bold">I</span>
                                <span className="text-xs uppercase font-bold tracking-widest">GANJIL</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormConfig({...formConfig, semester: 'GENAP'})}
                                className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                                    formConfig.semester === 'GENAP' 
                                    ? 'bg-cyan-600/20 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                                    : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600'
                                }`}
                            >
                                <span className="text-2xl font-bold">II</span>
                                <span className="text-xs uppercase font-bold tracking-widest">GENAP</span>
                            </button>
                        </div>
                    </div>
                </div>


                    <div className="space-y-4 pt-4 border-t border-white/10">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                            <CalendarRange size={16} className="text-pink-500" />
                            Jadwal Sholat Dhuha (Per Kelas)
                        </label>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {uniqueClasses.map(cls => {
                                const activeDays = formConfig.dhuhaSchedule?.[cls] || [];
                                const toggleDay = (dayIndex: number) => {
                                    const newSchedule = { ...(formConfig.dhuhaSchedule || {}) };
                                    if (activeDays.includes(dayIndex)) {
                                        newSchedule[cls] = activeDays.filter(d => d !== dayIndex);
                                    } else {
                                        newSchedule[cls] = [...activeDays, dayIndex].sort();
                                    }
                                    setFormConfig({ ...formConfig, dhuhaSchedule: newSchedule });
                                };
                                return (
                                    <div key={cls} className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                                        <div className="text-white font-bold mb-2">{cls}</div>
                                        <div className="flex flex-wrap gap-2">
                                            {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((dayName, idx) => {
                                                const dayIndex = idx + 1;
                                                const isActive = activeDays.includes(dayIndex);
                                                return (
                                                    <button 
                                                        key={dayIndex} type="button" 
                                                        onClick={() => toggleDay(dayIndex)}
                                                        className={`px-2 py-1 text-[10px] font-bold rounded uppercase transition-all ${isActive ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                                                    >
                                                        {dayName}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                <div className="pt-6 border-t border-white/10">
                    <button type="submit" disabled={isSaving} className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-4 rounded-xl font-bold hover:from-emerald-500 hover:to-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg">
                        {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />} SIMPAN PENGATURAN
                    </button>
                </div>
            </form>
        </div>

        {/* KOLOM KANAN: PENGATURAN HARI LIBUR */}
        <div className="border-t md:border-t-0 md:border-l border-white/10 md:pl-8 pt-8 md:pt-0">
             <h2 className="text-xl font-bold text-pink-500 flex items-center gap-3 font-gaming mb-6 pb-4 border-b border-white/10">
                <CalendarOff className="text-pink-400" />
                HARI LIBUR
            </h2>

            {/* FORM TAMBAH LIBUR */}
            <form onSubmit={handleAddHoliday} className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6 space-y-3">
                 <div className="grid grid-cols-3 gap-3">
                     <div className="col-span-1">
                        <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Tanggal</label>
                        <input 
                            type="date" 
                            required
                            value={newHolidayDate}
                            onChange={e => setNewHolidayDate(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                        />
                     </div>
                     <div className="col-span-2">
                        <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Keterangan</label>
                        <input 
                            type="text" 
                            required
                            placeholder="Contoh: Isra Mi'raj"
                            value={newHolidayDesc}
                            onChange={e => setNewHolidayDesc(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                        />
                     </div>
                 </div>
                 <button type="submit" disabled={isAddingHoliday} className="w-full bg-pink-900/40 text-pink-400 border border-pink-500/30 py-2 rounded-lg text-xs font-bold hover:bg-pink-900/60 transition-all flex justify-center items-center gap-2">
                     {isAddingHoliday ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} TAMBAHKAN HARI LIBUR
                 </button>
            </form>

            {/* LIST HARI LIBUR */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto no-scrollbar">
                <p className="text-[10px] text-slate-500 text-center italic mb-2">* Hari Minggu otomatis terdeteksi sebagai libur.</p>
                {holidays.length === 0 ? (
                    <div className="text-center p-4 text-slate-600 text-xs border border-dashed border-slate-800 rounded-xl">
                        Belum ada hari libur manual.
                    </div>
                ) : (
                    holidays.map(h => (
                        <div key={h.id} className="flex items-center justify-between bg-slate-800/40 border border-slate-700 p-3 rounded-lg group hover:border-pink-500/30 transition-all">
                             <div>
                                 <div className="text-sm font-bold text-slate-200">{h.description}</div>
                                 <div className="text-[10px] text-slate-500 font-mono">
                                    {format(new Date(h.date), 'dd MMMM yyyy', { locale: id })}
                                 </div>
                             </div>
                             <button onClick={() => handleDeleteHoliday(h.id)} className="p-2 text-slate-600 hover:text-red-400 transition-colors">
                                 <Trash2 size={16} />
                             </button>
                        </div>
                    ))
                )}
            </div>
        </div>

      </div>

      {/* KONFIGURASI GOOGLE SHEETS */}
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm max-w-4xl mx-auto mt-8">
         <h2 className="text-xl font-bold text-green-500 flex items-center gap-3 font-gaming mb-6 pb-4 border-b border-white/10">
            <Table className="text-green-400" />
            GOOGLE SHEETS INTEGRATION
         </h2>

         {sheetsMessage && (
            <div className={`mb-6 p-4 rounded-xl border flex items-center justify-center text-sm font-bold ${sheetsMessage.type === 'success' ? 'bg-green-900/30 border-green-500 text-green-400' : 'bg-red-900/30 border-red-500 text-red-400'}`}>
                {sheetsMessage.text}
            </div>
         )}

         <div className="space-y-6">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm text-slate-300">
               <p className="mb-2"><strong>Hubungkan aplikasi ini dengan Google Sheets.</strong> Anda bisa memindahkan semua penyimpanan data ke Spreadsheet menggunakan Google Apps Script.</p>
               <ol className="list-decimal pl-5 space-y-1 text-slate-400 text-xs">
                 <li>Buat file Spreadsheet di Google Drive.</li>
                 <li>Buat 4 sheet: <strong>Students</strong>, <strong>Attendance</strong>, <strong>Teachers</strong>, <strong>Holidays</strong>.</li>
                 <li>Buka menu <strong>Ekstensi &gt; Apps Script</strong> dan masukkan kode API Anda, lalu klik Deploy &gt; Web App.</li>
                 <li>Salin <strong>Web App URL</strong> hasil deploy, dan tempelkan di bawah ini, lalu klik Simpan.</li>
               </ol>
            </div>

            <div className="grid grid-cols-1 items-start">
               <div>
                 <form onSubmit={handleSaveAppScript}>
                   <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-widest">Konfigurasi Web App URL</h3>
                   <div className="space-y-3">
                     <input 
                       type="text" 
                       value={appScriptUrl}
                       onChange={(e) => setAppScriptUrl(e.target.value)}
                       placeholder="Masukkan Web App URL Apps Script..."
                       className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 outline-none focus:border-green-500 font-mono text-sm"
                     />
                     <div className="flex gap-2">
                       <button 
                         type="submit" 
                         className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-green-600 hover:bg-green-500 text-white shadow-lg"
                       >
                         <Database size={18} /> {appScriptUrl ? 'SIMPAN & AKTIFKAN' : 'NONAKTIFKAN'}
                       </button>
                     </div>
                   </div>
                 </form>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SettingsTab;
