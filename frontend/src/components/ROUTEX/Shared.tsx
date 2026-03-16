"use client";
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: any[] = [];
    const particleCount = 60;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      x: number; y: number; vx: number; vy: number;
      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(91, 78, 255, 0.4)';
      ctx.strokeStyle = 'rgba(91, 78, 255, 0.05)';

      particles.forEach((p, i) => {
        p.update();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 150) {
            ctx.lineWidth = 1 - dist / 150;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    };
    animate();

    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

export const GlassCard = ({ children, className = "", glowOnHover = true, onClick }: { children: React.ReactNode, className?: string, glowOnHover?: boolean, onClick?: () => void }) => (
  <motion.div
    whileHover={glowOnHover ? { y: -5, boxShadow: "0 20px 40px rgba(91, 78, 255, 0.2)" } : {}}
    onClick={onClick}
    className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

export const AnimatedButton = ({ children, onClick, className = "", disabled = false, glow = true }: any) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.05, boxShadow: glow ? "0 0 20px rgba(91, 78, 255, 0.5)" : "none" } : {}}
    whileTap={!disabled ? { scale: 0.97 } : {}}
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${disabled ? 'opacity-50 grayscale cursor-not-allowed bg-gray-600' : 'bg-routex-primary text-white'} ${className}`}
  >
    {children}
  </motion.button>
);

export const FloatInput = ({ label, type = "text", value, onChange, error }: any) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <div className="relative mb-6">
      <motion.label
        initial={false}
        animate={{
          y: (focused || value) ? -28 : 0,
          x: (focused || value) ? 0 : 12,
          scale: (focused || value) ? 0.8 : 1,
          color: error ? "#FF4E4E" : (focused ? "#5B4EFF" : "#7B7B9A")
        }}
        className="absolute left-0 top-3 text-sm font-bold pointer-events-none font-body uppercase tracking-wider"
      >
        {label}
      </motion.label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full bg-white/5 border-b-2 px-3 py-3 font-medium text-white outline-none transition-all ${error ? 'border-routex-danger' : (focused ? 'border-routex-primary' : 'border-white/10')}`}
      />
    </div>
  );
};
