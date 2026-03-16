"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Bus, Shield, Eye, EyeOff, UserCheck, Lock } from 'lucide-react';
import { GlassPanel, PrimaryButton, FloatingInput, MeshBackground } from './Primitives';
import toast from 'react-hot-toast';

export default function AuthFlow({ onLogin }: { onLogin: (role: 'student'|'driver'|'admin', user: any) => void }) {
  const [activeTab, setActiveTab] = useState<'student'|'driver'|'admin'>('student');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  
  // States
  const [email, setEmail] = useState('');
  const [empId, setEmpId] = useState('');
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');

  const roles = [
    { id: 'student', icon: GraduationCap, label: 'Student', hint: 'Use your college email' },
    { id: 'driver', icon: Bus, label: 'Driver', hint: 'Use your driver ID' },
    { id: 'admin', icon: Shield, label: 'Admin', hint: 'Authorized personnel only' }
  ];

  const handleLogin = (e: any) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      let success = false;
      let user = null;

      if (activeTab === 'student') {
        if (email === 'student@college.edu' && password === 'Student@123') {
           success = true;
           user = { name: "Priya Sharma", role: "student" };
        } else if (empId || adminId) {
          toast.error("Incorrect portal. Please use Student login.");
        } else {
          toast.error("Invalid student credentials");
        }
      } else if (activeTab === 'driver') {
        if (empId === 'driver001' && password === 'Driver@123') {
          success = true;
          user = { name: "Rajan Kumar", role: "driver" };
        } else if (email === 'student@college.edu') {
          toast.error("These are student credentials. Select Student role.");
        } else {
          toast.error("Invalid driver credentials");
        }
      } else if (activeTab === 'admin') {
        if (adminId === 'admin' && password === 'Admin@123') {
          success = true;
          user = { name: "Campus Admin", role: "admin" };
        } else {
          toast.error("Invalid admin credentials");
        }
      }

      if (success) {
        toast.success(`Access Granted: Welcome ${user?.name}`);
        onLogin(activeTab, user);
      }
    }, 1500);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-routex-dark">
      <MeshBackground variant={activeTab === 'student' ? 'indigo' : activeTab === 'driver' ? 'amber' : 'red'} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg z-10"
      >
        <div className="text-center mb-12">
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block p-4 bg-routex-teal/10 rounded-[30px] border border-routex-teal/20 mb-6"
          >
            <Bus className="w-12 h-12 text-routex-teal" />
          </motion.div>
          <h1 className="text-6xl font-display tracking-[0.2em] text-white">ROUTEX</h1>
          <p className="font-display text-[10px] uppercase tracking-[0.6em] text-routex-textMuted mt-4 opacity-70">
            Your Campus. Your Ride. Live.
          </p>
        </div>

        <GlassPanel className="relative p-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-transparent via-routex-primary to-transparent opacity-20" />
          
          {/* Role Selector */}
          <div className="grid grid-cols-3 gap-3 mb-12 bg-white/5 p-1.5 rounded-[22px]">
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => { setActiveTab(role.id as any); setPassword(''); }}
                className={`flex flex-col items-center gap-2 py-4 rounded-[18px] transition-all relative overflow-hidden ${activeTab === role.id ? 'bg-routex-primary/20 text-white border border-routex-primary/40 shadow-xl' : 'text-routex-textMuted hover:text-white'}`}
              >
                <role.icon className={`w-5 h-5 ${activeTab === role.id ? 'text-routex-teal' : ''}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{role.label}</span>
                {activeTab === role.id && (
                  <motion.div layoutId="tabGlow" className="absolute inset-0 bg-routex-primary/10 blur-xl" />
                )}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'student' && (
                  <FloatingInput label="Academic Email" value={email} onChange={(e: any) => setEmail(e.target.value)} icon={UserCheck} />
                )}
                {activeTab === 'driver' && (
                  <FloatingInput label="Employee Personal ID" value={empId} onChange={(e: any) => setEmpId(e.target.value)} icon={UserCheck} />
                )}
                {activeTab === 'admin' && (
                  <div className="relative">
                    <Shield className="absolute right-4 top-4 w-5 h-5 text-routex-amber opacity-50 z-20" />
                    <FloatingInput label="Administrator ID" value={adminId} onChange={(e: any) => setAdminId(e.target.value)} icon={Lock} />
                  </div>
                )}

                <div className="relative">
                  <FloatingInput label="Security Pin" type={showPass ? "text" : "password"} value={password} onChange={(e: any) => setPassword(e.target.value)} icon={Lock} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors">
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="pt-4">
              <PrimaryButton disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  "Infiltrate Portal"
                )}
              </PrimaryButton>
            </div>
            
            <p className="text-center text-[10px] text-routex-textMuted uppercase tracking-widest opacity-50">
              {roles.find(r => r.id === activeTab)?.hint}
            </p>
          </form>
        </GlassPanel>

        <footer className="mt-12 text-center">
           <p className="text-[10px] text-routex-textMuted uppercase tracking-[0.4em] opacity-40">Identity Systems V3.0 (Project Routex)</p>
        </footer>
      </motion.div>
    </div>
  );
}
