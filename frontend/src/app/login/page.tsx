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
    <div className="flex min-h-screen bg-background text-textMain relative overflow-hidden font-sans">
      {/* Soft Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-100 blur-[100px] animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary-50 blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="m-auto w-full max-w-md p-10 relative z-10">
        <div className="glass-card p-8 sm:p-12 border-slate-100 bg-white/80 shadow-2xl animate-in">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-4 bg-primary-50 rounded-3xl mb-6 text-primary-600 ring-1 ring-primary-100 shadow-sm">
              <Bus className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500 text-sm font-medium tracking-wide">Enter your credentials to access the fleet.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Identity</label>
              <input
                type="email"
                placeholder="name@college.edu"
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-900 placeholder-slate-400 font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
               <div className="flex justify-between ml-1">
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Pin</label>
                 <a href="#" className="text-[10px] font-black text-primary-600 hover:text-primary-500 tracking-widest uppercase">Reset</a>
               </div>
              <input
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-900 placeholder-slate-400 font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-4 px-6 rounded-2xl text-sm font-black uppercase tracking-widest text-white bg-primary-600 hover:bg-primary-500 focus:outline-none transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary-200 disabled:opacity-50 mt-4"
            >
              {loading ? <div className="bus-wheel w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div> : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
              No account?{' '}
              <Link href="/register" className="text-primary-600 hover:text-primary-500 transition-colors">
                Register
              </Link>
            </p>
          </div>
        </div>
        
        <p className="mt-8 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
          Identity Systems V2.0
        </p>
      </div>
    </div>
  );
}
