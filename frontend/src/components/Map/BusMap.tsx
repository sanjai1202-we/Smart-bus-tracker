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

      {/* Premium AI Overlay - Adapted for Light Theme */}
      <div className="absolute top-4 left-4 right-4 sm:right-auto sm:w-72 glass-card p-5 shadow-2xl z-[1000] border-slate-100 bg-white/95 animate-in">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-2xl ${liveLocation ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-slate-100 text-slate-400'}`}>
               <Clock className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest leading-none mb-1">AI Prediction</p>
              <p className="font-black text-xl text-slate-900 tracking-tight leading-none">
                 {liveLocation ? `~${eta} mins` : 'Signal Lost'}
              </p>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full"></div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Remaining</p>
                <p className="text-slate-700 font-bold text-sm tracking-tight">{distance ? `${distance} km` : '-- km'}</p>
             </div>
             <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Velocity</p>
                <p className="text-slate-700 font-bold text-sm tracking-tight">{liveLocation?.speed ? `${Math.round(liveLocation.speed)} km/h` : '0 km/h'}</p>
             </div>
          </div>

          {liveLocation && (
             <div className="pt-1">
                <div className="w-full bg-slate-50 h-1 rounded-full overflow-hidden border border-slate-100">
                   <div className="bg-primary-500 h-full w-2/3 shadow-sm animate-pulse"></div>
                </div>
                <p className="text-[8px] text-slate-400 mt-2 text-center uppercase font-black tracking-widest">Autonomous Telemetry Active</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
