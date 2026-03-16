"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, PlusCircle, Bell, ShieldAlert, Bus, Users, MapPin, Search, ChevronRight, Share2, Copy, CheckCircle, Database } from 'lucide-react';
import { GlassCard, AnimatedButton } from './Shared';
import toast from 'react-hot-toast';

export default function AdminFlow({ onLogout }: any) {
  const [activeTab, setActiveTab] = useState<'dash' | 'generate' | 'notifs'>('dash');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  // Mock Stats
  const stats = [
    { label: 'Fleet Total', val: 24, icon: Bus, color: 'text-routex-primary' },
    { label: 'Active Now', val: 12, icon: MapPin, color: 'text-routex-success' },
    { label: 'Boarded Students', val: 540, icon: Users, color: 'text-routex-cyan' },
    { label: 'Emergency Alerts', val: 2, icon: ShieldAlert, color: 'text-routex-danger' }
  ];

  const busList = [
    { no: 'BUS001', route: 'Campus Outer', driver: 'S. Kumaar', status: 'LIVE', students: 42 },
    { no: 'BUS007', route: 'Main Loop', driver: 'R. Rajan', status: 'LIVE', students: 38 },
    { no: 'BUS012', route: 'City Link', driver: 'P. Singh', status: 'INACTIVE', students: 0 },
    { no: 'BUS015', route: 'Suburban S.', driver: 'A. Rahul', status: 'DELAYED', students: 25 },
  ];

  const handleGenerateCode = () => {
    setIsGenerating(true);
    setGeneratedCode(null);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedCode("RX740B");
      toast.success("Bus Initialized ✓");
    }, 2000);
  };

  return (
    <div className="relative w-full h-[100dvh] bg-routex-bg overflow-hidden font-body text-white flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-20 bg-black/40 backdrop-blur-3xl border-b md:border-b-0 md:border-r border-white/10 flex md:flex-col items-center py-4 md:py-8 justify-between z-50">
         <div className="flex md:flex-col items-center gap-8 px-6 md:px-0">
            <div className="w-12 h-12 bg-routex-primary rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(91,78,255,0.4)]">
               <Bus className="w-7 h-7 text-white" />
            </div>
            
            <div className="flex md:flex-col gap-6">
               <button onClick={() => setActiveTab('dash')} className={`p-3 rounded-xl transition-all ${activeTab === 'dash' ? 'bg-white/10 text-white' : 'text-routex-textMuted hover:text-white'}`}>
                  <LayoutDashboard className="w-6 h-6" />
               </button>
               <button onClick={() => setActiveTab('generate')} className={`p-3 rounded-xl transition-all ${activeTab === 'generate' ? 'bg-white/10 text-white' : 'text-routex-textMuted hover:text-white'}`}>
                  <PlusCircle className="w-6 h-6" />
               </button>
               <button onClick={() => setActiveTab('notifs')} className={`p-3 rounded-xl transition-all ${activeTab === 'notifs' ? 'bg-white/10 text-white relative' : 'text-routex-textMuted hover:text-white'}`}>
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-routex-danger rounded-full shadow-[0_0_10px_#FF4E4E]" />
               </button>
            </div>
         </div>
         
         <button onClick={onLogout} className="px-6 md:px-0 text-routex-danger opacity-40 hover:opacity-100 transition-all">
            <LogOut className="w-6 h-6" />
         </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-12 relative">
         <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-routex-primary/5 blur-[150px] pointer-events-none" />
         
         <header className="mb-12">
            <p className="text-[10px] text-routex-textMuted font-black uppercase tracking-[0.5em] mb-2">Command Center Dashboard</p>
            <h1 className="text-5xl font-display tracking-widest uppercase">
               System {activeTab === 'dash' ? 'Intelligence' : activeTab === 'generate' ? 'Deployment' : 'Alerts'}
            </h1>
         </header>

         <AnimatePresence mode="wait">
            
            {/* Tab 1: Dashboard */}
            {activeTab === 'dash' && (
               <motion.div key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                     {stats.map((stat, i) => (
                        <motion.div 
                           key={stat.label} 
                           initial={{ opacity: 0, y: 20 }} 
                           animate={{ opacity: 1, y: 0 }} 
                           transition={{ delay: i * 0.1 }}
                        >
                           <GlassCard className="p-6">
                              <stat.icon className={`w-8 h-8 mb-4 ${stat.color} opacity-40`} />
                              <h3 className="text-4xl font-display tracking-tight mb-1">{stat.val}</h3>
                              <p className="text-[10px] text-routex-textMuted uppercase font-black tracking-widest">{stat.label}</p>
                           </GlassCard>
                        </motion.div>
                     ))}
                  </div>

                  {/* Main Command Surface */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     {/* Map Column */}
                     <div className="lg:col-span-2 space-y-6">
                        <GlassCard className="h-[400px] relative overflow-hidden group">
                           <div className="absolute inset-0 opacity-40 bg-[url('https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png')] bg-cover" />
                           <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end">
                              <div>
                                 <h4 className="text-lg font-display tracking-wide">Deployment Clusters</h4>
                                 <p className="text-xs text-routex-textMuted">Live positional stream synced with Redis PubSub</p>
                              </div>
                              <button className="bg-white/5 p-3 rounded-xl border border-white/10 text-white/40">Enter Command Center Panel</button>
                           </div>
                           {/* Simulated Bus Dots */}
                           <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute top-1/4 left-1/3 w-4 h-4 bg-routex-success rounded-full shadow-[0_0_20px_#00E87A] border-2 border-white" />
                           <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-routex-success rounded-full shadow-[0_0_20px_#00E87A] border-2 border-white" />
                           <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-gray-500 rounded-full border-2 border-white/20" />
                        </GlassCard>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <GlassCard className="p-6 border-routex-cyan/20 bg-routex-cyan/5">
                              <h4 className="text-xs uppercase font-black tracking-widest text-routex-cyan mb-4">Traffic Optimization</h4>
                              <p className="text-sm font-medium mb-6">AI detected congestion on Route A. Generating reroute tokens for all active drivers.</p>
                              <AnimatedButton className="!py-3 !text-[10px] bg-routex-cyan text-black">Force Reroute Protocol</AnimatedButton>
                           </GlassCard>
                           <GlassCard className="p-6 border-routex-primary/20 bg-routex-primary/5">
                              <h4 className="text-xs uppercase font-black tracking-widest text-routex-primary mb-4">System Health</h4>
                              <div className="flex items-end justify-between">
                                 <div className="flex gap-1">
                                    {[20, 40, 60, 30, 80, 50, 90].map((h, i) => (
                                       <div key={i} className="w-1.5 bg-routex-primary opacity-40 rounded-full" style={{ height: h + '%' }} />
                                    ))}
                                 </div>
                                 <span className="text-2xl font-mono text-routex-primary">99.9%</span>
                              </div>
                           </GlassCard>
                        </div>
                     </div>

                     {/* List Column */}
                     <div className="space-y-6">
                        <header className="flex justify-between items-center">
                           <h3 className="text-sm font-black uppercase tracking-[0.2em]">Fleet Monitor</h3>
                           <div className="flex bg-white/5 rounded-lg p-1">
                             <input type="text" placeholder="SEARCH BUS" className="bg-transparent text-[10px] px-3 font-mono outline-none w-24" />
                             <Search className="w-4 h-4 text-routex-textMuted" />
                           </div>
                        </header>
                        
                        <div className="space-y-3">
                           {busList.map((bus, i) => (
                              <motion.div key={bus.no} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
                                 <GlassCard className="p-4 hover:border-white/20 transition-all cursor-pointer group">
                                    <div className="flex justify-between items-center">
                                       <div className="flex items-center gap-3">
                                          <div className={`w-2 h-2 rounded-full ${bus.status === 'LIVE' ? 'bg-routex-success shadow-[0_0_10px_#00E87A]' : 'bg-routex-textMuted opacity-20'}`} />
                                          <div>
                                             <p className="text-[10px] text-routex-textMuted font-black uppercase tracking-widest">{bus.no}</p>
                                             <p className="text-sm font-bold tracking-tight">{bus.route}</p>
                                          </div>
                                       </div>
                                       <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between">
                                       <span className="text-[9px] text-routex-textMuted uppercase font-black tracking-widest">Boarded: {bus.students}</span>
                                       <span className="text-[9px] text-routex-textMuted uppercase font-black tracking-widest">DR: {bus.driver}</span>
                                    </div>
                                 </GlassCard>
                              </motion.div>
                           ))}
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* Tab 2: Generate Code */}
            {activeTab === 'generate' && (
               <motion.div key="generate" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-xl">
                  <GlassCard className="p-12">
                     <div className="space-y-8">
                        <div>
                           <label className="text-[10px] text-routex-textMuted uppercase font-black tracking-[0.2em] mb-4 block">Registration Data</label>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <input type="text" placeholder="BUS NUMBER (e.g. TN-01-AB)" className="bg-white/5 border border-white/10 px-5 py-4 rounded-2xl w-full outline-none focus:border-routex-primary transition-all font-bold tracking-widest uppercase text-xs" />
                              <input type="text" placeholder="DRIVER NAME" className="bg-white/5 border border-white/10 px-5 py-4 rounded-2xl w-full outline-none focus:border-routex-primary transition-all font-bold tracking-widest uppercase text-xs" />
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <input type="text" placeholder="FROM ORIGIN" className="bg-white/5 border border-white/10 px-5 py-4 rounded-2xl w-full outline-none focus:border-routex-primary transition-all font-bold uppercase text-xs" />
                           <input type="text" placeholder="DESTINATION" className="bg-white/5 border border-white/10 px-5 py-4 rounded-2xl w-full outline-none focus:border-routex-primary transition-all font-bold uppercase text-xs" />
                        </div>

                        <div className="flex gap-6 items-end">
                           <div className="flex-1">
                              <label className="text-[10px] text-routex-textMuted uppercase font-black tracking-[0.2em] mb-2 block">Payload Capacity</label>
                              <div className="bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between p-2">
                                 <button className="w-10 h-10 bg-white/5 rounded-xl text-xl">−</button>
                                 <span className="text-lg font-mono font-bold">40</span>
                                 <button className="w-10 h-10 bg-white/5 rounded-xl text-xl">+</button>
                              </div>
                           </div>
                           <AnimatedButton onClick={handleGenerateCode} className="flex-1 !py-4" disabled={isGenerating}>
                              {isGenerating ? "Executing..." : "Initialize Route"}
                           </AnimatedButton>
                        </div>

                        <AnimatePresence>
                           {generatedCode && (
                              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="pt-8 border-t border-white/5">
                                 <div className="bg-routex-primary/10 border border-routex-primary/30 p-8 rounded-3xl flex flex-col items-center">
                                    <p className="text-[10px] text-routex-primary font-black uppercase tracking-[0.4em] mb-6 animate-pulse">Session Access Code Generated</p>
                                    <h2 className="text-8xl font-mono font-black tracking-[0.2em] text-white flex items-center gap-1">
                                       {generatedCode.split('').map((char, i) => (
                                          <motion.span 
                                             key={i} 
                                             initial={{ rotateX: 90 }} 
                                             animate={{ rotateX: 0 }} 
                                             transition={{ delay: 0.5 + i * 0.1, duration: 0.5, type: 'spring' }}
                                          >
                                             {char}
                                          </motion.span>
                                       ))}
                                    </h2>
                                    <div className="mt-8 flex gap-4 w-full">
                                       <button className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all">
                                          <Copy className="w-4 h-4" /> Copy ID
                                       </button>
                                       <button className="flex-1 bg-routex-primary py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                          <Share2 className="w-4 h-4" /> Share to DR
                                       </button>
                                    </div>
                                 </div>
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </div>
                  </GlassCard>
               </motion.div>
            )}

            {/* Tab 3: Notifications */}
            {activeTab === 'notifs' && (
               <motion.div key="notifs" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-2xl space-y-4">
                  {[
                     { type: 'SOS', student: 'Amit R.', bus: 'BUS007', time: '2m ago', active: true },
                     { type: 'MISSED', student: 'Siddharth M.', bus: 'BUS001', time: '15m ago', active: true },
                     { type: 'SYSTEM', msg: 'Core Engine Buffer Cleared', time: '1h ago', active: false },
                  ].map((notif, i) => (
                     <GlassCard key={i} className={`p-6 border-l-4 ${notif.type === 'SOS' ? 'border-routex-danger' : notif.type === 'MISSED' ? 'border-routex-amber' : 'border-routex-primary'} ${!notif.active ? 'opacity-40 grayscale' : ''}`}>
                        <div className="flex justify-between items-start">
                           <div className="flex gap-4">
                              <div className={`p-3 rounded-xl bg-white/5 ${notif.type === 'SOS' ? 'text-routex-danger' : notif.type === 'MISSED' ? 'text-routex-amber' : 'text-routex-primary'}`}>
                                 {notif.type === 'SOS' ? <ShieldAlert className="w-6 h-6" /> : notif.type === 'MISSED' ? <Users className="w-6 h-6" /> : <Database className="w-6 h-6" />}
                              </div>
                              <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-routex-textMuted mb-1">{notif.type} PROTOCOL</p>
                                 <h4 className="text-xl font-display tracking-tight">{notif.student || notif.msg}</h4>
                                 <p className="text-xs text-routex-textMuted mt-1">{notif.bus ? `Impacted Vessel: ${notif.bus}` : 'System Maintenance'}</p>
                              </div>
                           </div>
                           <span className="text-[10px] font-mono text-routex-textMuted">{notif.time}</span>
                        </div>
                        {notif.active && (
                           <div className="mt-6 flex gap-3">
                              <button className="flex-1 bg-white/5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Intercept Alert</button>
                              <button onClick={() => toast.success("Marked as Resolved")} className="flex-1 bg-routex-success/20 border border-routex-success/30 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-routex-success">Resolve Case</button>
                           </div>
                        )}
                     </GlassCard>
                  ))}
               </motion.div>
            )}

         </AnimatePresence>
      </main>
    </div>
  );
}
