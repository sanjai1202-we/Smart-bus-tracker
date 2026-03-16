"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, Search, Navigation, MapPin, Clock, 
  Bell, Shield, ChevronUp, ChevronDown, Camera,
  Upload, AlertCircle, Phone, LogOut, CheckCircle
} from 'lucide-react';
import { GlassPanel, PrimaryButton, MeshBackground, FloatingInput } from './Primitives';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

export default function StudentFlow({ onLogout }: { onLogout: () => void }) {
  const [step, setStep] = useState<'entry' | 'qr' | 'tracking'>('entry');
  const [busCode, setBusCode] = useState(['', '', '', '', '', '']);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOTP = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...busCode];
    newCode[index] = value.toUpperCase();
    setBusCode(newCode);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const verifyCode = () => {
    if (busCode.join('') === 'BUS007') {
      toast.success("Identity Synchronized");
      setStep('tracking');
    } else {
      toast.error("Invalid Vector Code");
      setBusCode(['', '', '', '', '', '']);
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg-base)] overflow-hidden font-['Satoshi',sans-serif]">
      <MeshBackground />
      
      <AnimatePresence mode="wait">
        {step === 'entry' && (
          <motion.div key="entry" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="min-h-screen flex items-center justify-center p-6 z-10 relative">
            <GlassPanel className="w-full max-w-md !p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] mx-auto mb-8">
                <Navigation className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-['Clash_Display',sans-serif] font-bold tracking-tight mb-2">Initialize Bus Link</h2>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.4em] mb-12 opacity-60">Enter the 6-digit vector code</p>
              
              <div className="flex justify-center gap-3 mb-12">
                {busCode.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOTP(i, e.target.value)}
                    className="w-12 h-16 glass-panel !p-0 text-center text-2xl font-mono font-bold border-2 border-[var(--border-glass)] focus:border-[var(--primary)] focus:shadow-[0_0_20px_var(--primary-glow)] outline-none transition-all"
                  />
                ))}
              </div>

              <PrimaryButton onClick={verifyCode} disabled={busCode.some(d => !d)}>
                Establish Connection
              </PrimaryButton>
              
              <button onClick={() => setStep('qr')} className="mt-8 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Or Scan QR Identity
              </button>
            </GlassPanel>
          </motion.div>
        )}

        {step === 'qr' && (
          <motion.div key="qr" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="min-h-screen flex items-center justify-center p-6 z-10 relative">
             <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                <GlassPanel onClick={() => setStep('tracking')} hoverEffect className="group cursor-pointer !p-12 text-center flex flex-col items-center justify-center relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="w-20 h-20 rounded-3xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] mb-8 group-hover:scale-110 transition-transform">
                      <Camera className="w-10 h-10" />
                   </div>
                   <h3 className="text-2xl font-['Clash_Display',sans-serif] font-bold mb-2">Live Scan</h3>
                   <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">Use your device camera</p>
                   <motion.div animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute left-0 right-0 h-[2px] bg-[var(--primary)] opacity-20 pointer-events-none" />
                </GlassPanel>

                <GlassPanel onClick={() => setStep('tracking')} hoverEffect className="group cursor-pointer !p-12 text-center flex flex-col items-center justify-center">
                   <div className="w-20 h-20 rounded-3xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] mb-8 group-hover:scale-110 transition-transform">
                      <Upload className="w-10 h-10" />
                   </div>
                   <h3 className="text-2xl font-['Clash_Display',sans-serif] font-bold mb-2">Upload Identity</h3>
                   <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">Import from gallery</p>
                </GlassPanel>
             </div>
             
             <button onClick={() => setStep('entry')} className="absolute bottom-12 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                Back to code entry
             </button>
          </motion.div>
        )}

        {step === 'tracking' && (
          <motion.div key="tracking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen relative flex flex-col z-10">
            <header className="absolute top-6 left-6 right-6 z-50 flex justify-between items-start pointer-events-none">
              <div className="pointer-events-auto">
                 <GlassPanel className="!py-3 !px-6 flex items-center gap-4 bg-[var(--bg-elevated)]/80">
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white">R</div>
                    <div>
                       <h1 className="text-sm font-bold tracking-tight">ROUTEX LIVE</h1>
                       <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--live)] animate-pulse" />
                          <span className="text-[9px] font-black uppercase tracking-tighter text-[var(--live)]">Sync Active</span>
                       </div>
                    </div>
                 </GlassPanel>
              </div>

              <div className="flex flex-col gap-3 pointer-events-auto">
                 <button onClick={onLogout} className="p-4 glass-panel !rounded-2xl text-[var(--text-secondary)] hover:text-[var(--alert)] transition-colors">
                    <LogOut className="w-6 h-6" />
                 </button>
                 <button className="p-4 glass-panel !rounded-2xl text-[var(--primary)] shadow-[0_0_20px_var(--primary-glow)]">
                    <Bell className="w-6 h-6" />
                 </button>
              </div>
            </header>

            <div className="flex-1 relative">
               <MapComponent />
               
               <div className="absolute bottom-40 right-6 z-[100]">
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    className="relative w-16 h-16 bg-[var(--alert)] rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(239,68,68,0.4)] z-10"
                  >
                     <Shield className="w-8 h-8" />
                     <span className="absolute inset-0 rounded-full border-4 border-[var(--alert)] animate-ping opacity-75" />
                     <span className="absolute inset-[-10px] rounded-full border-2 border-[var(--alert)] animate-ping opacity-40 duration-1000" />
                  </motion.button>
               </div>
            </div>

            <motion.div 
              animate={{ height: drawerOpen ? '450px' : '150px' }}
              className="absolute bottom-0 left-0 right-0 glass-panel !rounded-t-[40px] !p-0 z-[200] overflow-hidden shadow-[0_-20px_80px_rgba(0,0,0,0.5)] border-t border-[var(--border-glass)]"
            >
              <div 
                onClick={() => setDrawerOpen(!drawerOpen)}
                className="w-full h-12 flex items-center justify-center cursor-pointer group"
              >
                 <div className="w-12 h-1.5 bg-[var(--border-glass)] rounded-full group-hover:bg-[var(--primary)] transition-colors" />
              </div>

              <div className="px-8 pb-8">
                 <div className="flex justify-between items-center mb-8">
                    <div>
                       <h2 className="text-3xl font-['Clash_Display',sans-serif] font-bold tracking-tight uppercase">BUS007</h2>
                       <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.4em] font-bold">Anna Nagar → College Hub</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-bold">Estimated Arrival</p>
                       <h3 className="text-3xl font-bold text-[var(--live)] font-['Clash_Display',sans-serif]">07:42 AM</h3>
                    </div>
                 </div>

                 <div className="mb-10 relative px-4">
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[var(--border-glass)]" />
                    <div className="absolute left-0 right-1/2 top-1/2 -translate-y-1/2 h-[2px] bg-[var(--primary)] shadow-[0_0_10px_var(--primary-glow)]" />
                    <div className="flex justify-between items-center relative z-10">
                       {[1, 2, 3, 4].map((s, i) => (
                          <div key={s} className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${i <= 1 ? 'bg-[var(--primary)] border-[var(--primary)] shadow-[0_0_10px_var(--primary-glow)]' : 'bg-[var(--bg-elevated)] border-[var(--border-glass)]'}`} />
                       ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <GlassPanel className="!p-6 !bg-[var(--bg-elevated)]/40 hover:!bg-[var(--bg-elevated)] transition-all">
                       <MapPin className="w-5 h-5 text-[var(--primary)] mb-3" />
                       <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-bold">Next Hub</p>
                       <h4 className="text-lg font-bold">Anna Nagar Stop</h4>
                    </GlassPanel>
                    <GlassPanel className="!p-6 !bg-[var(--bg-elevated)]/40 hover:!bg-[var(--bg-elevated)] transition-all">
                       <Clock className="w-5 h-5 text-[var(--warning)] mb-3" />
                       <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-bold">Dilation</p>
                       <h4 className="text-lg font-bold">-2 Mins Late</h4>
                    </GlassPanel>
                 </div>

                 <div className="mt-8 pt-8 border-t border-[var(--border-glass)] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-[var(--bg-glass)] border border-[var(--border-glass)] flex items-center justify-center text-xl">👨‍✈️</div>
                       <div>
                          <p className="text-[9px] text-[var(--text-secondary)] uppercase tracking-widest font-bold">COMMANDER</p>
                          <h4 className="text-sm font-bold">Rajan Kumar</h4>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => toast.success("Broadcasting Boarded Status")} className="px-6 py-3 bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 rounded-xl text-[10px] font-black uppercase tracking-widest">
                          I BOARDED
                       </button>
                       <button className="p-4 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 hover:bg-[var(--primary)]/20 transition-all">
                          <Phone className="w-5 h-5" />
                       </button>
                    </div>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Cinematic Vignette */}
      <div className="fixed inset-0 pointer-events-none z-[100] shadow-[inset_0_0_150px_rgba(0,0,0,0.4)]" />
    </div>
  );
}
