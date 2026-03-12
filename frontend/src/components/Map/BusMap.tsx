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

  // Handle ETA Mock
  useEffect(() => {
    if (!liveLocation) return;
    
    // Simulate API call to FastAPI AI Service for ETA
    const minutes = Math.floor(Math.random() * 5) + 2; 
    setEta(minutes);
  }, [liveLocation?.lat, liveLocation?.lng]); // update loosely

  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full absolute inset-0 z-0">
         <LeafletMap liveLocation={liveLocation} trip={trip} />
      </div>

      {/* Floating ETA Overlay */}
      <div className="absolute top-4 left-4 right-4 sm:right-auto sm:w-80 glass-card p-4 shadow-2xl z-[1000] rounded-xl bg-white/95 backdrop-blur-md border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${liveLocation ? 'bg-teal-500/20 text-teal-600' : 'bg-gray-100 text-gray-500'}`}>
               <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">AI Route Prediction</p>
              {liveLocation ? (
                 <p className="font-bold text-2xl text-gray-900">
                    {eta !== null ? `~${eta} mins left` : 'Calculating...'}
                 </p>
              ) : (
                <p className="font-bold text-lg text-gray-500">Waiting for GPS...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
