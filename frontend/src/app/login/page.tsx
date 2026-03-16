"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Bus, GraduationCap, Shield, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
  const [role, setRole] = useState<'student' | 'driver' | 'admin'>('student');
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
      
      if (res.data.user.role !== role) {
        toast.error(`Authorized only for ${role.toUpperCase()} portal`);
        setLoading(false);
        return;
      }

      setLogin(res.data.user, res.data.token);
      toast.success(`Access Granted: ${res.data.user.name}`);
      router.push(`/${role}`);
      
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'student', title: 'STUDENT', icon: GraduationCap, color: 'text-routex-cyan', bg: 'bg-routex-cyan/10' },
    { id: 'driver', title: 'DRIVER', icon: Bus, color: 'text-routex-primary', bg: 'bg-routex-primary/10' },
    { id: 'admin', title: 'ADMIN', icon: Shield, color: 'text-routex-danger', bg: 'bg-routex-danger/10' }
  ];

  return (
    <div className="flex min-h-screen bg-routex-bg text-white relative overflow-hidden font-body">
      {/* Cinematic Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-routex-primary/5 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-routex-cyan/5 blur-[120px]"></div>

      <div className="m-auto w-full max-w-md p-6 relative z-10">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 overflow-hidden shadow-2xl">
          <div className="text-center mb-10">
             <div className="inline-flex p-4 bg-white/5 rounded-3xl mb-4 border border-white/5">
                <Bus className="w-10 h-10 text-routex-primary" />
             </div>
             <h1 className="text-5xl font-display tracking-widest text-white mb-2 uppercase">Welcome Back</h1>
             <p className="text-[10px] text-routex-textMuted uppercase font-black tracking-[0.3em]">Authorized Access Only</p>
          </div>

          {/* Three Role Selection Buttons */}
          <div className="flex gap-2 mb-10 bg-black/20 p-1.5 rounded-2xl border border-white/5">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => { setRole(r.id as any); setEmail(''); setPassword(''); }}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${role === r.id ? 'bg-white/10 text-white shadow-xl' : 'text-routex-textMuted hover:text-white'}`}
              >
                <r.icon className={`w-5 h-5 ${role === r.id ? r.color : 'opacity-40'}`} />
                <span className="text-[9px] font-black uppercase tracking-widest">{r.title}</span>
                {role === r.id && (
                  <motion.div 
                    layoutId="activeRole" 
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${r.id === 'student' ? 'bg-routex-cyan' : r.id === 'driver' ? 'bg-routex-primary' : 'bg-routex-danger'}`} 
                  />
                )}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-routex-textMuted font-black uppercase tracking-widest ml-1">Identity Tag</label>
              <input
                type="text"
                placeholder={role === 'student' ? "name@college.edu" : role === 'driver' ? "DRIVER-001" : "ADMIN-01"}
                required
                className="w-full bg-white/5 border border-white/10 px-6 py-5 rounded-2xl outline-none focus:border-white/20 transition-all font-body text-white placeholder-white/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
               <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] text-routex-textMuted font-black uppercase tracking-widest">Security Pin</label>
                  <button type="button" className="text-[9px] text-routex-primary font-black uppercase tracking-widest">Reset</button>
               </div>
              <input
                type="password"
                placeholder="••••••••"
                required
                className="w-full bg-white/5 border border-white/10 px-6 py-5 rounded-2xl outline-none focus:border-white/20 transition-all font-body text-white placeholder-white/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 text-white bg-routex-primary shadow-[0_0_30px_rgba(91,78,255,0.2)] disabled:opacity-50`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SIGN IN'}
            </button>
          </form>

          <footer className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-routex-textMuted font-black uppercase tracking-widest">
              New to the platform?{' '}
              <Link href="/register" className="text-white hover:text-routex-primary transition-colors">
                Request Entry
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
