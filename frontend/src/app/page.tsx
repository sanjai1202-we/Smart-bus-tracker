"use client";
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AuthFlow from '../components/ROUTEX/AuthFlow';
import StudentFlow from '../components/ROUTEX/StudentFlow';
import DriverFlow from '../components/ROUTEX/DriverFlow';
import AdminFlow from '../components/ROUTEX/AdminFlow';

export default function RoutexApp() {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    role: 'student' | 'driver' | 'admin' | null;
    user: any;
  }>({
    isAuthenticated: false,
    role: null,
    user: null,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check localStorage for session rehydration
    const savedUser = localStorage.getItem('routex_user');
    const savedRole = localStorage.getItem('routex_role');
    if (savedUser && savedRole) {
      setAuthState({
        isAuthenticated: true,
        role: savedRole as any,
        user: JSON.parse(savedUser)
      });
    }
    setMounted(true);
  }, []);

  const handleLogin = (role: 'student' | 'driver' | 'admin', user: any) => {
    setAuthState({
      isAuthenticated: true,
      role,
      user
    });
    localStorage.setItem('routex_user', JSON.stringify(user));
    localStorage.setItem('routex_role', role);
  };

  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      role: null,
      user: null
    });
    localStorage.removeItem('routex_user');
    localStorage.removeItem('routex_role');
  };

  if (!mounted) return null;

  return (
    <main className="w-full h-screen bg-routex-dark selection:bg-routex-teal selection:text-routex-dark">
      <AnimatePresence mode="wait">
        {!authState.isAuthenticated && (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ 
              opacity: 0, 
              filter: 'blur(10px)',
              transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
            }}
            className="w-full h-full"
          >
            <AuthFlow onLogin={handleLogin} />
          </motion.div>
        )}

        {authState.isAuthenticated && authState.role === 'student' && (
          <motion.div
            key="student"
            initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            <StudentFlow onLogout={handleLogout} />
          </motion.div>
        )}

        {authState.isAuthenticated && authState.role === 'driver' && (
          <motion.div
            key="driver"
            initial={{ opacity: 0, x: 100, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            <DriverFlow onLogout={handleLogout} />
          </motion.div>
        )}

        {authState.isAuthenticated && authState.role === 'admin' && (
          <motion.div
            key="admin"
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            <AdminFlow onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Vignette */}
      <div className="fixed inset-0 pointer-events-none z-[100] shadow-[inset_0_0_150px_rgba(0,0,0,0.6)]" />
    </main>
  );
}
