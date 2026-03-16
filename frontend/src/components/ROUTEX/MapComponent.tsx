import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { io } from 'socket.io-client';
import { useTheme } from 'next-themes';
import 'leaflet/dist/leaflet.css';

const BUS_ICON_SVG = `
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="var(--primary)" fill-opacity="0.2" stroke="var(--primary)" stroke-width="2"/>
    <circle cx="20" cy="20" r="8" fill="var(--primary)" class="animate-pulse shadow-[0_0_15px_var(--primary)]"/>
    <circle cx="20" cy="20" r="15" stroke="var(--primary)" stroke-opacity="0.5" stroke-width="1">
      <animate attributeName="r" from="8" to="20" dur="1.5s" repeatCount="indefinite" />
      <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
    </circle>
  </svg>
`;

const createBusIcon = () => L.divIcon({
  html: BUS_ICON_SVG,
  className: 'custom-bus-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const DEFAULT_CENTER: [number, number] = [13.0827, 80.2707];

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 500);
  }, [map]);
  return null;
}

export default function MapComponent({ isGlobal = false, driverCoords = null }: { isGlobal?: boolean, driverCoords?: {lat: number, lng: number} | null }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [liveBuses, setLiveBuses] = useState<Record<string, any>>({});
  const socketRef = useRef<any>(null);
  
  useEffect(() => {
    setMounted(true);
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    socketRef.current = io(socketUrl);

    socketRef.current.on('connect', () => {
      console.log('[Socket] Connected to map stream');
    });

    socketRef.current.on('bus_location_update', (data: any) => {
      setLiveBuses(prev => ({
        ...prev,
        [data.bus_id]: {
          ...data,
          lastSeen: Date.now()
        }
      }));
    });

    const interval = setInterval(() => {
      setLiveBuses(prev => {
        const now = Date.now();
        const next = { ...prev };
        let changed = false;
        Object.keys(next).forEach(id => {
          if (now - next[id].lastSeen > 60000) {
            delete next[id];
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 30000);

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      clearInterval(interval);
    };
  }, []);

  const activePosition: [number, number] = driverCoords 
    ? [driverCoords.lat, driverCoords.lng] 
    : (Object.values(liveBuses)[0] ? [Object.values(liveBuses)[0].lat, Object.values(liveBuses)[0].lng] : DEFAULT_CENTER);

  if (!mounted) return <div className="absolute inset-0 bg-[var(--bg-elevated)] animate-pulse rounded-[24px]" />;

  const tileUrl = theme === 'dark' 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="absolute inset-0 z-0 bg-[var(--bg-base)] overflow-hidden rounded-[24px] border border-[var(--border-glass)] shadow-2xl transition-all duration-500">
       <MapContainer 
         center={activePosition} 
         zoom={13} 
         style={{ height: '100%', width: '100%', background: 'var(--bg-base)' }} 
         zoomControl={false} 
         attributionControl={false}
       >
         <TileLayer url={tileUrl} />
         
         {isGlobal ? (
           Object.values(liveBuses).map((bus: any) => (
             <Marker key={bus.bus_id} position={[bus.lat, bus.lng]} icon={createBusIcon()}>
               <Tooltip direction="top" offset={[0, -10]} opacity={1} className="custom-tooltip">
                 <div className="bg-[var(--bg-elevated)] text-[var(--text-primary)] px-2 py-1 rounded-lg border border-[var(--border-glass)] text-[10px] font-bold">
                   {bus.bus_id}
                 </div>
               </Tooltip>
             </Marker>
           ))
         ) : (
           driverCoords && (
             <Marker position={[driverCoords.lat, driverCoords.lng]} icon={createBusIcon()}>
                <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent className="custom-tooltip">
                  <div className="bg-[var(--primary)] text-white px-2 py-1 rounded-lg shadow-xl text-[10px] font-bold">BUS LIVE</div>
                </Tooltip>
             </Marker>
           )
         )}
         <MapResizer />
       </MapContainer>

       {/* Cinematic Vignette */}
       <div className="absolute inset-0 pointer-events-none z-[1000] shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]" />
    </div>
  );
}

