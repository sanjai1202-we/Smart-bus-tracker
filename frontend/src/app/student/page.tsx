"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import BusMap from '@/components/Map/BusMap';
import { LogOut, BusFront, Map as MapIcon, Loader2, Navigation, AlertTriangle } from 'lucide-react';

export default function StudentDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeTrips, setActiveTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchTrips = async () => {
      try {
        const res = await api.get('/trips/active');
        setActiveTrips(res.data);
      } catch (err) {
        console.error('Failed to fetch trips', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
    // Poll every 30s just for new trips if WebSocket misses it
    const val = setInterval(fetchTrips, 30000);
    return () => clearInterval(val);
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-textMain">
      <nav className="h-16 flex items-center justify-between px-6 glass-panel z-20">
        <div className="flex items-center space-x-3">
           <div className="bg-primary-500/20 p-2 rounded-xl text-primary-400 ring-1 ring-primary-500/30 shadow-[0_0_15px_rgba(20,184,166,0.1)]">
             <BusFront className="w-6 h-6" />
           </div>
           <div>
             <span className="font-bold text-lg text-white block leading-none tracking-tight">BusTracker</span>
             <span className="text-[10px] text-primary-400/80 font-semibold uppercase tracking-widest leading-none">Smart Mobility</span>
           </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="hidden sm:flex flex-col items-end">
             <span className="text-xs text-textMuted font-medium uppercase tracking-wider">Welcome back</span>
             <span className="text-sm font-bold text-white tracking-tight">{user?.name}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-all border border-red-500/20 active:scale-95"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-96 border-r border-white/5 bg-slate-950/20 p-6 overflow-y-auto z-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs uppercase tracking-[0.2em] text-textMuted font-bold flex items-center">
              <Navigation className="w-4 h-4 mr-2 text-primary-500" /> Live Routes
            </h2>
            <span className="bg-primary-500/10 text-primary-400 text-[10px] font-black px-2 py-0.5 rounded-full ring-1 ring-primary-500/20">
              {activeTrips.length} ACTIVE
            </span>
          </div>
          
          <div className="space-y-4">
            {activeTrips.map((trip, idx) => (
              <div 
                key={trip.id} 
                onClick={() => setSelectedTrip(trip)}
                style={{ animationDelay: `${idx * 0.1}s` }}
                className={`group p-5 rounded-2xl border cursor-pointer transition-all duration-300 animate-in ${
                  selectedTrip?.id === trip.id 
                    ? 'border-primary-500/50 bg-primary-500/5 shadow-[0_0_20px_rgba(20,184,166,0.08)] ring-1 ring-primary-500/30' 
                    : 'border-white/5 glass-card'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-white text-xl tracking-tight leading-none mb-1">Bus {trip.buses.bus_number}</h3>
                    <span className="text-[10px] font-black text-textMuted uppercase tracking-widest">{trip.buses.plate_number}</span>
                  </div>
                  <div className={`p-2 rounded-xl transition-colors ${selectedTrip?.id === trip.id ? 'bg-primary-500 text-slate-950' : 'bg-white/5 text-primary-500'}`}>
                    <MapIcon className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <div className="flex items-center text-sm text-textMuted">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-3 shadow-[0_0_8px_rgba(20,184,166,0.5)]"></div>
                    <span className="font-medium">Route:</span>
                    <span className="text-white ml-2">{trip.routes?.name || 'Main Campus Line'}</span>
                  </div>
                  <div className="flex items-center text-sm text-textMuted">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700 mr-3"></div>
                    <span className="font-medium">Driver:</span>
                    <span className="text-white ml-2">{trip.drivers?.users?.name || 'On Duty'}</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">Click to view location</span>
                   <div className="flex h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                </div>
              </div>
            ))}

            {activeTrips.length === 0 && (
              <div className="text-center py-12 px-6 glass-card border-dashed border-white/10 rounded-3xl mt-4">
                <div className="bg-yellow-500/10 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-yellow-500/20">
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1 tracking-tight">No Active Buses</h3>
                <p className="text-textMuted text-xs leading-relaxed max-w-[200px] mx-auto">All fleet vehicles are currently offline. Check back during operational hours.</p>
              </div>
            )}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative bg-slate-950">
           <div className="absolute inset-0 z-0 bg-slate-950">
             {selectedTrip ? (
               <BusMap trip={selectedTrip} collegeId={user?.college_id} />
             ) : (
               <div className="flex items-center justify-center h-full flex-col p-6 relative overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/5 blur-[120px] rounded-full"></div>
                  <div className="glass-card p-10 rounded-[40px] flex flex-col items-center text-center max-w-sm relative z-10 border-white/5">
                    <div className="w-20 h-20 bg-primary-500/10 rounded-[30px] flex items-center justify-center mb-6 ring-1 ring-primary-500/20 shadow-[0_0_30px_rgba(20,184,166,0.1)]">
                      <MapIcon className="w-10 h-10 text-primary-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Select a Route</h2>
                    <p className="text-textMuted text-sm leading-relaxed">Choose an active bus from the sidebar to start tracking its live position and ETA.</p>
                  </div>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
