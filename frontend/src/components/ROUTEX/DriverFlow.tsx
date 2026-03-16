"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Navigation, Zap, ShieldAlert, Settings, LogOut, 
  Users, MapPin, Clock, Phone, Radio, ChevronUp, ChevronDown,
  QrCode, Camera, Shield
} from 'lucide-react';
import { GlassPanel, PrimaryButton, MeshBackground, FloatingInput } from './Primitives';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

export default function DriverFlow({ onLogout }: { onLogout: () => void }) {
  const [step, setStep] = useState<'activate' | 'dashboard' | 'qr'>('activate');
  const [adminCode, setAdminCode] = useState(['', '', '', '', '', '']);
  const [gpsActive, setGpsActive] = useState(false);
  const [activeAlerts] = useState([
    { id: 1, type: 'sos', student: 'Priya Sharma', stop: 'Anna Nagar Stop', time: '2m ago' },
    { id: 2, type: 'missed', student: 'Rahul Dravid', stop: 'Koyambedu', time: 'Just now' }
  ]);

  const handleCodeChange = (index: number, val: string) => {
    if (val.length > 1) return;
    const newCode = [...adminCode];
    newCode[index] = val.toUpperCase();
    setAdminCode(newCode);
    if (val && index < 5) document.getElementById(`code-${index + 1}`)?.focus();
  };

  const activateBus = () => {
    if (adminCode.join('') === 'BUS007') {
      toast.success("BUS007 Link Synchronized");
      setStep('dashboard');
    } else {
      toast.error("Handshake Failed");
    }
  };

  const toggleGPS = () => {
    setGpsActive(!gpsActive);
    if (!gpsActive) {
      toast.success("GPS Uplink Established");
    } else {
      toast.error("GPS Offline");
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg-base)] overflow-hidden font-['Satoshi',sans-serif]">
      <MeshBackground />
      
      <AnimatePresence mode="wait">
        {step === 'activate' && (
          <motion.div key="activate" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -50 }} className="fixed inset-0 flex items-center justify-center p-6 z-10 transition-all">
            <GlassPanel className="w-full max-w-md !p-12 text-center border-[var(--warning)]/20">
              <div className="w-16 h-16 rounded-2xl bg-[var(--warning)]/10 flex items-center justify-center text-[var(--warning)] mx-auto mb-8">
                <Radio className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-['Clash_Display',sans-serif] font-bold tracking-tight mb-2">Initialize Node</h2>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.4em] mb-12 opacity-60">Authentication vector required</p>
              
              <div className="flex justify-center gap-3 mb-12">
                {adminCode.map((digit, i) => (
                  <input
                    key={i}
                    id={`code-${i}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    className="w-12 h-16 glass-panel !p-0 text-center text-2xl font-mono font-bold border-2 border-[var(--border-glass)] focus:border-[var(--warning)] focus:shadow-[0_0_20px_rgba(245,158,11,0.3)] outline-none transition-all"
                  />
                ))}
              </div>

              <PrimaryButton onClick={activateBus} disabled={adminCode.some(d => !d)}>
                Establish Connection
              </PrimaryButton>
            </GlassPanel>
          </motion.div>
        )}

        {step === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col lg:flex-row h-screen z-10 relative">
            {/* Sidebar - Control Hub */}
            <aside className="hidden lg:flex w-80 bg-[var(--bg-elevated)]/50 backdrop-blur-3xl border-r border-[var(--border-glass)] flex-col z-50">
              <div className="p-8 pb-12">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center font-bold">D</div>
                  <span className="font-['Clash_Display',sans-serif] font-bold tracking-[0.2em] text-xl">CONSOLE</span>
                </div>

                <GlassPanel className="!p-6 !bg-[var(--bg-elevated)]/80 border-[var(--primary)]/30 mb-8">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                         <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-bold">Assigned Unit</p>
                         <h3 className="text-2xl font-bold">BUS007</h3>
                      </div>
                      <div className="p-2 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                         <Navigation className="w-5 h-5" />
                      </div>
                   </div>
                   <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-glass)]">
                      <div className="w-2 h-2 rounded-full bg-[var(--live)] animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Uplink Stable</span>
                   </div>
                </GlassPanel>

                <div className="space-y-6">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">Mission Alerts</h4>
                   {activeAlerts.map((alert) => (
                      <GlassPanel key={alert.id} className={`!p-4 border-l-4 ${alert.type === 'sos' ? 'border-l-[var(--alert)] bg-[var(--alert)]/5' : 'border-l-[var(--warning)] bg-[var(--warning)]/5'}`}>
                         <div className="flex justify-between items-start mb-2">
                            <span className={`text-[8px] font-black uppercase tracking-widest ${alert.type === 'sos' ? 'text-[var(--alert)]' : 'text-[var(--warning)]'}`}>
                               {alert.type === 'sos' ? 'CRITICAL SOS' : 'MISSED BUS'}
                            </span>
                            <span className="text-[8px] text-[var(--text-secondary)] font-mono">{alert.time}</span>
                         </div>
                         <h5 className="text-sm font-bold mb-1">{alert.student}</h5>
                         <p className="text-[9px] text-[var(--text-secondary)] uppercase tracking-widest">{alert.stop}</p>
                         <div className="flex gap-2 mt-4">
                            <button className="flex-1 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-glass)] text-[8px] font-black uppercase tracking-widest hover:border-[var(--primary)]">Ack</button>
                            <button className="flex-1 py-2 rounded-lg bg-[var(--primary)] text-white text-[8px] font-black uppercase tracking-widest">Call</button>
                         </div>
                      </GlassPanel>
                   ))}
                </div>
              </div>

              <div className="mt-auto p-8 border-t border-[var(--border-glass)]">
                <button onClick={onLogout} className="w-full flex items-center gap-3 p-4 rounded-2xl text-[var(--alert)] hover:bg-[var(--alert)]/10 transition-all font-bold text-[10px] uppercase tracking-widest">
                  <LogOut className="w-5 h-5" />
                  End Mission
                </button>
              </div>
            </aside>

            {/* Map Viewport */}
            <main className="flex-1 relative">
               <MapComponent />
               
               <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
                  <div className="pointer-events-auto flex flex-col gap-4">
                     <button 
                       onClick={toggleGPS}
                       className={`px-8 py-4 rounded-full flex items-center gap-4 transition-all duration-500 border-2 ${gpsActive ? 'bg-[var(--live)]/20 border-[var(--live)] text-[var(--live)] shadow-[0_0_30px_var(--live)]' : 'bg-[var(--bg-elevated)]/80 border-[var(--border-glass)] text-[var(--text-secondary)]'}`}
                     >
                        <Navigation className={`w-5 h-5 ${gpsActive ? 'animate-bounce' : ''}`} />
                        <span className="text-xs font-black uppercase tracking-widest">{gpsActive ? 'GPS TRANSMITTING' : 'GPS STANDBY'}</span>
                     </button>
                     
                     <div className="glass-panel !py-4 !px-6 bg-[var(--bg-elevated)]/80 flex items-center gap-6">
                        <div className="flex flex-col">
                           <span className="text-[8px] text-[var(--text-secondary)] uppercase font-black tracking-widest mb-1">Manifest</span>
                           <span className="text-xl font-bold font-mono">32/40</span>
                        </div>
                        <div className="w-px h-8 bg-[var(--border-glass)]" />
                        <div className="flex flex-col">
                           <span className="text-[8px] text-[var(--text-secondary)] uppercase font-black tracking-widest mb-1">Next Node</span>
                           <span className="text-sm font-bold uppercase">Anna Nagar Hub</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-4 pointer-events-auto">
                    <button onClick={() => setStep('qr')} className="p-5 rounded-3xl glass-panel bg-[var(--bg-elevated)]/80 border-[var(--primary)]/20 text-[var(--primary)]">
                       <QrCode className="w-8 h-8" />
                    </button>
                    <button className="lg:hidden p-5 rounded-3xl bg-[var(--bg-elevated)]/80 text-[var(--text-primary)]" onClick={onLogout}>
                       <LogOut className="w-8 h-8" />
                    </button>
                  </div>
               </div>
            </main>
          </motion.div>
        )}

        {step === 'qr' && (
          <motion.div key="qr" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 flex flex-col items-center justify-center p-6 z-10 text-center">
            <h2 className="text-5xl font-['Clash_Display',sans-serif] font-bold tracking-tight mb-4">NODE IDENTITY</h2>
            <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.4em] mb-12 opacity-60">BUS007 — ALPHA PROTOCOL</p>
            
            <GlassPanel className="!p-16 relative group">
               <div className="w-64 h-64 bg-white/5 rounded-3xl flex items-center justify-center p-8 relative overflow-hidden border border-[var(--border-glass)] shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                  <div className="w-full h-full text-[var(--primary)] flex items-center justify-center">
                    <QrCode className="w-full h-full opacity-20 animate-pulse" />
                    {/* Simulated scanning line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-[var(--primary)] shadow-[0_0_15px_var(--primary)] animate-sweep" />
                  </div>
               </div>
               
               {/* Orbital lines around QR */}
               <div className="absolute -inset-4 border border-[var(--primary)]/20 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="absolute -inset-8 border border-[var(--primary)]/10 rounded-[50px] opacity-0 group-hover:opacity-100 transition-opacity delay-75" />
            </GlassPanel>

            <button onClick={() => setStep('dashboard')} className="mt-12 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
               Return to command deck
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Cinematic Vignette */}
      <div className="fixed inset-0 pointer-events-none z-[100] shadow-[inset_0_0_150px_rgba(0,0,0,0.4)]" />
    </div>
  );
}
