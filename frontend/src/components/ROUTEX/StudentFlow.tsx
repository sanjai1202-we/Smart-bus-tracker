"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Camera, Upload, LogOut, Bell, Shield, MessageSquare, CheckCircle2, Navigation2, Clock } from 'lucide-react';
import { GlassPanel, PrimaryButton, MeshBackground } from './Primitives';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

const Map = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });

export default function StudentFlow({ onLogout }: any) {
  const [screen, setScreen] = useState<'code' | 'qr' | 'tracking'>('code');
  const [busCode, setBusCode] = useState(['', '', '', '', '', '']);
  const [alarmModal, setAlarmModal] = useState(false);
  const [alarmActive, setAlarmActive] = useState(false);
  const [missedResponse, setMissedResponse] = useState(false);

  const handleCodeChange = (index: number, val: string) => {
    if (val.length > 1) return;
    const newCode = [...busCode];
    newCode[index] = val.toUpperCase();
    setBusCode(newCode);
    if (val && index < 5) {
      const next = document.getElementById(`code-${index + 1}`);
      next?.focus();
    }
  };

  const verifyCode = () => {
    if (busCode.join('') === 'BUS007') {
      toast.success("Identity Verified: Route Matched");
      setScreen('qr');
    } else {
      toast.error("Invalid Vector Code");
      setBusCode(['', '', '', '', '', '']);
    }
  };

  const simulateQR = () => {
    toast.dismiss();
    const t = toast.loading("Analyzing Bio-Metric QR...");
    setTimeout(() => {
      toast.dismiss(t);
      setScreen('tracking');
    }, 2000);
  };

  const setAlarm = () => {
    setAlarmModal(false);
    toast.success("Proximity Alarm Initialized");
    setTimeout(() => {
      setAlarmActive(true);
    }, 5000);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden transition-colors duration-300">
      <AnimatePresence mode="wait">
        {screen === 'code' && (
          <motion.div
            key="code-screen"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed inset-0 flex items-center justify-center p-6 z-10"
          >
            <MeshBackground variant="teal" />
            <GlassPanel className="w-full max-w-md p-10 text-center">
              <h2 className="text-4xl font-display tracking-widest mb-4">INITIALIZE BUS</h2>
              <p className="text-[10px] text-routex-textMuted uppercase tracking-widest mb-10">Enter 6-Digit Transmission Code</p>
              
              <div className="flex justify-between gap-2 mb-10">
                {busCode.map((digit, i) => (
                  <motion.input
                    key={i}
                    id={`code-${i}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    whileFocus={{ scale: 1.1, borderColor: '#06EFC5' }}
                    className="w-12 h-16 bg-white/5 border-2 border-white/10 rounded-xl text-center text-2xl font-mono focus:outline-none transition-all"
                  />
                ))}
              </div>

              <PrimaryButton variant="teal" onClick={verifyCode}>
                Establish Connection
              </PrimaryButton>
            </GlassPanel>
          </motion.div>
        )}

        {screen === 'qr' && (
          <motion.div
            key="qr-screen"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            className="fixed inset-0 flex flex-col items-center justify-center p-6 z-10"
          >
            <MeshBackground variant="indigo" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
              <GlassPanel hoverEffect onClick={simulateQR} className="flex flex-col items-center p-12 group cursor-pointer">
                <div className="relative w-48 h-48 border-2 border-routex-teal/30 rounded-3xl mb-8 flex items-center justify-center overflow-hidden">
                   <div className="absolute inset-0 border-[3px] border-routex-teal rounded-3xl animate-pulse" />
                   <div className="absolute top-0 left-0 w-full h-[2px] bg-routex-teal shadow-[0_0_15px_rgba(6,239,197,1)] animate-sweep" />
                   <Camera className="w-16 h-16 text-routex-teal opacity-50" />
                </div>
                <h3 className="text-2xl font-display tracking-widest mb-2">LIVE SCAN</h3>
                <p className="text-[10px] text-routex-textMuted uppercase tracking-widest">Aura Verification System</p>
              </GlassPanel>

              <GlassPanel hoverEffect onClick={simulateQR} className="flex flex-col items-center p-12 group cursor-pointer">
                <div className="w-48 h-48 border-2 border-dashed border-white/20 rounded-3xl mb-8 flex items-center justify-center">
                   <Upload className="w-16 h-16 text-foreground/50 group-hover:translate-y-[-10px] transition-transform" />
                </div>
                <h3 className="text-2xl font-display tracking-widest mb-2">DIGITAL UPLOAD</h3>
                <p className="text-[10px] text-routex-textMuted uppercase tracking-widest">Cloud Entry Protocol</p>
              </GlassPanel>
            </div>
            
            <button onClick={() => setScreen('code')} className="mt-12 flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.3em] text-routex-textMuted hover:text-white transition-all">
              <ChevronLeft className="w-4 h-4" /> Re-enter Vector Code
            </button>
          </motion.div>
        )}

        {screen === 'tracking' && (
          <motion.div
            key="tracking-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-screen relative flex flex-col"
          >
            {/* Map Layer */}
            <MapComponent />

            {/* Navigation Overlay */}
            <div className="absolute top-6 left-6 z-20">
               <GlassPanel className="py-3 px-6 rounded-full flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-routex-teal/20 flex items-center justify-center">
                    <Navigation2 className="w-4 h-4 text-routex-teal rotate-45" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold tracking-widest text-routex-teal">BUS BUS007</h4>
                    <p className="text-[8px] uppercase tracking-widest text-white/60">Heading to College Gate</p>
                  </div>
               </GlassPanel>
            </div>

            <div className="absolute top-6 right-6 z-20">
               <button onClick={onLogout} className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">
                 <LogOut className="w-5 h-5" />
               </button>
            </div>

            {/* Live Indicator */}
            <div className="absolute top-24 left-6 z-20">
               <div className="flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/5 text-[9px] font-bold tracking-widest">
                 <span className="w-2 h-2 rounded-full bg-routex-teal animate-pulse" />
                 LIVE POSITIONING
               </div>
            </div>

            {/* Draggable Bottom Panel */}
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 200 }}
              className="absolute bottom-4 left-4 right-4 z-30"
            >
               <GlassPanel className="p-0 overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                 <div className="w-12 h-1 bg-white/20 rounded-full mx-auto my-4" />
                 
                 <div className="p-8">
                    <div className="flex justify-between items-end mb-10">
                       <div className="space-y-1">
                          <p className="text-[10px] text-routex-textMuted uppercase tracking-widest">Tracking Status</p>
                          <div className="flex gap-2 items-end">
                            <span className="text-5xl font-mono tracking-tighter text-white">08:42</span>
                            <span className="text-xs font-mono text-routex-teal pb-1">AM</span>
                          </div>
                          <p className="text-xs text-foreground/40">Approaching Anna Nagar Loop</p>
                       </div>
                       
                       <div className="text-right space-y-2">
                          <button 
                            onClick={() => setAlarmModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-routex-teal/10 border border-routex-teal/20 rounded-xl text-[10px] font-bold text-routex-teal hover:bg-routex-teal/20 transition-all"
                          >
                             <Bell className="w-3 h-3" /> SET ALARM
                          </button>
                          <div className="text-[9px] uppercase tracking-widest text-foreground/40">3 STOPS REMAINING</div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                       <div onClick={() => toast.success("Parents Notified 🟢")} className="p-6 bg-routex-teal/5 border border-routex-teal/10 rounded-3xl group cursor-pointer hover:bg-routex-teal/10 transition-all">
                          <CheckCircle2 className="w-6 h-6 text-routex-teal mb-4" />
                          <h5 className="text-[10px] font-bold uppercase tracking-widest text-white mb-1">I BOARDED</h5>
                          <p className="text-[8px] text-foreground/40 uppercase">Broadcast Security Alert</p>
                       </div>
                       <div onClick={() => { 
                         toast.loading("Sending Request..."); 
                         setTimeout(() => {
                           toast.dismiss();
                           setMissedResponse(true);
                           toast.success("Driver Alerted");
                         }, 2000); 
                       }} className="p-6 bg-routex-amber/5 border border-routex-amber/10 rounded-3xl group cursor-pointer hover:bg-routex-amber/10 transition-all">
                          <Clock className="w-6 h-6 text-routex-amber mb-4" />
                          <h5 className="text-[10px] font-bold uppercase tracking-widest text-white mb-1">MISSED BUS</h5>
                          <p className="text-[8px] text-foreground/40 uppercase">Request Recall Status</p>
                       </div>
                    </div>

                    <AnimatePresence>
                      {missedResponse && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-4">
                           <div className="w-10 h-10 rounded-full bg-routex-primary/20 flex items-center justify-center shrink-0">
                              <MessageSquare className="w-5 h-5 text-routex-primary" />
                           </div>
                           <div>
                              <p className="text-[10px] text-foreground/50 uppercase tracking-widest mb-1">Driver Rajan</p>
                              <p className="text-xs text-white italic">&quot;I&apos;ll wait 2 mins at Koyambedu Stop. Hurry up!&quot;</p>
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-routex-teal/20 border border-routex-teal/30 flex items-center justify-center">
                             <Navigation2 className="w-5 h-5 text-routex-teal" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest">Assigned Driver</p>
                            <p className="text-[8px] lowercase text-foreground/40 tracking-widest">session_streaming</p>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-routex-teal animate-pulse" />
                          <div className="w-1.5 h-1.5 rounded-full bg-routex-teal/30" />
                          <div className="w-1.5 h-1.5 rounded-full bg-routex-teal/30" />
                       </div>
                    </div>
                 </div>
               </GlassPanel>
            </motion.div>

            {/* SOS Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                const conf = confirm("ACTIVATE EMERGENCY SOS?");
                if (conf) {
                  toast.error("SOS TRANSMITTED: EMERGENCY PROTOCOL ACTIVE", { duration: 10000 });
                }
              }}
              className="fixed bottom-6 right-6 w-16 h-16 bg-routex-danger rounded-full z-50 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)]"
            >
               <Shield className="w-8 h-8 text-white" />
               <motion.div 
                 animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="absolute inset-0 border-4 border-routex-danger rounded-full"
               />
               <motion.div 
                 animate={{ scale: [1, 1.3, 1.6], opacity: [0.3, 0.1, 0] }}
                 transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                 className="absolute inset-0 border-4 border-routex-danger rounded-full"
               />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alarm Modal Overlay */}
      <AnimatePresence>
        {alarmModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
             <GlassPanel className="w-full max-w-sm p-8 text-center">
                <Bell className="w-12 h-12 text-routex-teal mx-auto mb-6" />
                <h3 className="text-2xl font-display tracking-widest mb-4">STOP ALARM</h3>
                <p className="text-xs text-routex-textMuted mb-8 uppercase tracking-widest">Select your disembarkation point</p>
                <select className="w-full bg-white/10 border border-white/20 p-4 rounded-xl outline-none mb-8 text-xs font-bold uppercase tracking-widest">
                   <option>Anna Nagar Loop</option>
                   <option>Koyambedu Hub</option>
                   <option>Vadapalani Station</option>
                   <option>College Gate</option>
                </select>
                <div className="flex gap-4">
                   <button onClick={() => setAlarmModal(false)} className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-foreground/50 hover:text-white">Cancel</button>
                   <button onClick={setAlarm} className="flex-1 py-4 bg-routex-teal text-routex-dark font-bold text-[10px] uppercase tracking-widest rounded-xl">Activate</button>
                </div>
             </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Alarm Trigger */}
      <AnimatePresence>
        {alarmActive && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="fixed inset-0 z-[200] bg-routex-danger flex flex-col items-center justify-center p-10 text-center"
          >
             <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: Infinity }} className="p-8 bg-white rounded-full mb-10">
                <Bell className="w-20 h-20 text-routex-danger" />
             </motion.div>
             <h2 className="text-7xl font-display tracking-widest text-white mb-6 uppercase">STOP NEARBY</h2>
             <p className="text-xl font-bold text-white/80 uppercase tracking-[0.3em] mb-12">Anna Nagar Loop Is Next</p>
             <button onClick={() => setAlarmActive(false)} className="px-12 py-5 bg-white text-routex-danger font-bold text-xs uppercase tracking-[0.5em] rounded-2xl shadow-2xl">
                I&apos;m Wake Now
             </button>
             <div className="absolute inset-0 border-[20px] border-white/20 animate-pulse pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
