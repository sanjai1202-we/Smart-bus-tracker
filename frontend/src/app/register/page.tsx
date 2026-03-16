"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, UserCircle, Mail, Lock, Phone, ArrowLeft } from 'lucide-react';
import { GlassPanel, PrimaryButton, FloatingInput, MeshBackground } from '@/components/ROUTEX/Primitives';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college_code: '',
    phone: '',
    parent_phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulating registration for UI demo
    setTimeout(() => {
        setLoading(false);
        toast.success("Registration node initialized. Proceed to login.");
    }, 2000);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-background overflow-hidden transition-colors duration-300">
      <MeshBackground variant="indigo" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl z-10"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-routex-textMuted hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Portal
        </Link>

        <GlassPanel className="p-10 md:p-16">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-display tracking-[0.2em] text-foreground uppercase mb-4">Initialize Identity</h1>
            <p className="text-[10px] text-routex-textMuted uppercase tracking-[0.4em] opacity-60">Join the ROUTEX transit ecosystem</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FloatingInput label="FULL LEGAL NAME" name="name" icon={UserCircle} onChange={handleChange} />
              <FloatingInput label="SECURE PASSWORD" name="password" type="password" icon={Lock} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FloatingInput label="ACADEMIC EMAIL" name="email" icon={Mail} onChange={handleChange} />
              <FloatingInput label="COLLEGE DEPLOYMENT CODE" name="college_code" icon={Building2} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FloatingInput label="PERSONAL TERMINAL (SMS)" name="phone" icon={Phone} onChange={handleChange} />
              <FloatingInput label="PARENT/GUARDIAN UPLINK" name="parent_phone" icon={Phone} onChange={handleChange} />
            </div>

            <div className="pt-6">
              <PrimaryButton disabled={loading}>
                {loading ? "Synchronizing Cloud..." : "Register Identity"}
              </PrimaryButton>
            </div>
          </form>

          <footer className="mt-12 text-center pt-8 border-t border-white/5">
            <p className="text-[10px] text-routex-textMuted uppercase tracking-widest">
              Already cataloged?{' '}
              <Link href="/" className="text-routex-teal hover:underline">Return to Sign In</Link>
            </p>
          </footer>
        </GlassPanel>
      </motion.div>
    </div>
  );
}
