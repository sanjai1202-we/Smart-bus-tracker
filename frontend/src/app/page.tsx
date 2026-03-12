import Link from "next/link";
import { Bus, ShieldAlert, Clock, MapPin } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-textMain relative overflow-hidden font-sans">
      {/* Absolute Decorative Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary-600/10 blur-[150px] rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-500/5 blur-[120px] rounded-full animate-pulse-slow font-bold" style={{ animationDelay: '4s' }}></div>

      {/* Hero Section */}
      <div className="relative isolate w-full px-6 pt-24 lg:px-8 z-10">
        <div className="mx-auto max-w-4xl py-32 sm:py-48 text-center flex flex-col items-center">
          <div className="animate-in mb-8">
            <div className="inline-flex items-center space-x-3 rounded-2xl px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-primary-400 ring-1 ring-primary-500/30 bg-primary-500/5 backdrop-blur-md shadow-[0_0_20px_rgba(20,184,166,0.1)]">
              <span>Enterprise Fleet Monitoring</span>
            </div>
          </div>
          
          <h1 className="text-5xl font-black tracking-tighter text-white sm:text-8xl mb-8 leading-[0.9] animate-in" style={{ animationDelay: '0.1s' }}>
            The Future of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary-400 via-primary-500 to-teal-200">Campus Transit</span>
          </h1>
          
          <p className="mt-4 text-xl leading-relaxed text-textMuted max-w-2xl font-medium animate-in" style={{ animationDelay: '0.2s' }}>
            Empower your university with sub-second GPS tracking, AI-optimized route predictions, and proactive safety architecture. One unified platform, limitless scale.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 animate-in" style={{ animationDelay: '0.3s' }}>
            <Link href="/login" className="px-10 py-5 rounded-2xl bg-primary-500 text-slate-950 text-sm font-black uppercase tracking-widest hover:bg-primary-400 transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(20,184,166,0.3)] ring-1 ring-white/20">
              Launch Dashboard
            </Link>
            <Link href="#features" className="group text-sm font-bold uppercase tracking-widest leading-6 text-white flex items-center hover:text-primary-400 transition-colors">
              Explore Intelligence <span aria-hidden="true" className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div id="features" className="py-24 sm:py-40 w-full relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.4em] text-primary-500 mb-6">Core Infrastructure</h2>
              <p className="text-4xl font-bold tracking-tight text-white mb-8 leading-tight">
                Engineered for <br/> Absolute Reliability.
              </p>
              
              <div className="space-y-12">
                <div className="flex gap-6">
                  <div className="flex-none w-14 h-14 bg-primary-500/10 rounded-2xl flex items-center justify-center ring-1 ring-primary-500/20 shadow-[0_0_20px_rgba(20,184,166,0.1)]">
                    <MapPin className="h-7 w-7 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Real-time Hyper-tracking</h3>
                    <p className="text-textMuted leading-relaxed">Utilizing ultra-fast Redis caching and WebSocket streams for millisecond-level location fidelity.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-none w-14 h-14 bg-primary-500/10 rounded-2xl flex items-center justify-center ring-1 ring-primary-500/20 shadow-[0_0_20px_rgba(20,184,166,0.1)]">
                    <Clock className="h-7 w-7 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Predictive AI Engine</h3>
                    <p className="text-textMuted leading-relaxed">Proprietary algorithms analyze traffic density and historical trip data to provide accurate arrival windows.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-teal-500 rounded-[40px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
               <div className="relative p-8 glass-card rounded-[40px] border-white/5 bg-slate-900/40">
                  <div className="flex items-center space-x-4 mb-8">
                     <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  </div>
                  <div className="space-y-6">
                     <div className="h-4 bg-white/5 rounded-full w-3/4"></div>
                     <div className="h-4 bg-white/5 rounded-full w-1/2"></div>
                     <div className="h-32 bg-primary-500/5 rounded-[24px] border border-primary-500/10 flex items-center justify-center">
                        <Bus className="w-12 h-12 text-primary-500/50 animate-pulse" />
                     </div>
                     <div className="h-4 bg-white/5 rounded-full w-5/6"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="w-full py-12 border-t border-white/5 relative z-10 mt-auto">
         <div className="mx-auto max-w-7xl px-6 flex justify-between items-center">
            <div className="flex items-center space-x-3 opacity-50">
               <Bus className="w-5 h-5" />
               <span className="text-xs font-black uppercase tracking-[0.2em]">BusTracker AI</span>
            </div>
            <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest">© 2026 Next-Gen Transit. All rights reserved.</p>
         </div>
      </footer>
    </main>
  );
}
