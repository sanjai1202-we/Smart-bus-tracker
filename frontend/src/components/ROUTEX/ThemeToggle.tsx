"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div 
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-[88px] h-[36px] glass-panel p-1 flex items-center cursor-pointer overflow-hidden group select-none"
      style={{ borderRadius: '99px' }}
    >
      {/* Sliding Background Pill */}
      <motion.div
        animate={{ x: isDark ? 0 : 48 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute w-[36px] h-[28px] bg-[var(--primary)] rounded-full shadow-[0_0_15px_var(--primary-glow)]"
      />

      <div className="relative z-10 w-full flex justify-between px-2 items-center text-[10px] font-bold uppercase tracking-tighter">
        <div className={`flex items-center gap-1 transition-colors duration-300 ${isDark ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
          <Moon className="w-3 h-3" />
          <span>Dark</span>
        </div>
        <div className={`flex items-center gap-1 transition-colors duration-300 ${!isDark ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'}`}>
          <Sun className="w-3 h-3" />
          <span>Light</span>
        </div>
      </div>
    </div>
  );
};
