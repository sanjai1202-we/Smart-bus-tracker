"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Bus, Shield, Lock, Mail, Hash, UserCheck, Eye, EyeOff } from 'lucide-react';
import { ParticleBackground, GlassCard, AnimatedButton, FloatInput } from './Shared';

export default function AuthFlow({ onLogin }: { onLogin: (role: 'student'|'driver'|'admin') => void }) {
  const [activeTab, setActiveTab] = useState<'student'|'driver'|'admin'>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Forms states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [empId, setEmpId] = useState('');
  const [adminId, setAdminId] = useState('');

  const handleLogin = (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Mock verification
    setTimeout(() => {
      let success = false;
      if (activeTab === 'student' && email === 'student@college.edu' && password === 'Student@123') success = true;
      if (activeTab === 'driver' && empId === 'driver001' && password === 'Driver@123') success = true;
      if (activeTab === 'admin' && adminId === 'admin' && password === 'Admin@123') success = true;

      setLoading(false);
      if (success) {
        onLogin(activeTab);
      } else {
        setError(true);
      }
    }, 1500);
  };

  const tabs = [
    { id: 'student', icon: GraduationCap, label: 'Student' },
    { id: 'driver', icon: Bus, label: 'Driver' },
    { id: 'admin', icon: Shield, label: 'Admin' }
  ];

  return (
    <div className="relative w-full h-[100dvh] flex items-center justify-center p-6 overflow-hidden bg-routex-bg">
      <ParticleBackground />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <motion.h1 
            className="text-7xl font-display tracking-[0.15em] text-white flex flex-col items-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            ROUTEX
            <motion.div 
              className="h-1 bg-routex-primary mt-2"
              initial={{ width: 0 }}
              animate={{ width: "80%" }}
              transition={{ delay: 0.5, duration: 1 }}
            />
          </motion.h1>
          <p className="font-body text-[10px] uppercase tracking-[0.5em] text-routex-textMuted mt-4">Smart Campus Transit</p>
        </div>

        <GlassCard className="p-8 border-white/5 shadow-2xl">
          {/* Role Pill Selector */}
          <div className="flex bg-white/5 p-1 rounded-2xl mb-10 relative">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setError(false); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all z-10 ${activeTab === tab.id ? 'text-white' : 'text-routex-textMuted hover:text-white'}`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
            <motion.div
              layoutId="activeTab"
              className="absolute inset-y-1 bg-routex-primary rounded-xl"
              initial={false}
              animate={{ 
                left: `calc(${(tabs.findIndex(t => t.id === activeTab) * 33.33)}% + 4px)`,
                width: `calc(33.33% - 8px)` 
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'student' && (
                  <FloatInput label="Institutional Email" value={email} onChange={(e: any) => setEmail(e.target.value)} error={error} />
                )}
                {activeTab === 'driver' && (
                  <FloatInput label="Employee ID" value={empId} onChange={(e: any) => setEmpId(e.target.value)} error={error} />
                )}
                {activeTab === 'admin' && (
                  <FloatInput label="Admin Portal ID" value={adminId} onChange={(e: any) => setAdminId(e.target.value)} error={error} />
                )}

                <div className="relative">
                  <FloatInput 
                    label="Access Password" 
                    type={showPass ? "text" : "password"} 
                    value={password} 
                    onChange={(e: any) => setPassword(e.target.value)} 
                    error={error} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-3 text-routex-textMuted hover:text-white"
                  >
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            <motion.div animate={error ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }}>
              <AnimatedButton disabled={loading}>
                {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...</span> : "Authenticate"}
              </AnimatedButton>
            </motion.div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center text-[10px] uppercase tracking-tighter text-routex-danger font-mono font-bold"
              >
                Unauthorized: Invalid Credentials Provided
              </motion.p>
            )}
          </form>

          <footer className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] text-routex-textMuted uppercase tracking-[0.2em]">Authorized Personnel Only</p>
          </footer>
        </GlassCard>
      </motion.div>
    </div>
  );
}
