"use client";
import React from 'react';
import { motion } from 'framer-motion';

export const GlassPanel = ({ children, className = "", hoverEffect = false, onClick }: any) => (
  <motion.div
    onClick={onClick}
    whileHover={hoverEffect ? { y: -4, backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--primary)' } : {}}
    className={`glass-panel p-6 relative overflow-hidden group ${className}`}
  >
    {/* Subtle SVG Noise Grain Overlay */}
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.65%22%20numOctaves%3D%223%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22%2F%3E%3C%2Fsvg%3E')]" />
    <div className="relative z-10">{children}</div>
  </motion.div>
);

export const PrimaryButton = ({ children, onClick, className = "", disabled = false, loading = false, success = false }: any) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full h-[52px] rounded-[14px] bg-gradient-to-r from-[var(--primary)] to-[#6366f1] font-['Satoshi',sans-serif] font-semibold uppercase tracking-[0.2em] text-sm text-white shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:shadow-inner ${className}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
           <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
           Verifying...
        </span>
      ) : success ? (
        <span className="flex items-center gap-2">
           <svg className="w-5 h-5 text-white animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
           Welcome Back
        </span>
      ) : (
        <>
          {children}
          <span className="group-hover:translate-x-1 transition-transform">{"→"}</span>
        </>
      )}
    </motion.button>
  );
};

export const FloatingInput = ({ label, type = "text", value, onChange, icon: Icon, error, name }: any) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <div className="relative mb-6">
      <motion.label
        initial={false}
        animate={{
          y: (focused || value) ? -10 : 20,
          x: (focused || value) ? 0 : 48,
          scale: (focused || value) ? 0.75 : 1,
          color: error ? 'var(--alert)' : (focused ? 'var(--primary)' : 'var(--text-secondary)')
        }}
        className="absolute left-0 top-0 pointer-events-none transform origin-left transition-all z-20 font-['Satoshi',sans-serif] uppercase tracking-widest text-[10px] font-bold"
      >
        {label}
      </motion.label>
      <div className={`relative group transition-all duration-300 ${error ? 'animate-shake' : ''}`}>
        {Icon && <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors z-20 ${focused ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'}`} />}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full bg-[var(--bg-glass)] border-2 rounded-[16px] py-4 pr-4 pl-12 outline-none transition-all font-['Satoshi',sans-serif] font-medium text-[var(--text-primary)] z-10 ${error ? 'border-[var(--alert)] shadow-[0_0_15px_rgba(239,68,68,0.2)]' : (focused ? 'border-[var(--primary)] shadow-[0_0_20px_var(--primary-glow)]' : 'border-[var(--border-glass)]')}`}
        />
      </div>
    </div>
  );
};

export const MeshBackground = ({ variant = 'indigo' }: any) => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[var(--bg-base)]">
      {/* Animated Gradient Mesh */}
      <div className="absolute inset-0 opacity-40 dark:opacity-60" 
           style={{ background: 'var(--gradient-bg)', backgroundSize: '200% 200%', animation: 'gradientShift 15s ease infinite alternate' }} />
      
      {/* Ghost Orbital Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-10">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-[1px] border-[var(--text-primary)] rounded-full opacity-20 scale-[0.8]" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-[1px] border-[var(--text-primary)] rounded-full opacity-10 scale-[0.6]" />
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-[1px] border-[var(--text-primary)] rounded-full opacity-5 scale-[0.4]" />
      </div>

      {/* Constellation Overlay (Optional Canvas would be here, using CSS for now) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_1px,_transparent_1px)] bg-[length:40px_40px] opacity-[0.03]" />
    </div>
  );
};
