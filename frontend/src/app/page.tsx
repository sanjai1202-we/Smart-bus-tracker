import Link from "next/link";
import { Bus, ShieldAlert, Clock, MapPin } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background text-textMain relative overflow-hidden font-sans">
      {/* Absolute Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-100/40 blur-[120px] rounded-full animate-float"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-50/30 blur-[100px] rounded-full animate-float" style={{ animationDelay: '3s' }}></div>

      {/* Hero Section */}
      <div className="relative isolate w-full px-6 pt-24 lg:px-8 z-10">
        <div className="mx-auto max-w-4xl py-32 sm:py-48 text-center flex flex-col items-center">
          <div className="animate-in mb-8">
            <div className="inline-flex items-center space-x-3 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 ring-1 ring-primary-200 bg-primary-50/50 backdrop-blur-md shadow-sm">
              <span>Next-Gen Fleet Intelligence</span>
            </div>
          </div>
          
          <h1 className="text-5xl font-black tracking-tight text-white sm:text-8xl mb-8 leading-[0.95] animate-in" style={{ animationDelay: '0.1s' }}>
            Campus Transit, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary-400 to-primary-600">Perfectly Synced.</span>
          </h1>
          
          <p className="mt-4 text-xl leading-relaxed text-slate-400 max-w-2xl font-medium animate-in" style={{ animationDelay: '0.2s' }}>
            Elevate your university's mobility with real-time tracking, AI-powered predictive arrival times, and a seamless smart dashboard.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 animate-in" style={{ animationDelay: '0.3s' }}>
            <Link href="/login" className="px-10 py-5 rounded-2xl bg-primary-600 text-white text-sm font-black uppercase tracking-widest hover:bg-primary-500 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary-900/50">
              Get Started
            </Link>
            <Link href="/register" className="group text-sm font-bold uppercase tracking-widest leading-6 text-white flex items-center hover:text-primary-400 transition-colors">
              Register <span aria-hidden="true" className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div id="features" className="py-24 sm:py-40 w-full relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-sm font-black uppercase tracking-[0.4em] text-primary-400">Pure Precision</h2>
                <p className="text-4xl font-bold tracking-tight text-white leading-tight">
                  Intelligent tracking <br/> for the modern campus.
                </p>
              </div>
              
              <div className="grid gap-10">
                <div className="flex gap-6 group">
                  <div className="flex-none w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center ring-1 ring-white/10 shadow-sm group-hover:shadow-md transition-all">
                    <MapPin className="h-6 w-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 tracking-tight">Real-time Location Stream</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">Ultra-low latency GPS updates using high-performance Redis pub/sub architecture.</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="flex-none w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center ring-1 ring-white/10 shadow-sm group-hover:shadow-md transition-all">
                    <Clock className="h-6 w-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 tracking-tight">AI Estimated Arrival</h3>
                    <p className="text-slate-500 leading-relaxed text-sm">Proprietary AI engine calculates ETA based on live speed and distance metrics.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group p-1 animate-float">
               <div className="absolute -inset-2 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-[44px] blur-2xl opacity-10 group-hover:opacity-20 transition duration-1000"></div>
               <div className="relative p-10 glass-card border-white/10 bg-black/40 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center space-x-3 mb-10">
                     <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                  </div>
                  <div className="space-y-8">
                     <div className="h-3.5 bg-white/5 rounded-full w-3/4"></div>
                     <div className="h-3.5 bg-white/5 rounded-full w-1/2"></div>
                     <div className="py-12 bg-primary-500/10 rounded-3xl border border-primary-500/20 flex items-center justify-center overflow-hidden">
                        <div className="bus-loading-container">
                           <div className="bus-silhouette !opacity-50">
                              <div className="bus-body">
                                 <div className="bus-window"></div>
                                 <div className="bus-wheel wheel-front"></div>
                                 <div className="bus-wheel wheel-back"></div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="h-3.5 bg-white/5 rounded-full w-5/6"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="w-full py-12 border-t border-white/5 relative z-10 mt-auto bg-black/20 backdrop-blur-sm">
         <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-3 grayscale opacity-60">
               <Bus className="w-5 h-5 text-white" />
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">BusTracker System</span>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">© 2026 Campus Mobility. Defined by Design.</p>
         </div>
      </footer>
    </main>
  );
}
