"use client";
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AuthFlow from '../components/ROUTEX/AuthFlow';
import StudentFlow from '../components/ROUTEX/StudentFlow';
import DriverFlow from '../components/ROUTEX/DriverFlow';
import AdminFlow from '../components/ROUTEX/AdminFlow';
import { useAuthStore } from '../store/authStore';

export default function RoutexApp() {
  const { user, login, logout, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Rehydrate from localStorage on mount
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      try {
        login(JSON.parse(savedUser), savedToken);
      } catch (e) {
        console.error('Failed to rehydrate auth', e);
      }
    }
    setMounted(true);
  }, []);

  const handleLogin = (role: 'student'|'driver'|'admin') => {
    // For demo, we mock the user object based on role
    const mockUser = {
      name: role === 'student' ? 'Priya Sharma' : role === 'driver' ? 'John Driver' : 'Campus Admin',
      role: role,
      email: role + '@college.edu'
    };
    login(mockUser, 'mock-jwt-token');
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', 'mock-jwt-token');
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-routex-bg text-white font-body selection:bg-routex-primary selection:text-white">
      <AnimatePresence mode="wait">
        {!isAuthenticated && (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="w-full h-full"
          >
            <AuthFlow onLogin={handleLogin} />
          </motion.div>
        )}

        {isAuthenticated && user?.role === 'student' && (
          <motion.div
            key="student"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "circOut" }}
            className="w-full h-full"
          >
            <StudentFlow onLogout={handleLogout} />
          </motion.div>
        )}

        {isAuthenticated && user?.role === 'driver' && (
          <motion.div
            key="driver"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6, ease: "circOut" }}
            className="w-full h-full"
          >
            <DriverFlow onLogout={handleLogout} />
          </motion.div>
        )}

        {isAuthenticated && user?.role === 'admin' && (
          <motion.div
            key="admin"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="w-full h-full"
          >
            <AdminFlow onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Cinematic Filter */}
      <div className="fixed inset-0 pointer-events-none z-[9999] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}
