const fs = require('fs');
let content = fs.readFileSync('components/SettingsTab.tsx', 'utf8');

const newSection = `
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
                                                        className={\`px-2 py-1 text-[10px] font-bold rounded uppercase transition-all \${isActive ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'}\`}
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
`;

content = content.replace(
  "                <div className=\"pt-6 border-t border-white/10\">\n                    <button type=\"submit\"",
  newSection + "\n                <div className=\"pt-6 border-t border-white/10\">\n                    <button type=\"submit\""
);

fs.writeFileSync('components/SettingsTab.tsx', content);
console.log('patched SettingsTab.tsx');
