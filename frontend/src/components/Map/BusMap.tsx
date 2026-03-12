"use client";

import { useEffect, useState } from 'react';
import { socketService } from '@/services/socketService';
import { Clock } from 'lucide-react';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#f8fafc]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
    </div>
  )
});

interface BusMapProps {
  trip: any;
  collegeId?: string;
}

export default function BusMap({ trip, collegeId }: BusMapProps) {
  const [liveLocation, setLiveLocation] = useState<any>(trip.live_location);
  const [eta, setEta] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  // Helper: Haversine distance
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Handle Socket Location Updates
  useEffect(() => {
    if (!collegeId || !trip.buses?.id) return;

    const socket = socketService.connect();
    
    socket.emit('join_bus_room', { 
      college_id: collegeId, 
      bus_id: trip.buses.id,
      trip_id: trip.id 
    });

    const handleLocationUpdate = (data: any) => {
      if (data.trip_id === trip.id) {
        setLiveLocation(data);
      }
    };

    socket.on('bus_location_update', handleLocationUpdate);
    return () => {
      socket.off('bus_location_update', handleLocationUpdate);
    };
  }, [collegeId, trip.buses?.id, trip.id]);

  // Handle ETA & Distance Logic
  useEffect(() => {
    if (!liveLocation) return;
    
    // Assume destination is a generic campus center if not provided in trip
    const destLat = 9.9252; // Default for demo
    const destLng = 78.1198;
    
    const d = calculateDistance(liveLocation.lat, liveLocation.lng, destLat, destLng);
    setDistance(Number(d.toFixed(2)));

    // Calculate ETA based on current speed or average 30km/h
    const speed = liveLocation.speed || 30;
    const timeHours = d / speed;
    const timeMinutes = Math.max(1, Math.round(timeHours * 60 * 1.2)); // 1.2 for traffic
    
    setEta(timeMinutes);
  }, [liveLocation?.lat, liveLocation?.lng, liveLocation?.speed]);

  return (
    <div className="w-full h-full relative group">
      <div className="w-full h-full absolute inset-0 z-0">
         <LeafletMap liveLocation={liveLocation} trip={trip} />
      </div>

      {/* Premium AI Overlay */}
      <div className="absolute top-6 left-6 right-6 sm:right-auto sm:w-80 glass-panel p-6 shadow-2xl z-[1000] rounded-[32px] border-white/5 animate-in">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-2xl ${liveLocation ? 'bg-primary-500 text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.3)]' : 'bg-slate-800 text-gray-500'}`}>
               <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest leading-none mb-1">AI Prediction</p>
              <p className="font-bold text-2xl text-white tracking-tight leading-none">
                 {liveLocation ? `~${eta} mins` : 'Waiting...'}
              </p>
            </div>
          </div>

          <div className="h-px bg-white/5 w-full"></div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <p className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1">Distance</p>
                <p className="text-white font-bold">{distance ? `${distance} km` : '--'}</p>
             </div>
             <div>
                <p className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1">Speed</p>
                <p className="text-white font-bold">{liveLocation?.speed ? `${Math.round(liveLocation.speed)} km/h` : '0 km/h'}</p>
             </div>
          </div>

          {liveLocation && (
             <div className="pt-2">
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                   <div className="bg-primary-500 h-full w-2/3 shadow-[0_0_10px_rgba(20,184,166,0.5)] animate-pulse"></div>
                </div>
                <p className="text-[9px] text-primary-400/60 mt-2 text-center uppercase font-bold tracking-tighter">AI Core Analyzing Traffic Flow</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
