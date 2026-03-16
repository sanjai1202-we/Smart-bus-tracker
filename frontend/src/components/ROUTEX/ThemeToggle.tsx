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

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-3 rounded-2xl bg-routex-glass border border-routex-glassBorder shadow-lg backdrop-blur-xl transition-all duration-300"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-routex-primary" />
      ) : (
        <Moon className="w-5 h-5 text-routex-primary" />
      )}
    </motion.button>
  );
};
