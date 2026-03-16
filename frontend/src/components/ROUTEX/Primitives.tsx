"use client";
import React from 'react';
import { motion } from 'framer-motion';

export const GlassPanel = ({ children, className = "", hoverEffect = false, onClick }: any) => (
  <motion.div
    onClick={onClick}
    whileHover={hoverEffect ? { y: -4, backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.2)' } : {}}
    className={`glass-panel p-6 ${className}`}
  >
    {children}
  </motion.div>
);

export const PrimaryButton = ({ children, onClick, className = "", disabled = false, neon = false, variant = 'indigo' }: any) => {
  const variants: any = {
    indigo: 'from-blue-600 to-indigo-700 shadow-indigo-500/20',
    teal: 'from-routex-teal/80 to-emerald-600 shadow-teal-500/20',
    amber: 'from-amber-500 to-orange-600 shadow-amber-500/20',
    danger: 'from-red-500 to-rose-700 shadow-red-500/20'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 rounded-2xl bg-gradient-to-br font-bold uppercase tracking-widest text-sm text-white shadow-xl transition-all disabled:opacity-50 disabled:grayscale ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export const FloatingInput = ({ label, type = "text", value, onChange, icon: Icon, error }: any) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <div className="relative mb-6">
      <motion.label
        initial={false}
        animate={{
          y: (focused || value) ? -10 : 16,
          x: (focused || value) ? 0 : 20,
          scale: (focused || value) ? 0.75 : 1,
          color: error ? '#EF4444' : (focused ? '#4F46E5' : '#94A3B8')
        }}
        className="absolute left-0 top-0 pointer-events-none transform origin-left transition-all z-10"
      >
        {label}
      </motion.label>
      <div className="relative group">
        {Icon && <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focused ? 'text-routex-primary' : 'text-slate-500'}`} />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full bg-white/5 border-2 rounded-2xl py-4 pr-4 pl-12 outline-none transition-all font-medium ${error ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : (focused ? 'border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.3)]' : 'border-white/5')}`}
        />
      </div>
    </div>
  );
};

export const MeshBackground = ({ variant = 'indigo' }: { variant?: 'indigo' | 'amber' | 'red' | 'teal' }) => {
  const blooms = {
    indigo: 'mesh-bloom-indigo',
    amber: 'mesh-bloom-amber',
    red: 'mesh-bloom-red',
    teal: 'mesh-bloom-teal'
  };

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      <div className="animated-mesh w-full h-full" />
      <div className={`absolute inset-0 transition-opacity duration-1000 ${blooms[variant as keyof typeof blooms] || ''}`} />
      
      {/* Floating Geometric Elements */}
      <motion.div
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-64 h-64 border border-white/5 rounded-full"
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-white/5 rounded-[40px] rotate-45"
      />
    </div>
  );
};
