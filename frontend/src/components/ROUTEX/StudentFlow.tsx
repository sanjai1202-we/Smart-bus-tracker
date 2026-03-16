"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, MapPin, Bell, ShieldAlert, CheckCircle, Smartphone, Map as MapIcon, Clock, ChevronRight, User, Share2, MessageSquare, LogOut, Bus } from 'lucide-react';
import { GlassCard, AnimatedButton } from './Shared';
import toast from 'react-hot-toast';

export default function StudentFlow({ onLogout }: any) {
  const [screen, setScreen] = useState<'code' | 'scan' | 'tracking'>('code');
  const [busCode, setBusCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [boarded, setBoarded] = useState(false);
  const [dropped, setDropped] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [alarmSet, setAlarmSet] = useState(false);
  const [alarmTriggered, setAlarmTriggered] = useState(false);
  const [driverMessage, setDriverMessage] = useState<string | null>(null);

  // Demo Mock Data
  const student = { name: "Priya Sharma", bus: "BUS007", stop: "Anna Nagar", parentPhone: "+91 98765 43210" };
  const busInfo = { 
    code: "BUS007", 
    number: "TN 01 AB 1234", 
    from: "Anna Nagar", 
    to: "Sri Venkateswara College", 
    driver: "Rajan Kumar",
    eta: 8, // mins
    stops: ["Anna Nagar", "Koyambedu", "Vadapalani", "Ashok Nagar", "K.K. Nagar", "College Gate"]
  };

  const handleVerifyCode = () => {
    if (busCode.toUpperCase() === 'BUS007') {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setScreen('scan');
      }, 1000);
    } else {
      toast.error("Invalid Bus Code", { style: { background: '#FF4E4E', color: '#fff' } });
    }
  };

  const simulateScan = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setScreen('tracking');
      toast.success("Bus Verified ✓", { icon: '🟢' });
    }, 2000);
  };

  const sendSOS = () => {
    setSosSent(true);
    toast.error("SOS Shared with Driver", { icon: '🚨' });
    setTimeout(() => setSosSent(false), 5000);
  };

  const handleMissedBus = () => {
    toast.success("Notification sent to Driver");
    setTimeout(() => {
      setDriverMessage("I'll wait 2 mins at the next stop (Koyambedu)");
    }, 3000);
  };

  const setAlarm = () => {
    setAlarmSet(true);
    setShowAlarmModal(false);
    toast.success("Alarm set for Anna Nagar");
    setTimeout(() => setAlarmTriggered(true), 5000);
  };

  return (
    <div className="relative w-full h-[100dvh] bg-routex-bg overflow-hidden font-body text-white">
      <AnimatePresence mode="wait">
        
        {/* Screen 1: Enter Bus Code */}
        {screen === 'code' && (
          <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full p-8">
            <motion.h2 className="text-4xl font-display mb-8 tracking-widest">Identify Your Bus</motion.h2>
            <div className="w-full max-w-xs">
              <input 
                type="text" 
                placeholder="6-DIGIT CODE" 
                value={busCode} 
                onChange={e => setBusCode(e.target.value.toUpperCase())}
                className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-5 text-center text-3xl font-mono tracking-[0.4em] focus:border-routex-primary focus:outline-none transition-all"
              />
              <AnimatedButton onClick={handleVerifyCode} className="mt-8" disabled={isVerifying}>
                {isVerifying ? "Verifying..." : "Verify Routing"}
              </AnimatedButton>
            </div>
          </motion.div>
        )}

        {/* Screen 2: QR Scan */}
        {screen === 'scan' && (
          <motion.div key="scan" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex flex-col h-full p-8 pt-20">
            <h2 className="text-4xl font-display mb-12 text-center tracking-widest">Authenticate Boarding</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto w-full">
              <GlassCard className="p-8 flex flex-col items-center text-center group cursor-pointer" onClick={simulateScan}>
                <div className="w-20 h-20 bg-routex-cyan/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-routex-cyan/20 transition-all">
                  <Camera className="w-10 h-10 text-routex-cyan" />
                </div>
                <h3 className="text-xl font-display tracking-wider mb-2">Scan Live QR</h3>
                <p className="text-xs text-routex-textMuted uppercase tracking-widest">Point camera at Driver's Console</p>
                {/* Simulated Scan Box */}
                <div className="mt-10 relative w-40 h-40 border border-white/10 rounded-2xl overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-b from-transparent via-routex-cyan/20 to-transparent h-1 w-full animate-sweep" />
                   <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-routex-cyan animate-pulse" />
                   <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-routex-cyan animate-pulse" />
                   <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-routex-cyan animate-pulse" />
                   <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-routex-cyan animate-pulse" />
                </div>
              </GlassCard>

              <GlassCard className="p-8 flex flex-col items-center text-center group cursor-pointer" onClick={simulateScan}>
                <div className="w-20 h-20 bg-routex-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-routex-primary/20 transition-all">
                  <Upload className="w-10 h-10 text-routex-primary" />
                </div>
                <h3 className="text-xl font-display tracking-wider mb-2">Upload Image</h3>
                <p className="text-xs text-routex-textMuted uppercase tracking-widest">Select photo from gallery</p>
                <div className="mt-10 w-full h-40 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center">
                   <p className="text-[10px] text-white/20 uppercase tracking-[0.3em]">Drop Image Here</p>
                </div>
              </GlassCard>
            </div>
            {isVerifying && (
               <div className="fixed inset-0 bg-routex-success/20 backdrop-blur-sm z-[99] flex items-center justify-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                     <CheckCircle className="w-24 h-24 text-white" />
                     <h2 className="text-5xl font-display mt-4 tracking-widest">VERIFIED</h2>
                  </motion.div>
               </div>
            )}
          </motion.div>
        )}

        {/* Screen 3: Tracking Dash */}
        {screen === 'tracking' && (
          <motion.div key="tracking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
            {/* Map Placeholder */}
            <div className="relative flex-1 bg-gray-900 overflow-hidden">
               <div className="absolute inset-0 opacity-40 bg-[url('https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png')] bg-cover" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <motion.div animate={{ x: [0, 40, 80, 120] }} transition={{ repeat: Infinity, duration: 15 }} className="relative z-10">
                       <div className="bg-routex-primary shadow-[0_0_20px_#5B4EFF] p-3 rounded-full border-2 border-white">
                         <Bus className="w-6 h-6 text-white" />
                       </div>
                       <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap border border-white/10">BUS007 (LIVE)</div>
                    </motion.div>
                    <div className="absolute top-0 h-1 bg-routex-cyan shadow-[0_0_10px_#00FFD1] w-[500px]" />
                  </div>
               </div>
               
               {/* Nav Header */}
               <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-routex-bg border border-white/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-routex-textMuted" />
                     </div>
                     <div>
                        <p className="text-[10px] text-routex-textMuted uppercase font-black">Logged in as</p>
                        <p className="text-sm font-bold tracking-tight">{student.name}</p>
                     </div>
                  </div>
                  <button onClick={onLogout} className="w-10 h-10 rounded-full bg-routex-bg border border-white/10 flex items-center justify-center text-routex-danger">
                     <LogOut className="w-5 h-5" />
                  </button>
               </div>

               <button onClick={sendSOS} className={`absolute bottom-32 right-6 w-16 h-16 rounded-full bg-routex-danger shadow-[0_0_30px_#FF4E4E] flex items-center justify-center z-20 overflow-hidden transition-all ${sosSent ? 'scale-125' : ''}`}>
                  <ShieldAlert className="w-8 h-8 text-white" />
                  <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-white/20 rounded-full pointer-events-none" />
               </button>
            </div>

            {/* Bottom Slider Panel */}
            <motion.div initial={{ y: 200 }} animate={{ y: 0 }} className="h-[40%] bg-routex-bg border-t border-white/10 p-6 flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,1)] relative z-30">
               <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex flex-col">
                     <span className="text-[10px] text-routex-textMuted uppercase font-black tracking-widest">Active Dispatch</span>
                     <span className="text-2xl font-display tracking-wider">{busInfo.number}</span>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className="text-[10px] text-routex-cyan uppercase font-black tracking-widest">Arrival In</span>
                     <span className="text-3xl font-mono text-routex-cyan flex items-center gap-2">
                        {busInfo.eta} <span className="text-xs">MINS</span>
                     </span>
                  </div>
               </div>

               <div className="flex-1 overflow-x-auto flex gap-6 scrollbar-hide py-2">
                  {busInfo.stops.map((stop, i) => (
                    <div key={stop} className="flex flex-col items-center min-w-[100px] opacity-40 hover:opacity-100 transition-all">
                       <div className={`w-8 h-8 rounded-full border-2 mb-2 flex items-center justify-center text-[10px] font-mono ${i === 0 ? 'border-routex-cyan bg-routex-cyan/20 text-routex-cyan' : 'border-white/10 text-white/30'}`}>
                          0{i+1}
                       </div>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-center">{stop}</span>
                    </div>
                  ))}
               </div>

               <div className="mt-6 flex gap-3">
                  <button onClick={() => setShowAlarmModal(true)} className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 flex flex-col items-center gap-1 hover:bg-white/10 transition-all">
                     <Bell className={`w-5 h-5 ${alarmSet ? 'text-routex-cyan animate-bounce' : 'text-routex-textMuted'}`} />
                     <span className="text-[10px] font-black uppercase tracking-widest">{alarmSet ? "Alarm Active" : "Set Alarm"}</span>
                  </button>
                  <button onClick={handleMissedBus} className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 flex flex-col items-center gap-1 hover:bg-white/10 transition-all">
                     <Clock className="w-5 h-5 text-routex-textMuted" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Missed Bus</span>
                  </button>
               </div>

               <div className="mt-4 grid grid-cols-2 gap-3">
                  <AnimatedButton onClick={() => { setBoarded(true); toast.success("Parents Notified 🟢"); }} className={`${boarded ? '!bg-routex-success' : '!bg-white/5 border border-white/10'} !py-3`}>
                     <span className="text-[10px]">{boarded ? "BOARDED ✓" : "I BOARDED"}</span>
                  </AnimatedButton>
                  <AnimatedButton onClick={() => { setDropped(true); toast.success("Parents Notified 🟡"); }} className={`${dropped ? '!bg-routex-amber' : '!bg-white/5 border border-white/10'} !py-3`}>
                     <span className="text-[10px]">{dropped ? "DROPPED ✓" : "I'VE BEEN DROPPED"}</span>
                  </AnimatedButton>
               </div>
            </motion.div>

            {/* Alarm Modal */}
            <AnimatePresence>
               {showAlarmModal && (
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-8">
                     <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-sm">
                        <GlassCard className="p-10 text-center">
                           <Bell className="w-16 h-16 text-routex-cyan mx-auto mb-6" />
                           <h2 className="text-3xl font-display mb-4 tracking-widest">ALARM STATION</h2>
                           <p className="text-xs text-routex-textMuted uppercase mb-10 tracking-widest">Select your arrival stop</p>
                           <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 mb-10 outline-none text-white appearance-none text-center">
                              {busInfo.stops.map(s => <option key={s} className="bg-routex-bg">{s}</option>)}
                           </select>
                           <div className="flex gap-4">
                              <button onClick={() => setShowAlarmModal(false)} className="flex-1 text-[10px] font-black uppercase tracking-widest text-routex-textMuted">Cancel</button>
                              <AnimatedButton onClick={setAlarm} className="flex-[2] !py-3">Activate</AnimatedButton>
                           </div>
                        </GlassCard>
                     </motion.div>
                  </div>
               )}
            </AnimatePresence>

            {/* Alarm Triggered Overlay */}
            <AnimatePresence>
               {alarmTriggered && (
                  <div className="fixed inset-0 bg-routex-danger z-[1000] flex flex-col items-center justify-center p-10 animate-pulse">
                     <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                        <ShieldAlert className="w-40 h-40 text-white mb-10" />
                        <h1 className="text-7xl font-display text-white tracking-[0.2em] mb-4">WAKE UP!</h1>
                        <h2 className="text-3xl font-display text-white/80 tracking-widest">YOUR STOP IS NEXT</h2>
                        <button onClick={() => setAlarmTriggered(false)} className="mt-20 bg-white text-routex-danger px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] text-xl shadow-2xl">Dismiss Alarm</button>
                     </motion.div>
                  </div>
               )}
            </AnimatePresence>

            {/* Driver Inbox Drawer */}
            {driverMessage && (
               <motion.div initial={{ x: 300 }} animate={{ x: 0 }} className="fixed top-24 right-6 left-6 z-[90]">
                  <GlassCard className="p-6 border-routex-cyan/30 bg-routex-cyan/5 flex gap-4 items-start shadow-2xl">
                     <MessageSquare className="w-6 h-6 text-routex-cyan flex-shrink-0" />
                     <div className="flex-1">
                        <p className="text-[10px] text-routex-cyan uppercase font-black mb-1">Incoming Message • {busInfo.driver}</p>
                        <p className="text-sm font-medium leading-relaxed">{driverMessage}</p>
                     </div>
                     <button onClick={() => setDriverMessage(null)} className="text-white/20 text-xl">&times;</button>
                  </GlassCard>
               </motion.div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
