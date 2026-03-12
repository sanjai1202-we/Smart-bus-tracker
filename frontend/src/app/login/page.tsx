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
    <div className="flex min-h-screen bg-background text-textMain relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-600/10 blur-3xl shadow-[0_0_100px_rgba(20,184,166,0.3)] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-teal-500/10 blur-2xl pointer-events-none"></div>

      <div className="m-auto w-full max-w-md p-8 glass-card">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-primary-600/20 rounded-xl mb-4 text-primary-500 shadow-[0_0_15px_rgba(20,184,166,0.2)] ring-1 ring-primary-500/50">
            <Bus className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h1>
          <p className="text-textMuted mt-2 text-sm">Sign in to track your campus buses.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-2">Email</label>
            <input
              type="email"
              placeholder="you@college.edu"
              required
              className="w-full px-4 py-3 bg-surface/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-white placeholder-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
             <div className="flex justify-between mb-2">
               <label className="block text-sm font-medium text-textMuted">Password</label>
               <a href="#" className="text-sm text-primary-500 hover:text-primary-400">Forgot password?</a>
             </div>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-surface/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-white placeholder-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 focus:ring-offset-background disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_rgba(20,184,166,0.4)]"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : 'Log in entirely'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-textMuted">
          New to the platform?{' '}
          <Link href="/register" className="font-semibold text-primary-500 hover:text-primary-400 transition-colors">
            Register with College Code
          </Link>
        </p>
      </div>
    </div>
  );
}
