"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Building2, UserCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
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

    try {
      await api.post('/auth/register', { 
        ...formData,
        role: 'student' 
      });
      toast.success('Registration successful. You can now log in.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary-600/10 blur-[150px] rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-teal-500/5 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '3s' }}></div>

      <div className="w-full max-w-2xl p-10 relative z-10">
        <div className="glass-card p-10 rounded-[48px] border-white/5 animate-in">
          <div className="text-center mb-10">
             <div className="inline-flex items-center justify-center p-4 bg-primary-500/10 rounded-3xl mb-6 text-primary-400 ring-1 ring-primary-500/20 shadow-[0_0_30px_rgba(20,184,166,0.1)]">
              <UserCircle className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Join the Network</h1>
            <p className="text-textMuted text-sm font-medium tracking-wide">Enter your details to register as a student.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-textMuted uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" name="name" required placeholder="John Doe" onChange={handleChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-white font-medium transition-all placeholder:text-gray-600"/>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-textMuted uppercase tracking-widest ml-1">College Code</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-primary-500/50 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input type="text" name="college_code" required placeholder="DEMO-123" onChange={handleChange} className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-white font-medium transition-all placeholder:text-gray-600 uppercase tracking-wider"/>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="block text-xs font-bold text-textMuted uppercase tracking-widest ml-1">Email</label>
                 <input type="email" name="email" required placeholder="name@college.edu" onChange={handleChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-white font-medium transition-all placeholder:text-gray-600"/>
              </div>
              <div className="space-y-2">
                 <label className="block text-xs font-bold text-textMuted uppercase tracking-widest ml-1">Password</label>
                 <input type="password" name="password" required placeholder="••••••••" onChange={handleChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-white font-medium transition-all placeholder:text-gray-600"/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-textMuted uppercase tracking-widest ml-1">Your Contact</label>
                <input type="tel" name="phone" required placeholder="+91 00000 00000" onChange={handleChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-white font-medium transition-all placeholder:text-gray-600"/>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-textMuted uppercase tracking-widest ml-1">Parent Contact</label>
                <input type="tel" name="parent_phone" required placeholder="+91 00000 00000" onChange={handleChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-white font-medium transition-all placeholder:text-gray-600"/>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full mt-6 py-5 px-6 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-950 bg-primary-500 hover:bg-primary-400 focus:outline-none transition-all hover:scale-[1.01] active:scale-95 shadow-[0_20px_40px_rgba(20,184,166,0.2)] disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Complete Registration'}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-textMuted font-medium">
              Already a member?{' '}
              <Link href="/login" className="font-bold text-primary-500 hover:text-primary-400 transition-colors underline-offset-4 hover:underline">
                Log in and track
              </Link>
            </p>
          </div>
        </div>
        
        <p className="mt-8 text-center text-[10px] font-bold text-textMuted/40 uppercase tracking-[0.3em] font-sans">
          Powered by Smart Mobility Systems
        </p>
      </div>
    </div>
  );
}
