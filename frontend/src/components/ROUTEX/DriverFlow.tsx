"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, QrCode, Power, Map as MapIcon, Bell, CheckCircle2, MessageSquare, ShieldAlert, LogOut, Navigation } from 'lucide-react';
import { GlassPanel, PrimaryButton, MeshBackground } from './Primitives';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

export default function DriverFlow({ onLogout }: any) {
  const [screen, setScreen] = useState<'activate' | 'dashboard' | 'qr'>('activate');
  const [adminCode, setAdminCode] = useState(['', '', '', '', '', '']);
  const [isLive, setIsLive] = useState(true);

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
      setScreen('dashboard');
    } else {
      toast.error("Handshake Failed");
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden transition-colors duration-300">
      <AnimatePresence mode="wait">
        {screen === 'activate' && (
          <motion.div key="activate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 flex items-center justify-center p-6 z-10">
            <MeshBackground variant="amber" />
            <GlassPanel className="w-full max-w-md p-10 text-center border-routex-amber/20">
              <h2 className="text-4xl font-display tracking-widest text-routex-amber mb-4">DRIVE NODE</h2>
              <p className="text-[10px] text-routex-textMuted uppercase tracking-widest mb-10">Enter Authentication Vector</p>
              
              <div className="flex justify-between gap-2 mb-10">
                {adminCode.map((digit, i) => (
                  <input
                    key={i} id={`code-${i}`} type="text" value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    className="w-12 h-16 bg-white/5 border-2 border-white/10 rounded-xl text-center text-2xl font-mono focus:border-routex-amber outline-none"
                  />
                ))}
              </div>

              <PrimaryButton variant="amber" onClick={activateBus}>
                Initialize Transit
              </PrimaryButton>
            </GlassPanel>
          </motion.div>
        )}

        {screen === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-screen p-6 flex flex-col gap-6 overflow-y-auto scrollbar-hide">
            <MeshBackground variant="indigo" />
            
            {/* Header */}
            <header className="flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-routex-amber/20 flex items-center justify-center border border-routex-amber/30 text-routex-amber">
                    <Navigation className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display tracking-widest">RAJAN KUMAR</h2>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-routex-amber animate-pulse" />
                      <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/50">TRANSIT PROTOCOL ACTIVE [BUS007]</span>
                    </div>
                  </div>
               </div>
               <button onClick={onLogout} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10">
                 <LogOut className="w-5 h-5" />
               </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
              {/* Main Console */}
              <div className="lg:col-span-2 space-y-6">
                <GlassPanel className="h-[400px] p-0 overflow-hidden relative">
                   <MapComponent />
                </GlassPanel>

                <div className="grid grid-cols-2 gap-6">
                   <GlassPanel className="p-8">
                      <div className="flex justify-between items-center mb-6">
                        <Power className={`w-10 h-10 ${isLive ? 'text-routex-teal' : 'text-routex-danger'}`} />
                        <button onClick={() => setIsLive(!isLive)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${isLive ? 'bg-routex-teal/10 border-routex-teal/20 text-routex-teal' : 'bg-routex-danger/10 border-routex-danger/20 text-routex-danger'}`}>
                          {isLive ? 'SYSTEM LIVE' : 'OFFLINE'}
                        </button>
                      </div>
                      <h4 className="text-xl font-display tracking-widest mb-1 uppercase">GPS BROADCAST</h4>
                      <p className="text-[9px] text-routex-textMuted uppercase tracking-widest">Streaming coordinates to student cloud</p>
                   </GlassPanel>

                   <GlassPanel onClick={() => setScreen('qr')} hoverEffect className="p-8 cursor-pointer border-routex-primary/20 bg-routex-primary/5">
                      <div className="flex justify-between items-center mb-6">
                        <QrCode className="w-10 h-10 text-routex-primary" />
                        <ArrowRight className="w-5 h-5 text-routex-primary" />
                      </div>
                      <h4 className="text-xl font-display tracking-widest mb-1 uppercase">BOARDING QR</h4>
                      <p className="text-[9px] text-routex-textMuted uppercase tracking-widest">Verify student boarding credentials</p>
                   </GlassPanel>
                </div>
              </div>

              {/* Alerts Panel */}
              <div className="space-y-6 h-full flex flex-col">
                <GlassPanel className="flex-1 flex flex-col p-8 overflow-hidden bg-white/[0.02]">
                   <div className="flex justify-between items-center mb-8 shrink-0">
                      <h3 className="text-2xl font-display font-bold tracking-widest uppercase">Student Comms</h3>
                      <span className="px-2 py-1 bg-routex-danger/20 border border-routex-danger/40 rounded-lg text-[10px] font-black text-routex-danger">3 ALERTS</span>
                   </div>

                   <div className="space-y-4 overflow-y-auto pr-2 scrollbar-hide flex-1 flex items-center justify-center opacity-30">
                       <p className="text-[10px] uppercase tracking-[0.4em] text-center">Protocol Stream Clear</p>
                   </div>
                </GlassPanel>
              </div>
            </div>
          </motion.div>
        )}

        {screen === 'qr' && (
          <motion.div key="qr" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 flex flex-col items-center justify-center p-6 z-10">
            <MeshBackground variant="indigo" />
            <button onClick={() => setScreen('dashboard')} className="absolute top-10 left-10 flex items-center gap-2 text-[10px] uppercase font-bold tracking-[.3em] text-routex-textMuted hover:text-white">
              <ChevronLeft className="w-4 h-4" /> RECALL CONSOLE
            </button>
            <div className="text-center mb-10">
               <h2 className="text-5xl font-display tracking-[0.2em] mb-4">BOARDING QR</h2>
               <p className="text-[10px] text-routex-textMuted uppercase tracking-widest">Point Student Camera To verify Entry</p>
            </div>
            
            <GlassPanel className="p-16 border-routex-teal/20 bg-routex-teal/5 relative group">
               <div className="w-64 h-64 bg-white/10 rounded-3xl flex items-center justify-center p-8 relative overflow-hidden">
                  <QrCode className="w-full h-full text-white animate-pulse" />
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-routex-teal animate-sweep" />
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-routex-teal rounded-tl-xl animate-pulse" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-routex-teal rounded-tr-xl animate-pulse" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-routex-teal rounded-bl-xl animate-pulse" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-routex-teal rounded-br-xl animate-pulse" />
               </div>
               <div className="absolute -inset-1 rounded-[24px] bg-gradient-to-r from-routex-teal/50 to-routex-primary/50 blur opacity-30 group-hover:opacity-100 transition duration-1000 animate-mesh" />
            </GlassPanel>

            <h3 className="mt-12 text-6xl font-mono tracking-widest text-routex-teal">BUS007</h3>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
  )
}
