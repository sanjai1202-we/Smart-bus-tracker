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
    <div className="flex min-h-screen bg-background items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary-500/10 blur-[150px] rounded-full animate-float"></div>
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-primary-400/5 blur-[120px] rounded-full animate-float" style={{ animationDelay: '3s' }}></div>

      <div className="w-full max-w-2xl p-6 relative z-10">
        <div className="glass-card p-10 border-white/10 bg-black/40 shadow-2xl animate-in backdrop-blur-xl">
          <div className="text-center mb-10">
             <div className="inline-flex items-center justify-center p-4 bg-primary-500/10 rounded-3xl mb-6 text-primary-400 ring-1 ring-primary-500/20 shadow-sm">
              <UserCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-2">Create Account</h1>
            <p className="text-slate-400 text-sm font-medium tracking-wide">Join your campus mobility network today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" name="name" required placeholder="John Doe" onChange={handleChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-white font-medium transition-all placeholder:text-slate-600"/>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">College Code</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-primary-400 group-focus-within:text-primary-600 transition-colors" />
                  </div>
                  <input type="text" name="college_code" required placeholder="DEMO-123" onChange={handleChange} className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-white font-medium transition-all placeholder:text-slate-600 uppercase tracking-wider"/>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                 <input type="email" name="email" required placeholder="name@college.edu" onChange={handleChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-white font-medium transition-all placeholder:text-slate-600"/>
              </div>
              <div className="space-y-2">
                 <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secret Password</label>
                 <input type="password" name="password" required placeholder="••••••••" onChange={handleChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-white font-medium transition-all placeholder:text-slate-600"/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Personal Contact</label>
                <input type="tel" name="phone" required placeholder="+91 00000 00000" onChange={handleChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-white font-medium transition-all placeholder:text-slate-600"/>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Parent Contact</label>
                <input type="tel" name="parent_phone" required placeholder="+91 00000 00000" onChange={handleChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-white font-medium transition-all placeholder:text-slate-600"/>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full mt-6 py-5 px-6 rounded-2xl text-sm font-black uppercase tracking-widest text-white bg-primary-600 hover:bg-primary-500 focus:outline-none transition-all hover:scale-[1.01] active:scale-95 shadow-lg shadow-primary-200 disabled:opacity-50">
              {loading ? <div className="bus-wheel w-6 h-6 border-2 border-white border-t-transparent animate-spin rounded-full mx-auto"></div> : 'Register Account'}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
              Already a member?{' '}
              <Link href="/login" className="text-primary-400 hover:text-primary-300 transition-colors uppercase">
                Login
              </Link>
            </p>
          </div>
        </div>
        
        <p className="mt-8 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
          Powered by Smart Mobility Systems
        </p>
      </div>
    </div>
  );
}
