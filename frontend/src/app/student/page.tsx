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
      <nav className="h-16 flex items-center justify-between px-6 border-b border-gray-800 glass-panel">
        <div className="flex items-center space-x-3">
           <div className="bg-primary-600/20 p-2 rounded-lg text-primary-500 ring-1 ring-primary-500/50">
             <BusFront className="w-5 h-5" />
           </div>
           <span className="font-bold text-lg text-white">Student Dashboard</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium hidden sm:block">Hello, <span className="text-primary-400">{user?.name}</span></span>
          <button 
            onClick={handleLogout}
            className="flex items-center text-sm font-medium text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors border border-red-500/20"
          >
            <LogOut className="w-4 h-4 mr-1.5" /> Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-80 border-r border-gray-800 bg-surface/50 p-4 overflow-y-auto">
          <h2 className="text-sm uppercase tracking-wider text-textMuted font-semibold mb-4 ml-1 flex items-center">
            <Navigation className="w-4 h-4 mr-2" /> Active Buses ({activeTrips.length})
          </h2>
          
          <div className="space-y-3">
            {activeTrips.map(trip => (
              <div 
                key={trip.id} 
                onClick={() => setSelectedTrip(trip)}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                  selectedTrip?.id === trip.id 
                    ? 'border-primary-500 bg-primary-600/10 shadow-[0_0_15px_rgba(20,184,166,0.15)] ring-1 ring-primary-500/50' 
                    : 'border-white/10 glass-card hover:bg-white/5'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white text-lg">Bus {trip.buses.bus_number}</h3>
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                  </span>
                </div>
                
                <p className="text-sm text-textMuted flex items-center mt-1">
                  <MapIcon className="w-3.5 h-3.5 mr-1.5" /> Route: <span className="text-white ml-1">{trip.routes?.name || 'Unknown'}</span>
                </p>
                <p className="text-sm text-textMuted flex items-center mt-1">
                  <span className="font-medium mr-1.5 text-gray-500">Driver:</span> {trip.drivers?.users?.name || 'Unknown'}
                </p>
              </div>
            ))}

            {activeTrips.length === 0 && (
              <div className="text-center p-6 border border-dashed border-gray-700 rounded-xl mt-4 bg-black/20">
                <AlertTriangle className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                <p className="text-textMuted text-sm">No campus buses are currently active. Please check back later.</p>
              </div>
            )}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative bg-black">
           {selectedTrip ? (
             <BusMap trip={selectedTrip} collegeId={user?.college_id} />
           ) : (
             <div className="flex items-center justify-center h-full flex-col text-textMuted p-6">
                <MapIcon className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium text-gray-400">Select a bus route to view its live location</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
