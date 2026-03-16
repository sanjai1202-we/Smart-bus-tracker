"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to home page because our new ROUTEX portal is unified at the root
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#07071A] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );
}
