"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, ShieldAlert, CheckCircle, Smartphone, Map as MapIcon, Clock, ChevronRight, User, Share2, MessageSquare, LogOut, Bus, Wifi, WifiOff, MapPin, Zap } from 'lucide-react';
import { GlassCard, AnimatedButton } from './Shared';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';

export default function DriverFlow({ onLogout }: any) {
  const [screen, setScreen] = useState<'activate' | 'dashboard' | 'qr'>('activate');
  const [busCode, setBusCode] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [showTraffic, setShowTraffic] = useState(false);
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'SOS', student: 'Amit R.', stop: 'Koyambedu', time: '10:05 AM', resolved: false },
    { id: 2, type: 'MISSED', student: 'Siddharth M.', message: 'Wait for me!', time: '10:12 AM', resolved: false }
  ]);

  const handleActivate = () => {
    if (busCode.length === 6) {
      setIsActivating(true);
      setTimeout(() => {
        setIsActivating(false);
        setScreen('dashboard');
        toast.success("Bus BUS007 Activated ✓");
      }, 1500);
    } else {
      toast.error("Invalid Admin Code");
    }
  };

  const toggleLive = () => {
    setIsLive(!isLive);
    if (!isLive) toast.success("Live Sharing Active 🟢");
    else toast.error("GPS Sharing Paused 🔴");
  };

  const resolveAlert = (id: number) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, resolved: true } : a));
    toast.success("Alert Acknowledged");
  };

  return (
    <div className="relative w-full h-[100dvh] bg-routex-bg overflow-hidden font-body text-white">
      <AnimatePresence mode="wait">
        
        {/* Screen 1: Activate Bus */}
        {screen === 'activate' && (
          <motion.div key="activate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full p-8 text-center">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="mb-12">
               <div className="w-24 h-24 bg-routex-primary/10 rounded-3xl flex items-center justify-center mx-auto border border-routex-primary/20 shadow-[0_0_30px_rgba(91,78,255,0.2)]">
                  <Zap className="w-12 h-12 text-routex-primary" />
               </div>
            </motion.div>
            <h2 className="text-4xl font-display mb-4 tracking-widest">DRIVE COMMAND</h2>
            <p className="text-xs text-routex-textMuted uppercase tracking-[0.3em] mb-12">Enter Admin Authorization Code</p>
            
            <div className="w-full max-w-xs space-y-6">
              <input 
                type="text" 
                maxLength={6}
                placeholder="0 0 0 0 0 0" 
                value={busCode} 
                onChange={e => setBusCode(e.target.value.toUpperCase())}
                className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-5 text-center text-3xl font-mono tracking-[0.4em] focus:border-routex-primary focus:outline-none transition-all"
              />
              <AnimatedButton onClick={handleActivate} disabled={isActivating}>
                {isActivating ? "Connecting..." : "Initialize Session"}
              </AnimatedButton>
            </div>
          </motion.div>
        )}

        {/* Screen 2: Dashboard */}
        {screen === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
            {/* Top Command Bar */}
            <div className="p-6 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between z-50">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-routex-primary rounded-xl flex items-center justify-center">
                     <Bus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                     <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-widest">Bus BUS007</span>
                        <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2 h-2 bg-routex-success rounded-full shadow-[0_0_10px_#00E87A]" />
                     </div>
                     <p className="text-lg font-display tracking-wider">Main Campus Loop</p>
                  </div>
               </div>
               <div className="flex gap-3">
                  <button onClick={() => setScreen('qr')} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                     <Smartphone className="w-5 h-5 text-routex-textMuted" />
                  </button>
                  <button onClick={onLogout} className="w-12 h-12 rounded-xl bg-routex-danger/10 border border-routex-danger/20 flex items-center justify-center text-routex-danger">
                     <LogOut className="w-5 h-5" />
                  </button>
               </div>
            </div>

            {/* Main Surface */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
               {/* Left: Map & Traffic */}
               <div className="flex-[3] relative bg-gray-900 overflow-hidden min-h-[300px]">
                  <div className="absolute inset-0 opacity-40 bg-[url('https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png')] bg-cover" />
                  
                  {/* Traffic Banner */}
                  <AnimatePresence>
                     {showTraffic && (
                        <motion.div initial={{ y: -50 }} animate={{ y: 20 }} exit={{ y: -50 }} className="absolute inset-x-6 z-40">
                           <GlassCard className="p-4 border-routex-amber/30 bg-routex-amber/10 flex items-center gap-4 shadow-2xl">
                              <ShieldAlert className="w-6 h-6 text-routex-amber animate-pulse" />
                              <div className="flex-1">
                                 <p className="text-[10px] text-routex-amber font-black uppercase tracking-widest">Heavy Congestion - NH-48</p>
                                 <p className="text-sm font-medium">Estimated 12m Delay • Take Outer Ring Road</p>
                              </div>
                           </GlassCard>
                        </motion.div>
                     )}
                  </AnimatePresence>

                  {/* Sharing Toggle Overlay */}
                  <div className="absolute top-6 right-6 z-40">
                     <button onClick={toggleLive} className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all ${isLive ? 'bg-routex-success/20 border-routex-success/40 text-routex-success' : 'bg-routex-danger/20 border-routex-danger/40 text-routex-danger'}`}>
                        {isLive ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isLive ? 'SYSTEM LIVE' : 'GPS PAUSED'}</span>
                     </button>
                  </div>

                  {/* Traffic Toggle */}
                  <div className="absolute bottom-6 left-6 z-40">
                     <button onClick={() => setShowTraffic(!showTraffic)} className={`p-4 rounded-2xl border transition-all ${showTraffic ? 'bg-routex-amber text-black' : 'bg-black/80 text-white border-white/10'}`}>
                        <MapIcon className="w-6 h-6" />
                     </button>
                  </div>
               </div>

               {/* Right: Alert Command Center */}
               <div className="flex-[2] bg-routex-bg border-l border-white/10 p-6 flex flex-col overflow-y-auto">
                  <h3 className="text-[10px] text-routex-textMuted font-black uppercase tracking-[0.4em] mb-6">Student Alert Sync</h3>
                  
                  <div className="space-y-4">
                     {alerts.length === 0 ? (
                        <div className="py-20 text-center flex flex-col items-center">
                           <CheckCircle className="w-12 h-12 text-routex-success opacity-20 mb-4" />
                           <p className="text-xs text-routex-textMuted font-bold uppercase tracking-widest">All Students Accounted For</p>
                        </div>
                     ) : (
                        alerts.map(alert => (
                           <GlassCard key={alert.id} className={`p-5 relative border-l-4 ${alert.type === 'SOS' ? 'border-routex-danger' : 'border-routex-amber'} ${alert.resolved ? 'opacity-40 grayscale' : ''}`}>
                              <div className="flex justify-between items-start mb-3">
                                 <div>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${alert.type === 'SOS' ? 'text-routex-danger' : 'text-routex-amber'}`}>{alert.type} ALERT</p>
                                    <p className="text-lg font-display tracking-wide">{alert.student}</p>
                                 </div>
                                 <span className="text-[10px] font-mono opacity-40">{alert.time}</span>
                              </div>
                              <p className="text-xs font-medium text-routex-textMuted mb-4">
                                 {alert.type === 'SOS' ? `Emergency triggered at ${alert.stop} stop.` : alert.message}
                              </p>
                              
                              <div className="flex gap-2">
                                 {!alert.resolved ? (
                                    <>
                                       <button onClick={() => resolveAlert(alert.id)} className="flex-1 bg-white/5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Acknowledge</button>
                                       {alert.type === 'MISSED' && (
                                          <button className="flex-1 bg-routex-primary py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Send Reply</button>
                                       )}
                                    </>
                                 ) : (
                                    <div className="flex items-center gap-2 text-routex-success text-[10px] font-black uppercase">
                                       <CheckCircle className="w-4 h-4" /> Resolved
                                    </div>
                                 )}
                              </div>
                           </GlassCard>
                        ))
                     )}
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {/* Screen 3: QR Modal */}
        {screen === 'qr' && (
          <motion.div key="qr" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-[100] bg-routex-bg flex flex-col items-center justify-center p-8">
            <div className="absolute top-10 left-10">
               <motion.h1 className="text-4xl font-display tracking-widest">ROUTEX IDENTITY</motion.h1>
            </div>
            
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="relative">
               {/* Glowing QR Container */}
               <div className="relative p-8 bg-white rounded-[40px] shadow-[0_0_100px_rgba(91,78,255,0.4)]">
                  <QRCodeSVG 
                    value="ROUTEX-BUS007-AUTH" 
                    size={280} 
                    level="H" 
                    includeMargin={true}
                  />
                  {/* Animated Overlay */}
                  <div className="absolute inset-4 border-2 border-routex-primary rounded-[32px] animate-strobe pointer-events-none" />
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center overflow-hidden pointer-events-none">
                     <div className="h-1 bg-routex-primary/30 w-full animate-sweep" style={{ animationDuration: '3s' }} />
                  </div>
               </div>
               
               <div className="mt-12 text-center">
                  <h3 className="text-6xl font-mono text-white tracking-[0.3em] font-bold mb-2">BUS007</h3>
                  <p className="text-xs text-routex-textMuted font-black uppercase tracking-[0.4em]">Scan for Boarding Authorization</p>
               </div>
            </motion.div>

            <button onClick={() => setScreen('dashboard')} className="mt-20 text-[10px] font-black uppercase tracking-[0.5em] text-routex-textMuted hover:text-white transition-all">Close Console</button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
