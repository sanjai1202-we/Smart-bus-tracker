"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Bus, MapPin, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const setLogin = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      setLogin(res.data.user, res.data.token);
      toast.success('Successfully logged in!');
      
      // Redirect based on role
      if (res.data.user.role === 'admin') router.push('/admin');
      else if (res.data.user.role === 'driver') router.push('/driver');
      else router.push('/student');
      
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-textMain relative overflow-hidden font-sans">
      {/* Animated Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/20 blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/10 blur-[100px] animate-pulse-slow font-bold" style={{ animationDelay: '2s' }}></div>

      <div className="m-auto w-full max-w-md p-10 relative z-10">
        <div className="glass-card p-8 sm:p-12 rounded-[40px] border-white/5 animate-in">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-4 bg-primary-500/10 rounded-3xl mb-6 text-primary-400 ring-1 ring-primary-500/20 shadow-[0_0_30px_rgba(20,184,166,0.1)]">
              <Bus className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-3">Welcome</h1>
            <p className="text-textMuted text-sm font-medium tracking-wide">Enter your credentials to access the tracking network.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-textMuted uppercase tracking-[0.2em] ml-1">Identity</label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="name@college.edu"
                  required
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all text-white placeholder-gray-600 font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
               <div className="flex justify-between ml-1">
                 <label className="block text-xs font-bold text-textMuted uppercase tracking-[0.2em]">Security</label>
                 <a href="#" className="text-xs font-bold text-primary-500 hover:text-primary-400 tracking-wider">Forgot?</a>
               </div>
              <input
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all text-white placeholder-gray-600 font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-4 px-6 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-950 bg-primary-500 hover:bg-primary-400 focus:outline-none transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(20,184,166,0.2)] disabled:opacity-50 mt-4"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sign In Now'}
            </button>
          </form>
          
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-textMuted font-medium">
              New to BusTracker?{' '}
              <Link href="/register" className="font-bold text-primary-500 hover:text-primary-400 transition-colors underline-offset-4 hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
        
        <p className="mt-8 text-center text-[10px] font-bold text-textMuted/40 uppercase tracking-[0.3em] font-sans">
          Secured by Enterprise Transit AI
        </p>
      </div>
    </div>
  );
}
