"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { socketService } from '@/services/socketService';
import { ShieldAlert, Play, Square, Loader2, Navigation, LogOut, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DriverDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [activeTrip, setActiveTrip] = useState<any>(null);
  const [gpsActive, setGpsActive] = useState(false);
  const [pairingCode, setPairingCode] = useState('');
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'driver') {
      router.push('/login');
      return;
    }

    const fetchTrip = async () => {
      try {
        const res = await api.get('/trips/active');
        const myTrip = res.data.find((t: any) => t.drivers.users.name === user.name);
        if (myTrip) {
          setActiveTrip(myTrip);
          startGPSBroadcast(myTrip);
        }
      } catch (err) {
        toast.error('Failed to load trip status');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();

    return () => {
      stopGPSBroadcast();
    };
  }, [user]);

  const startGPSBroadcast = (trip: any) => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    const socket = socketService.connect();
    
    // Watch Position and Broadcast
    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const payload = {
          college_id: trip.buses.college_id,
          bus_id: trip.buses.id,
          trip_id: trip.id,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          speed: position.coords.speed || 0, // In meters/second
          heading: position.coords.heading || 0
        };

        socket.emit('driver_location', payload);
        
        // Optional AI Overspeed Check could happen here manually via API,
        // but it's handled on the backend/ai-service as well.
      },
      (error) => {
        toast.error('GPS tracking lost. Please check permissions.');
        console.error('GPS Error', error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    setGpsActive(true);
    toast.success('Live GPS Broadcasting Started', { icon: '📡' });
  };

  const stopGPSBroadcast = () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setGpsActive(false);
  };

  const handleStartTrip = async () => {
    setLoading(true);
    try {
      // Create trip and get driver ID from backend automatically based on token + pairing code
      const res = await api.post('/trips/start', { route_id: null, pairingCode });
      
      // Need full trip info including bus to broadcast properly, so we refetch active trips
      const fetched = await api.get('/trips/active');
      const newTrip = fetched.data.find((t: any) => t.id === res.data.trip.id);
      
      setActiveTrip(newTrip);
      startGPSBroadcast(newTrip);
      toast.success('Successfully paired with Bus!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid Pairing Code');
    } finally {
      setLoading(false);
    }
  };

  const handleStopTrip = async () => {
    setLoading(true);
    try {
      await api.post('/trips/stop', { trip_id: activeTrip.id });
      stopGPSBroadcast();
      setActiveTrip(null);
      toast.success('Trip completed successfully');
    } catch (err: any) {
      toast.error('Failed to stop trip');
    } finally {
      setLoading(false);
    }
  };

  const emergencyAlert = () => {
    toast.error('Emergency alert sent to admin!', { duration: 5000 });
    // In full implementation, api.post('/alerts/emergency', { trip_id: activeTrip.id })
  };

  if (loading && !activeTrip) return <div className="flex h-screen items-center justify-center bg-background"><Loader2 className="w-10 h-10 text-primary-500 animate-spin" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <nav className="h-16 flex items-center justify-between px-6 border-b border-gray-800 glass-panel sticky top-0 z-50">
        <div className="flex items-center space-x-3">
           <div className="bg-primary-600/20 p-2 rounded-lg text-primary-500 ring-1 ring-primary-500/50">
             <Navigation className="w-5 h-5" />
           </div>
           <span className="font-bold text-lg text-white">Driver Console</span>
        </div>
        <button onClick={() => { logout(); router.push('/login'); }} className="text-sm font-medium text-red-500 flex items-center bg-red-500/10 px-3 py-1.5 rounded border border-red-500/20">
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </button>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary-600/5 blur-3xl shadow-[0_0_150px_rgba(20,184,166,0.1)] pointer-events-none"></div>

        <div className="w-full max-w-md space-y-6">
          <div className="glass-card p-6 text-center">
             <h2 className="text-xl font-bold text-white mb-2">Welcome, {user?.name}</h2>
             <p className="text-textMuted mb-6">Manage your shift and GPS broadcast.</p>

             {/* Status Indicator */}
             <div className="flex items-center justify-center space-x-4 mb-8">
               <div className="flex flex-col items-center">
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${activeTrip ? 'bg-primary-500/20 text-primary-500 ring-2 ring-primary-500' : 'bg-gray-800 text-gray-500'}`}>
                   {activeTrip ? <CheckCircle className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                 </div>
                 <span className="text-sm font-medium text-textMuted">{activeTrip ? 'Trip Active' : 'Idle'}</span>
               </div>
               <div className="w-12 h-[2px] bg-gray-700"></div>
               <div className="flex flex-col items-center">
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${gpsActive ? 'bg-primary-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.5)]' : 'bg-gray-800 text-gray-500'}`}>
                   <Navigation className="w-6 h-6" />
                 </div>
                 <span className="text-sm font-medium text-textMuted">{gpsActive ? 'Broadcasting location' : 'GPS Offline'}</span>
               </div>
             </div>

             {/* Action Buttons */}
             {!activeTrip ? (
               <div className="space-y-4">
                 <div>
                   <input 
                      type="text" 
                      placeholder="Enter 6-Digit Bus Pairing Code"
                      value={pairingCode}
                      onChange={e => setPairingCode(e.target.value.toUpperCase())}
                      className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-center text-white outline-none focus:border-primary-500 transition-colors uppercase tracking-widest font-bold"
                   />
                 </div>
                 <button onClick={handleStartTrip} disabled={loading || !pairingCode} className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold flex items-center justify-center transition-all shadow-[0_0_20px_rgba(20,184,166,0.5)] active:scale-95 disabled:opacity-50 disabled:shadow-none">
                   <Play className="w-5 h-5 mr-2 fill-current" /> Start Route & Share GPS
                 </button>
               </div>
             ) : (
               <button onClick={handleStopTrip} disabled={loading} className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold flex items-center justify-center transition-all active:scale-95">
                 <Square className="w-5 h-5 mr-2 fill-current" /> End Trip & Stop GPS
               </button>
             )}
          </div>

          {activeTrip && (
            <div className="glass-card p-4 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors">
              <button onClick={emergencyAlert} className="w-full py-3 text-red-500 font-bold flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 mr-2" /> SEND EMERGENCY ALERT
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
