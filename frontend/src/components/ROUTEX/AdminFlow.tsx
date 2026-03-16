"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bus, Users, Activity, AlertTriangle, Map as MapIcon, 
  PlusCircle, Bell, ChevronDown, CheckCircle, Clock, 
  Settings, LogOut, Search, Smartphone, ShieldAlert, Navigation
} from 'lucide-react';
import { GlassPanel, PrimaryButton, MeshBackground, FloatingInput } from './Primitives';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

export default function AdminFlow({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'generate' | 'notifications'>('dashboard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const stats = [
    { label: 'Total Fleet', value: 12, icon: Bus, color: 'var(--primary)' },
    { label: 'Live Now', value: 7, icon: Activity, color: 'var(--live)', pulse: true },
    { label: 'Students', value: 284, icon: Users, color: 'var(--primary)' },
    { label: 'Alerts', value: 3, icon: AlertTriangle, color: 'var(--alert)' },
  ];

  const fleet = [
    { id: 'BUS007', driver: 'Rajan Kumar', route: 'Anna Nagar → College', status: 'live', boarded: 32, capacity: 40 },
    { id: 'BUS102', driver: 'Suresh Raina', route: 'Koyambedu → College', status: 'live', boarded: 28, capacity: 40 },
    { id: 'BUS045', driver: 'M.S. Dhoni', route: 'Vadapalani → College', status: 'delayed', boarded: 15, capacity: 40 },
    { id: 'BUS099', driver: 'Virat Kohli', route: 'Ashok Nagar → College', status: 'inactive', boarded: 0, capacity: 40 },
  ];

  const notifications = [
    { id: 1, type: 'sos', student: 'Priya Sharma', location: 'Anna Nagar Stop', time: '7:38 AM', bus: 'BUS007', status: 'active' },
    { id: 2, type: 'missed', student: 'Rahul Dravid', location: 'Koyambedu', time: '7:42 AM', bus: 'BUS102', status: 'active' },
  ];

  const generateCode = (e: any) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedCode(null);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedCode('BUS007');
      toast.success("Identity Key Serialized");
    }, 2000);
  };

  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row bg-[var(--bg-base)] overflow-hidden">
      <MeshBackground />
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex w-72 bg-[var(--bg-elevated)]/50 backdrop-blur-3xl border-r border-[var(--border-glass)] flex-col z-50">
        <div className="p-8 pb-12">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center font-bold">R</div>
            <span className="font-['Clash_Display',sans-serif] font-bold tracking-[0.2em] text-xl">ROUTEX</span>
          </div>
          
          <nav className="space-y-4">
            {[
              { id: 'dashboard', icon: LayoutIcon, label: 'COMMAND' },
              { id: 'generate', icon: PlusCircle, label: 'INITIALIZE' },
              { id: 'notifications', icon: Bell, label: 'ALERTS', badge: 3 },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${activeTab === item.id ? 'bg-[var(--primary)] text-white shadow-[0_0_20px_var(--primary-glow)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-glass)] hover:text-[var(--text-primary)]'}`}
              >
                <div className="flex items-center gap-4">
                  <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                </div>
                {item.id === 'notifications' && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${activeTab === 'notifications' ? 'bg-white text-[var(--primary)]' : 'bg-[var(--alert)] text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-[var(--border-glass)]">
          <button onClick={onLogout} className="w-full flex items-center gap-3 p-4 rounded-2xl text-[var(--alert)] hover:bg-[var(--alert)]/10 transition-all font-bold text-[10px] uppercase tracking-widest">
            <LogOut className="w-5 h-5" />
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-12 scrollbar-hide z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
              <header className="flex justify-between items-end">
                <div>
                  <h2 className="text-4xl font-['Clash_Display',sans-serif] font-bold tracking-tight uppercase">Mission Control</h2>
                  <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.4em] mt-2 opacity-60">Admin Portal / College Transit Ops</p>
                </div>
                <div className="hidden sm:flex items-center gap-4 bg-[var(--bg-glass)] p-1 rounded-full border border-[var(--border-glass)]">
                   <div className="px-4 py-2 bg-[var(--primary)] rounded-full text-[10px] font-bold uppercase tracking-widest text-white">Live View</div>
                   <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">History</div>
                </div>
              </header>

              {/* Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                  <GlassPanel key={s.label} className="group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[var(--primary)] opacity-30" />
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 rounded-2xl bg-[var(--bg-glass)] border border-[var(--border-glass)] group-hover:border-[var(--primary)] transition-colors">
                        <s.icon className={`w-6 h-6 ${s.pulse ? 'animate-pulse' : ''}`} style={{ color: s.color }} />
                      </div>
                      <span className="text-[9px] font-black text-[var(--text-secondary)] opacity-30 tracking-widest">+12% / 24H</span>
                    </div>
                    <h3 className="text-5xl font-['Clash_Display',sans-serif] font-bold tracking-tighter" style={{ color: s.color }}>{s.value}</h3>
                    <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.3em] font-bold">{s.label}</p>
                  </GlassPanel>
                ))}
              </div>

              {/* Fleet Map */}
              <GlassPanel className="h-[500px] p-0 overflow-hidden relative">
                 <div className="absolute top-6 left-6 z-[100] flex gap-2">
                    {['LIVE ONLY', 'ALL BUSES', 'HISTORY'].map(f => (
                       <button key={f} className="px-4 py-2 bg-[var(--bg-elevated)]/80 border border-[var(--border-glass)] rounded-xl text-[9px] font-black tracking-widest hover:border-[var(--primary)] transition-all uppercase">{f}</button>
                    ))}
                 </div>
                 <MapComponent isGlobal />
              </GlassPanel>

              {/* Bus List */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h3 className="text-xl font-['Clash_Display',sans-serif] font-bold uppercase tracking-widest">Fleet Inventory</h3>
                   <div className="relative w-64">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                      <input type="text" placeholder="SEARCH CLUSTER..." className="w-full bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-xl py-2 pl-12 pr-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-[var(--primary)]" />
                   </div>
                </div>
                <GlassPanel className="!p-0 overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-[var(--bg-glass)] text-[9px] font-black uppercase tracking-widest border-b border-[var(--border-glass)] text-[var(--text-secondary)]">
                         <tr>
                            <th className="px-8 py-4">BUS ID</th>
                            <th className="px-8 py-4">ROUTE VECTOR</th>
                            <th className="px-8 py-4">COMMANDER</th>
                            <th className="px-8 py-4">STATUS</th>
                            <th className="px-8 py-4 text-right">LOAD VECTOR</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-glass)]">
                         {fleet.map((bus) => (
                            <tr key={bus.id} className="group hover:bg-[var(--primary)]/[0.03] transition-colors cursor-pointer capitalize">
                               <td className="px-8 py-6 font-mono font-bold text-[var(--text-primary)]">{bus.id}</td>
                               <td className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">{bus.route}</td>
                               <td className="px-8 py-6 text-sm">{bus.driver}</td>
                               <td className="px-8 py-6">
                                  <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${bus.status === 'live' ? 'bg-[var(--live)]/10 border-[var(--live)] text-[var(--live)]' : bus.status === 'delayed' ? 'bg-[var(--warning)]/10 border-[var(--warning)] text-[var(--warning)]' : 'bg-gray-500/10 border-gray-500 text-gray-500'}`}>
                                     {bus.status}
                                  </span>
                               </td>
                               <td className="px-8 py-6">
                                  <div className="flex items-center justify-end gap-3">
                                     <div className="w-24 h-1 bg-[var(--bg-glass)] rounded-full overflow-hidden border border-[var(--border-glass)]">
                                        <div className="h-full bg-[var(--primary)]" style={{ width: `${(bus.boarded/bus.capacity)*100}%` }} />
                                     </div>
                                     <span className="text-[10px] font-mono font-bold text-[var(--text-primary)]">{bus.boarded}/{bus.capacity}</span>
                                  </div>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </GlassPanel>
              </div>
            </motion.div>
          )}

          {activeTab === 'generate' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-6xl mx-auto pt-10">
               <div className="lg:col-span-3">
                  <h2 className="text-4xl font-['Clash_Display',sans-serif] font-bold tracking-tight mb-4 uppercase">Initialize Route</h2>
                  <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.4em] mb-12 opacity-60">Generate dynamic authentication vector</p>
                  
                  <GlassPanel className="p-12 space-y-8">
                     <form onSubmit={generateCode} className="space-y-8">
                        <div className="grid grid-cols-2 gap-8">
                           <FloatingInput label="BUS NUMBER" icon={Bus} value="BUS007" />
                           <FloatingInput label="CAPACITY" icon={Users} value="40" />
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                           <FloatingInput label="ORIGIN VECTOR" icon={MapIcon} value="Anna Nagar" />
                           <FloatingInput label="TERMINAL NODE" icon={CheckCircle} value="College Gate" />
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                           <FloatingInput label="CHRONOS VECTOR" icon={Clock} value="07:30 AM" />
                           <FloatingInput label="ASSIGN COMMANDER" icon={Users} value="Rajan Kumar" />
                        </div>
                        
                        <PrimaryButton loading={isGenerating}>
                           Initialize Transit Matrix
                        </PrimaryButton>
                     </form>
                  </GlassPanel>
               </div>

               <div className="lg:col-span-2">
                  <AnimatePresence mode="wait">
                     {generatedCode ? (
                       <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-full flex flex-col items-center justify-center space-y-10">
                          <header className="text-center">
                             <h3 className="text-xl font-['Clash_Display',sans-serif] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-2">Transit Token</h3>
                             <div className="w-12 h-1 bg-[var(--primary)] mx-auto rounded-full" />
                          </header>
                          
                          <div className="flex gap-2">
                             {generatedCode.split('').map((char, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ rotateX: 90 }}
                                  animate={{ rotateX: 0 }}
                                  transition={{ delay: 0.1 * i, duration: 0.5, type: 'spring' }}
                                  className="w-16 h-20 glass-panel !p-0 flex items-center justify-center text-4xl font-mono font-bold text-[var(--primary)] shadow-[0_0_30px_var(--primary-glow)]"
                                >
                                   {char}
                                </motion.div>
                             ))}
                          </div>

                          <div className="flex flex-col gap-4 w-full px-12">
                             <button onClick={() => toast.success("Vector Copied")} className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl glass-panel text-[10px] font-bold uppercase tracking-widest hover:border-[var(--primary)] transition-all">Copy Vector</button>
                             <button onClick={() => toast.success("Satellite Uplink Complete")} className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-[var(--primary)] text-white text-[10px] font-bold uppercase tracking-widest shadow-xl">Transmit to Driver</button>
                          </div>
                       </motion.div>
                     ) : (
                       <div className="h-full flex flex-col items-center justify-center text-center opacity-20 grayscale border-2 border-dashed border-[var(--border-glass)] rounded-[40px] p-12">
                          <Smartphone className="w-16 h-16 mb-6 mx-auto" />
                          <p className="text-[10px] uppercase tracking-[0.4em] font-bold">Awaiting Transmission Matrix</p>
                       </div>
                     )}
                  </AnimatePresence>
               </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto space-y-8 pt-10">
               <div className="flex justify-between items-center mb-12">
                  <h2 className="text-4xl font-['Clash_Display',sans-serif] font-bold tracking-tight uppercase">System Alerts</h2>
                  <div className="flex gap-3">
                     <button className="px-6 py-3 bg-[var(--primary)] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl">Active</button>
                     <button className="px-6 py-3 glass-panel !py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Resolved</button>
                  </div>
               </div>

               <div className="space-y-6">
                  {notifications.map((n) => (
                    <GlassPanel key={n.id} className={`!p-10 border-l-4 ${n.type === 'sos' ? 'border-l-[var(--alert)] bg-[var(--alert)]/5' : 'border-l-[var(--warning)] bg-[var(--warning)]/5'}`}>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-8">
                             <div className={`p-6 rounded-[32px] ${n.type === 'sos' ? 'bg-[var(--alert)]/10 text-[var(--alert)]' : 'bg-[var(--warning)]/10 text-[var(--warning)]'}`}>
                                {n.type === 'sos' ? <ShieldAlert className="w-10 h-10" /> : <Clock className="w-10 h-10" />}
                             </div>
                             <div>
                                <div className="flex items-center gap-4 mb-2">
                                   <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${n.type === 'sos' ? 'bg-[var(--alert)] text-white' : 'bg-[var(--warning)] text-white'}`}>
                                      {n.type === 'sos' ? 'CRITICAL' : 'WARNING'}
                                   </span>
                                   <span className="text-[10px] text-[var(--text-secondary)] font-mono">{n.time}</span>
                                </div>
                                <h3 className="text-3xl font-bold mb-1">{n.student}</h3>
                                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.4em] font-bold">{n.location} • {n.bus}</p>
                             </div>
                          </div>
                          <div className="flex flex-col gap-3">
                             <button className="px-8 py-3 bg-[var(--bg-elevated)] rounded-xl text-[10px] font-black uppercase tracking-widest border border-[var(--border-glass)] hover:border-[var(--primary)] transition-all">Acknowledge</button>
                             <button className="px-8 py-3 bg-[var(--primary)] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Intercept Driver</button>
                          </div>
                       </div>
                    </GlassPanel>
                  ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-elevated)]/80 backdrop-blur-3xl border-t border-[var(--border-glass)] p-6 flex justify-around z-50">
         <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'}><LayoutIcon className="w-6 h-6" /></button>
         <button onClick={() => setActiveTab('generate')} className={activeTab === 'generate' ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'}><PlusCircle className="w-6 h-6" /></button>
         <button onClick={() => setActiveTab('notifications')} className={activeTab === 'notifications' ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'}><Bell className="w-6 h-6" /></button>
         <button onClick={onLogout} className="text-[var(--alert)]"><LogOut className="w-6 h-6" /></button>
      </nav>

      {/* Cinematic Vignette */}
      <div className="fixed inset-0 pointer-events-none z-[100] shadow-[inset_0_0_150px_rgba(0,0,0,0.4)]" />
    </div>
  );
}

function LayoutIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}
