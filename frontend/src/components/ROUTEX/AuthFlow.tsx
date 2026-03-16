"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle, Mail, Lock, Shield, Info } from 'lucide-react';
import { GlassPanel, PrimaryButton, FloatingInput, MeshBackground } from './Primitives';
import toast from 'react-hot-toast';

const MOCK_USERS: any = {
  "student@college.edu": { 
    password:"Student@123", role:"student",
    name:"Priya Sharma", bus:"BUS007", 
    stop:"Anna Nagar", parent:"+91 98765 43210" 
  },
  "driver001": { 
    password:"Driver@123", role:"driver",
    name:"Rajan Kumar", busCode:"BUS007" 
  },
  "admin": { 
    password:"Admin@123", role:"admin", name:"Admin" 
  }
};

export default function AuthFlow({ onLogin }: { onLogin: (role: 'student'|'driver'|'admin', user: any) => void }) {
  const [role, setRole] = useState<'student' | 'driver' | 'admin'>('student');
  const [formData, setFormData] = useState({ id: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const user = MOCK_USERS[formData.id];
      
      if (!user) {
        toast.error("Incorrect credentials. Please try again.");
        setLoading(false);
        return;
      }

      if (formData.password !== user.password) {
        toast.error("Incorrect password. Please try again.");
        setLoading(false);
        return;
      }

      // Strict role-locking rules
      if (user.role === 'student' && role === 'driver') {
        toast.error("These are student credentials. Switch to Student.");
        setLoading(false);
        return;
      }
      if (user.role === 'student' && role === 'admin') {
        toast.error("Access denied. Admin credentials required.");
        setLoading(false);
        return;
      }
      if (user.role === 'driver' && role === 'student') {
        toast.error("These are driver credentials. Switch to Driver.");
        setLoading(false);
        return;
      }
      if (user.role === 'driver' && role === 'admin') {
        toast.error("Access denied. Admin credentials required.");
        setLoading(false);
        return;
      }
      if (user.role === 'admin' && role === 'student') {
        toast.error("Admin credentials cannot access student portal.");
        setLoading(false);
        return;
      }
      if (user.role === 'admin' && role === 'driver') {
        toast.error("Admin credentials cannot access driver portal.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      toast.success(`Access Granted: Welcome ${user.name}`);
      setTimeout(() => {
        onLogin(role, user);
      }, 800);
    }, 1500);
  };

  const getRoleIcon = (r: string) => {
    switch(r) {
      case 'student': return '🎓';
      case 'driver': return '🚌';
      case 'admin': return '🛡️';
      default: return '';
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col lg:flex-row items-center justify-center p-6 overflow-hidden">
      <MeshBackground />
      
      {/* Left Side: Brand Statement */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-start lg:pr-12 lg:pl-24 mb-12 lg:mb-0 z-10">
        <div className="space-y-1 overflow-hidden">
          {["TRACK.", "BOARD.", "ARRIVE."].map((word, i) => (
            <motion.h1 
              key={word}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl lg:text-8xl font-['Clash_Display',sans-serif] font-bold tracking-tighter leading-none text-[var(--text-primary)]"
            >
              {word}
            </motion.h1>
          ))}
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-8 text-lg font-['Satoshi',sans-serif] text-[var(--text-secondary)] tracking-wide max-w-sm"
        >
          Real-time college bus intelligence for modern campuses. Experience the future of student transit.
        </motion.p>

        <div className="mt-12 flex flex-wrap gap-3">
          {[
            { icon: '📍', label: 'Live GPS Tracking' },
            { icon: '🔔', label: 'Smart Alerts' },
            { icon: '👨‍👩‍👧', label: 'Parent Updates' }
          ].map((pill, i) => (
            <motion.div
              key={pill.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 + (i * 0.1), duration: 0.5 }}
              className="px-4 py-2 glass-panel !rounded-full text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] flex items-center gap-2"
            >
              <span>{pill.icon}</span> {pill.label}
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex items-center gap-3 opacity-40 grayscale group hover:grayscale-0 transition-all duration-500">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white font-bold italic">R</div>
          <span className="font-['Clash_Display',sans-serif] font-bold tracking-[0.4em] text-xl">ROUTEX</span>
        </div>
      </div>

      {/* Right Side: Login Card */}
      <div className="w-full lg:w-[55%] flex items-center justify-center z-10 relative">
        {/* Subtle bloom behind card */}
        <div className="absolute w-[400px] h-[400px] bg-[var(--primary)] opacity-[0.08] blur-[120px] rounded-full animate-pulse" />
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[500px] animate-float px-2"
        >
          <GlassPanel className="!p-8 md:!p-16 border-[var(--border-glass)] shadow-[0_8px_64px_rgba(0,0,0,0.4)]">
            <header className="mb-12">
               <div className="flex justify-between items-center mb-10 pb-2 gap-3">
                  {(['student', 'driver', 'admin'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 p-4 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-2 group ${role === r ? 'border-[var(--primary)] bg-[var(--primary)]/20 shadow-[0_0_20px_var(--primary-glow)] scale-105' : 'border-[var(--border-glass)] bg-transparent hover:border-[var(--primary)]/40'}`}
                    >
                      <span className={`text-2xl transition-all duration-300 ${role === r ? 'scale-110 drop-shadow-[0_0_8px_var(--primary)]' : 'opacity-40 grayscale'}`}>
                        {getRoleIcon(r)}
                      </span>
                      <span className={`text-[10px] uppercase font-bold tracking-widest transition-all duration-300 ${role === r ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] opacity-60'}`}>
                        {r}
                      </span>
                    </button>
                  ))}
               </div>
            </header>

            <AnimatePresence mode="wait">
              <motion.form
                key={role}
                initial={{ opacity: 0, filter: 'blur(8px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {role === 'student' && (
                  <FloatingInput 
                    label="ACADEMIC EMAIL" 
                    icon={Mail} 
                    value={formData.id} 
                    onChange={(e: any) => setFormData({...formData, id: e.target.value})} 
                  />
                )}
                {role === 'driver' && (
                  <FloatingInput 
                    label="EMPLOYEE ID" 
                    icon={UserCircle} 
                    value={formData.id} 
                    onChange={(e: any) => setFormData({...formData, id: e.target.value})} 
                  />
                )}
                {role === 'admin' && (
                  <FloatingInput 
                    label="ADMINISTRATOR ID" 
                    icon={Shield} 
                    value={formData.id} 
                    onChange={(e: any) => setFormData({...formData, id: e.target.value})} 
                  />
                )}

                <FloatingInput 
                  label="SECURE PASSWORD" 
                  type="password" 
                  icon={Lock} 
                  value={formData.password} 
                  onChange={(e: any) => setFormData({...formData, password: e.target.value})} 
                />

                <p className="text-[10px] text-[var(--text-secondary)] opacity-60 italic tracking-widest font-['Satoshi',sans-serif] flex items-center gap-2">
                  <Info className="w-3 h-3" />
                  {role === 'student' ? 'Use your institution email address' : role === 'driver' ? 'Contact admin if you forgot your ID' : 'Authorized personnel only'}
                </p>

                <div className="pt-6">
                  <PrimaryButton loading={loading} success={success}>
                    Initialize Portal
                  </PrimaryButton>
                </div>
              </motion.form>
            </AnimatePresence>

            <footer className="mt-12 text-center">
               <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.3em] font-['Satoshi',sans-serif]">
                 Request Access? <span className="text-[var(--text-accent)] cursor-pointer hover:underline">Contact Cloud Admin</span>
               </p>
            </footer>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
}
