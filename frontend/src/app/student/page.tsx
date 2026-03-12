"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import BusMap from '@/components/Map/BusMap';
import { LogOut, BusFront, Map as MapIcon, Loader2, Navigation, AlertTriangle, UserCircle } from 'lucide-react';

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
    <div className="flex flex-col h-screen bg-background text-textMain font-sans">
      <nav className="h-20 flex items-center justify-between px-8 glass-panel z-20 shadow-sm border-b border-slate-100 bg-white/90">
        <div className="flex items-center space-x-4">
           <div className="bg-primary-600 p-3 rounded-2xl text-white shadow-lg shadow-primary-200">
             <BusFront className="w-6 h-6" />
           </div>
           <div>
             <span className="font-black text-xl text-slate-900 block leading-none tracking-tight">BusTracker</span>
             <span className="text-[10px] text-primary-600 font-black uppercase tracking-[0.2em] leading-none">Campus Mobility</span>
           </div>
        </div>
        
        <div className="flex items-center space-x-8">
          <div className="hidden sm:flex flex-col items-end">
             <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Authenticated</span>
             <span className="text-sm font-bold text-slate-900 tracking-tight">{user?.name}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center text-[10px] font-black uppercase tracking-[0.15em] text-red-500 hover:text-red-600 bg-red-50 px-5 py-2.5 rounded-xl transition-all border border-red-100 active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" /> Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-[400px] border-r border-slate-100 bg-white/50 p-8 overflow-y-auto z-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black flex items-center">
              <Navigation className="w-4 h-4 mr-3 text-primary-600" /> Active Fleet
            </h2>
            <div className="flex items-center space-x-2 bg-primary-50 px-3 py-1 rounded-full ring-1 ring-primary-100">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-pulse"></div>
              <span className="text-primary-600 text-[10px] font-black tracking-widest uppercase">
                {activeTrips.length} Active
              </span>
            </div>
          </div>
          
          <div className="space-y-6">
            {activeTrips.map((trip, idx) => (
              <div 
                key={trip.id} 
                onClick={() => setSelectedTrip(trip)}
                style={{ animationDelay: `${idx * 0.1}s` }}
                className={`group p-6 rounded-[32px] border cursor-pointer transition-all duration-500 animate-in ${
                  selectedTrip?.id === trip.id 
                    ? 'border-primary-200 bg-white shadow-xl shadow-primary-100/50 scale-[1.02]' 
                    : 'border-slate-50 bg-white hover:border-primary-100 hover:shadow-lg hover:shadow-slate-100'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-black text-slate-900 text-2xl tracking-tighter leading-none mb-2">Bus {trip.buses.bus_number}</h3>
                    <div className="flex items-center space-x-2">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{trip.buses.plate_number}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-2xl transition-all duration-300 ${selectedTrip?.id === trip.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-slate-50 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600'}`}>
                    <MapIcon className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="grid gap-4 mt-6">
                  <div className="flex items-center text-xs">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center mr-3 border border-slate-100">
                       <Navigation className="w-3.5 h-3.5 text-primary-600" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Current Route</p>
                       <span className="text-slate-700 font-bold">{trip.routes?.name || 'Academic Circle Line'}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center mr-3 border border-slate-100">
                       <UserCircle className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Fleet Pilot</p>
                       <span className="text-slate-700 font-bold">{trip.drivers?.users?.name || 'Awaiting Signal'}</span>
                    </div>
                  </div>
                </div>

                <div className={`mt-8 flex items-center justify-between transition-all duration-500 ${selectedTrip?.id === trip.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                   <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em]">Monitoring Active</span>
                   <div className="flex space-x-1">
                      <div className="w-1 h-1 rounded-full bg-primary-600 animate-bounce" style={{animationDelay: '0s'}}></div>
                      <div className="w-1 h-1 rounded-full bg-primary-600 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1 h-1 rounded-full bg-primary-600 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                   </div>
                </div>
              </div>
            ))}

            {activeTrips.length === 0 && (
              <div className="text-center py-16 px-8 bg-white border border-dashed border-slate-200 rounded-[40px] mt-4 shadow-sm">
                <div className="bg-slate-50 w-20 h-20 rounded-[30px] flex items-center justify-center mx-auto mb-6 border border-slate-100">
                  <AlertTriangle className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-slate-900 font-black text-xl mb-2 tracking-tight">Fleet Offline</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">There are no operational routes detected at this time. Please contact transport admin.</p>
              </div>
            )}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative bg-slate-50">
           <div className="absolute inset-0 z-0">
             {selectedTrip ? (
               <BusMap trip={selectedTrip} collegeId={user?.college_id} />
             ) : (
               <div className="flex items-center justify-center h-full flex-col p-8 relative overflow-hidden bg-background">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-100/20 blur-[150px] rounded-full animate-pulse"></div>
                  <div className="bg-white/80 backdrop-blur-md p-16 rounded-[60px] flex flex-col items-center text-center max-w-md relative z-10 border border-white shadow-2xl">
                    <div className="w-24 h-24 bg-primary-50 rounded-[40px] flex items-center justify-center mb-8 ring-1 ring-primary-100 shadow-inner">
                      <MapIcon className="w-10 h-10 text-primary-600" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Fleet Selection</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">Please select a vehicle from the route navigator to engage live satellite tracking and AI arrival telemetry.</p>
                  </div>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
