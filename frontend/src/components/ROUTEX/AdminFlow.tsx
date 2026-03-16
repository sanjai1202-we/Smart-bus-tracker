"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Key, Bell, LogOut, Bus, Map as MapIcon, ShieldAlert, CheckCircle2, Copy, Send, Settings, Eye, Info } from 'lucide-react';
import { GlassPanel, PrimaryButton, MeshBackground } from './Primitives';
import toast from 'react-hot-toast';

export default function AdminFlow({ onLogout }: any) {
  const [screen, setScreen] = useState<'dashboard' | 'generate' | 'notifications'>('dashboard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  const generateCode = (e: any) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedCode("");
    
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedCode("BUS008");
      toast.success("Identity Key Serialized");
    }, 2500);
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'COMMAND' },
    { id: 'generate', icon: Key, label: 'INITIALIZE' },
    { id: 'notifications', icon: Bell, label: 'ALERTS' }
  ];

  return (
    <div className="relative min-h-screen bg-routex-dark text-white p-6 md:p-10">
      <MeshBackground variant={screen === 'dashboard' ? 'indigo' : screen === 'generate' ? 'teal' : 'red'} />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-50 mix-blend-overlay" />
      
      {/* Sidebar / Top Nav */}
      <nav className="fixed bottom-0 left-0 right-0 md:top-10 md:left-10 md:bottom-10 md:w-20 bg-white/5 backdrop-blur-2xl border-t md:border border-white/10 rounded-t-[30px] md:rounded-[30px] z-50 flex md:flex-col items-center justify-around py-6 overflow-hidden">
        <div className="hidden md:flex flex-col items-center mb-10 opacity-50">
           <Bus className="w-8 h-8 text-routex-primary" />
        </div>
        
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id as any)}
            className={`relative p-4 md:p-5 rounded-2xl transition-all ${screen === item.id ? 'bg-routex-primary/20 text-white border border-routex-primary/40' : 'text-routex-textMuted hover:text-white'}`}
          >
            <item.icon className="w-6 h-6" />
            <span className="hidden md:block absolute left-24 px-4 py-2 bg-black/80 rounded-xl text-[10px] uppercase font-black tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">{item.label}</span>
          </button>
        ))}

        <button onClick={onLogout} className="mt-auto p-4 md:p-5 text-routex-danger hover:bg-routex-danger/10 rounded-2xl transition-all">
          <LogOut className="w-6 h-6" />
        </button>
      </nav>

      <main className="md:pl-32 pb-24 md:pb-0">
        <header className="flex justify-between items-center mb-12">
           <div>
             <h1 className="text-5xl font-display tracking-[0.2em] mb-2 uppercase">{screen}</h1>
             <p className="text-[10px] text-routex-textMuted uppercase tracking-widest font-black opacity-60">ADMIN PORTAL / COLLEGE TRANSIT OPS</p>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold uppercase tracking-widest">SYSTEM OVERWATCH</span>
                <span className="text-[9px] text-routex-teal uppercase font-black tracking-[.3em] font-mono">STATUS: OPTIMAL ●</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                 <Settings className="w-6 h-6 text-white/50" />
              </div>
           </div>
        </header>

        <AnimatePresence mode="wait">
          {screen === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="space-y-8">
               {/* Stat Cards */}
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Fleet', value: '12', color: 'text-routex-primary', icon: Bus },
                    { label: 'Live Signals', value: '07', color: 'text-routex-teal', icon: Navigation, pulse: true },
                    { label: 'Manifest Count', value: '284', color: 'text-routex-primary', icon: CheckCircle2 },
                    { label: 'Active Alerts', value: '03', color: 'text-routex-danger', icon: ShieldAlert }
                  ].map((stat, i) => (
                    <GlassPanel key={i} className="group relative overflow-hidden border-white/5">
                       <div className="absolute top-0 left-0 w-1 h-full bg-routex-primary/30" />
                       <div className="flex justify-between items-start mb-4">
                          <stat.icon className={`w-6 h-6 ${stat.color} ${stat.pulse ? 'animate-pulse' : ''}`} />
                          <span className="text-[9px] font-black text-white/30 tracking-widest">+12% / 24H</span>
                       </div>
                       <h3 className="text-4xl font-mono font-bold tracking-tighter mb-1">{stat.value}</h3>
                       <p className="text-[10px] text-routex-textMuted uppercase font-black tracking-widest">{stat.label}</p>
                    </GlassPanel>
                  ))}
               </div>

               {/* Fleet Map */}
               <GlassPanel className="h-[500px] p-0 overflow-hidden relative grayscale contrast-125 brightness-50">
                  <div className="w-full h-full bg-slate-900/50 flex flex-col items-center justify-center">
                     <div className="relative">
                        <span className="text-white/10 font-display text-[15vw] select-none">FLEET MAP</span>
                        {/* Simulated Bus Dots */}
                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute top-[20%] left-[30%] w-4 h-4 bg-routex-teal rounded-full shadow-[0_0_20px_rgba(6,239,197,1)]" />
                        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-[60%] right-[40%] w-4 h-4 bg-routex-teal rounded-full shadow-[0_0_20px_rgba(6,239,197,1)]" />
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute bottom-[20%] left-[50%] w-4 h-4 bg-routex-primary rounded-full shadow-[0_0_20px_rgba(79,70,229,1)]" />
                     </div>
                  </div>
                  <div className="absolute top-6 left-6 z-10 flex gap-2">
                     {['LIVE ONLY', 'ALL BUSES', 'HISTORY'].map(filter => (
                        <button key={filter} className="px-4 py-2 bg-black/60 border border-white/10 rounded-xl text-[9px] font-black tracking-widest hover:border-routex-primary transition-all uppercase">{filter}</button>
                     ))}
                  </div>
               </GlassPanel>

               {/* Bus List */}
               <GlassPanel className="p-8">
                  <div className="flex justify-between items-center mb-8">
                     <h3 className="text-2xl font-display font-bold tracking-widest uppercase">Fleet Inventory</h3>
                     <div className="flex gap-4">
                        <button className="text-[10px] font-black uppercase tracking-widest text-routex-textMuted hover:text-white transition-all">Export CVS</button>
                        <button className="text-[10px] font-black uppercase tracking-widest text-routex-primary">Refresh Cluster</button>
                     </div>
                  </div>
                  <div className="overflow-x-auto overflow-y-hidden">
                     <table className="w-full text-left">
                        <thead className="border-b border-white/10">
                           <tr className="text-[10px] text-white/40 uppercase font-black tracking-[0.3em]">
                              <th className="pb-4 pr-12">BUS ID</th>
                              <th className="pb-4">ROUTE VECTOR</th>
                              <th className="pb-4">COMMANDER</th>
                              <th className="pb-4">STATUS</th>
                              <th className="pb-4 text-right">CAPACITY</th>
                           </tr>
                        </thead>
                        <tbody>
                           {[
                             { id: 'BUS007', route: 'ANNA NAGAR → SVC', driver: 'RAJAN KUMAR', status: 'LIVE', color: 'text-routex-teal' },
                             { id: 'BUS002', route: 'KOYAMBEDU → SVC', driver: 'AMIT SINGH', status: 'DELAYED', color: 'text-routex-amber' },
                             { id: 'BUS009', route: 'VADAPALANI → SVC', driver: 'KARAN MEHRA', status: 'LIVE', color: 'text-routex-teal' },
                             { id: 'BUS012', route: 'KK NAGAR → SVC', driver: 'NEHA SHARMA', status: 'INACTIVE', color: 'text-white/20' }
                           ].map((bus, i) => (
                             <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                                <td className="py-6 font-mono text-xs font-bold tracking-widest">{bus.id}</td>
                                <td className="py-6 text-[10px] font-black uppercase tracking-widest opacity-70">{bus.route}</td>
                                <td className="py-6 text-[10px] font-black uppercase tracking-widest opacity-70">{bus.driver}</td>
                                <td className="py-6">
                                   <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${bus.color}`}>
                                      <span className={`w-1.5 h-1.5 rounded-full bg-current ${bus.status !== 'INACTIVE' ? 'animate-pulse' : ''}`} />
                                      {bus.status}
                                   </div>
                                </td>
                                <td className="py-6 text-right">
                                   <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 rounded-lg">
                                      <Eye className="w-4 h-4 text-white/50" />
                                   </button>
                                </td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </GlassPanel>
            </motion.div>
          )}

          {screen === 'generate' && (
            <motion.div key="gen" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex justify-center items-start pt-10">
               <GlassPanel className="w-full max-w-2xl p-12">
                  <header className="mb-12">
                     <h3 className="text-3xl font-display tracking-widest uppercase mb-2">INITIALIZE NEW ROUTE</h3>
                     <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Generate dynamic authentication vector for driver deployment</p>
                  </header>

                  <form onSubmit={generateCode} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                     <div className="space-y-6">
                        <InputGroup label="BUS IDENTIFICATION" placeholder="TN 01 AB 1234" />
                        <InputGroup label="ORIGIN VECTOR" placeholder="LOCATION A" />
                        <InputGroup label="DESTINATION" placeholder="LOCATION B" />
                     </div>
                     <div className="space-y-6">
                        <InputGroup label="ASSIGNED COMMANDER" placeholder="DRIVER NAME" />
                        <InputGroup label="CONTACT FREQUENCY" placeholder="+91 XXXXX XXXXX" />
                        <div className="grid grid-cols-2 gap-4">
                           <InputGroup label="CAPACITY" placeholder="40" />
                           <InputGroup label="ETA START" placeholder="07:30 AM" />
                        </div>
                     </div>
                     
                     <div className="md:col-span-2 pt-6">
                        <PrimaryButton disabled={isGenerating} type="submit" variant="teal">
                          {isGenerating ? 'SERIALIZING NODE...' : 'GENERATE VECTOR CODE'}
                        </PrimaryButton>
                     </div>
                  </form>

                  <AnimatePresence>
                     {generatedCode && (
                       <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-8 bg-routex-teal/10 border border-routex-teal/30 rounded-3xl text-center">
                          <p className="text-[10px] text-routex-teal uppercase font-black tracking-[0.4em] mb-4">DEPLOYMENT ACCESS CODE</p>
                          <div className="flex justify-center items-center gap-6 mb-8">
                             {generatedCode.split('').map((char, i) => (
                               <motion.div 
                                 key={i}
                                 initial={{ rotateX: 90 }}
                                 animate={{ rotateX: 0 }}
                                 transition={{ delay: i * 0.1, duration: 0.5, type: 'spring' }}
                                 className="w-16 h-20 bg-routex-dark border-2 border-routex-teal/40 rounded-xl flex items-center justify-center text-4xl font-mono text-white"
                               >
                                 {char}
                               </motion.div>
                             ))}
                          </div>
                          <div className="flex justify-center gap-4">
                             <button onClick={() => toast.success("Copied to Clipboard")} className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                               <Copy className="w-4 h-4" /> COPY
                             </button>
                             <button onClick={() => toast.success("Transmitted via Secure SMS")} className="flex items-center gap-2 px-6 py-3 bg-routex-teal/20 border border-routex-teal/40 rounded-xl text-[10px] font-black uppercase tracking-widest text-routex-teal hover:bg-routex-teal/30 transition-all">
                               <Send className="w-4 h-4" /> SHARE TO DRIVER
                             </button>
                          </div>
                       </motion.div>
                     )}
                  </AnimatePresence>
               </GlassPanel>
            </motion.div>
          )}

          {screen === 'notifications' && (
            <motion.div key="notif" initial={{ opacity: 0, filter: 'blur(20px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0 }} className="space-y-6">
               <div className="flex gap-4 mb-4">
                  {['ALL', 'SOS', 'MISSED', 'RESOLVED'].map(tab => (
                    <button key={tab} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] hover:border-routex-primary transition-all">{tab}</button>
                  ))}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[
                    { type: 'SOS', user: 'Priya Sharma', bus: 'BUS007', stop: 'Anna Nagar Loop', time: '14:31 PM', urgent: true },
                    { type: 'MISSED', user: 'Arjun Mehra', bus: 'BUS007', stop: 'Koyambedu Hub', time: '14:35 PM', urgent: false },
                    { type: 'STATUS', user: 'Rajan Kumar', bus: 'BUS007', info: 'Route Half Completed', time: '14:40 PM', urgent: false }
                  ].map((alert, i) => (
                    <GlassPanel key={i} className={`p-8 border-l-4 ${alert.type === 'SOS' ? 'border-routex-danger' : alert.type === 'MISSED' ? 'border-routex-amber' : 'border-routex-teal'}`}>
                       <div className="flex justify-between items-start mb-6">
                          <span className={`px-2 py-1 rounded text-[8px] font-black tracking-widest ${alert.type === 'SOS' ? 'bg-routex-danger/20 text-routex-danger' : alert.type === 'MISSED' ? 'bg-routex-amber/20 text-routex-amber' : 'bg-routex-teal/20 text-routex-teal'}`}>{alert.type} ALERT</span>
                          <span className="text-[10px] font-mono text-white/30">{alert.time}</span>
                       </div>
                       <h4 className="text-xl font-display tracking-widest mb-1 uppercase">{alert.user}</h4>
                       <p className="text-[9px] text-routex-textMuted uppercase tracking-widest mb-6">{alert.bus} / {alert.stop || alert.info}</p>
                       <div className="flex gap-3">
                          <button onClick={() => toast.success("Marked as Resolved")} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">RESOLVE</button>
                          <button className="p-3 bg-routex-primary/20 border border-routex-primary/30 rounded-xl"><Info className="w-4 h-4 text-routex-primary" /></button>
                       </div>
                    </GlassPanel>
                  ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function InputGroup({ label, placeholder, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] text-white/40 uppercase font-black tracking-widest ml-1">{label}</label>
      <input 
        type={type} 
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-routex-teal/30 transition-all text-xs font-bold uppercase tracking-widest placeholder-white/10"
      />
    </div>
  );
}

function Navigation(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
  )
}
