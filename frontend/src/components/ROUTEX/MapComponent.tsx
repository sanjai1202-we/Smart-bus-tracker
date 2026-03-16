import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { io } from 'socket.io-client';
import { useTheme } from 'next-themes';

delete (L.Icon.Default.prototype as any)._getIconUrl;

const createBusIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-bus-icon',
    html: `
      <div class="relative w-8 h-8 flex items-center justify-center">
        <div class="absolute inset-0 bg-[#06EFC5] rounded-full animate-pulse opacity-75 blur-[2px] shadow-[0_0_15px_#06EFC5]"></div>
        <div class="relative w-6 h-6 bg-white dark:bg-[#08080F] border-[3px] border-[#06EFC5] rounded-full flex items-center justify-center"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const DEFAULT_CENTER: [number, number] = [12.9716, 77.5946];

export default function MapComponent({ isGlobal = false, driverCoords = null }: { isGlobal?: boolean, driverCoords?: {lat: number, lng: number} | null }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [liveBuses, setLiveBuses] = useState<Record<string, any>>({});
  const socketRef = useRef<any>(null);
  
  const busIconGreen = React.useMemo(() => createBusIcon('#00E87A'), []);
  const busIconCyan = React.useMemo(() => createBusIcon('#00FFD1'), []);

  useEffect(() => {
    setMounted(true);
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    socketRef.current = io(socketUrl);
    // ... rest of socket logic (same as before)

    socketRef.current.on('connect', () => {
      console.log('[Socket] Connected to map stream');
      // For global view, we might want to join a general room or just listen to all updates
      // The backend currently broadcasts to specific rooms, so for a "Global" view, 
      // the backend would need to support a global broadcast or the client joins all rooms.
      // For this prototype, we'll assume the driver_location is broadcasted or we listen to a specific event.
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

    // Cleanup inactive buses every 30 seconds
    const interval = setInterval(() => {
      setLiveBuses(prev => {
        const now = Date.now();
        const next = { ...prev };
        let changed = false;
        Object.keys(next).forEach(id => {
          if (now - next[id].lastSeen > 60000) { // 1 minute timeout
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

  if (!mounted) return <div className="absolute inset-0 bg-background animate-pulse" />;

  const tileUrl = theme === 'dark' 
    ? "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png";

  return (
    <div className="absolute inset-0 z-0 bg-background overflow-hidden rounded-[24px]">
       <MapContainer 
         center={activePosition} 
         zoom={13} 
         style={{ height: '100%', width: '100%' }} 
         zoomControl={false} 
         attributionControl={false}
       >
         <TileLayer url={tileUrl} />
         
         {/* Show all live buses if global, or just the current driver if provided */}
         {isGlobal ? (
           Object.values(liveBuses).map((bus: any) => (
             <Marker key={bus.bus_id} position={[bus.lat, bus.lng]} icon={busIconCyan}>
               <Tooltip direction="top" offset={[0, -10]} opacity={1} className="custom-tooltip">
                 {bus.bus_id}
               </Tooltip>
             </Marker>
           ))
         ) : (
           driverCoords && (
             <Marker position={[driverCoords.lat, driverCoords.lng]} icon={busIconGreen}>
                <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent className="custom-tooltip">BUS LIVE</Tooltip>
             </Marker>
           )
         )}
       </MapContainer>
    </div>
  );
}

