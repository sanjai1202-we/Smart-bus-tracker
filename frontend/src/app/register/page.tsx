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
    <div className="flex min-h-screen bg-background items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 -ml-20 -mt-20 w-96 h-96 rounded-full bg-primary-600/10 blur-3xl shadow-[0_0_100px_rgba(20,184,166,0.3)] pointer-events-none"></div>

      <div className="w-full max-w-lg p-8 glass-card">
        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center p-3 bg-surface rounded-xl mb-4 text-white ring-1 ring-white/10">
            <UserCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Student Registration</h1>
          <p className="text-textMuted text-sm">Join your college transport network.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Full Name</label>
              <input type="text" name="name" required onChange={handleChange} className="w-full px-4 py-2.5 bg-background border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 text-white transition-all"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">College Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-4 w-4 text-gray-500" />
                </div>
                <input type="text" name="college_code" required onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-background border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 text-white transition-all"/>
              </div>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-textMuted mb-1">Email</label>
             <input type="email" name="email" required onChange={handleChange} className="w-full px-4 py-2.5 bg-background border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 text-white transition-all"/>
          </div>

          <div>
             <label className="block text-sm font-medium text-textMuted mb-1">Password</label>
             <input type="password" name="password" required onChange={handleChange} className="w-full px-4 py-2.5 bg-background border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 text-white transition-all"/>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Your Phone</label>
              <input type="tel" name="phone" required onChange={handleChange} className="w-full px-4 py-2.5 bg-background border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 text-white transition-all"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Parent Phone</label>
              <input type="tel" name="parent_phone" required onChange={handleChange} className="w-full px-4 py-2.5 bg-background border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 text-white transition-all"/>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full mt-6 flex justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(20,184,166,0.3)]">
            {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-textMuted">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary-500 hover:text-primary-400 transition-colors">
            Log in instead
          </Link>
        </p>
      </div>
    </div>
  );
}
