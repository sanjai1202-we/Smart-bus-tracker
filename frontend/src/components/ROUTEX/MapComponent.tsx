import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;

const createBusIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-bus-icon',
    html: `
      <div class="relative w-8 h-8 flex items-center justify-center">
        <div class="absolute inset-0 bg-[${color}] rounded-full animate-pulse opacity-75 blur-[2px] shadow-[0_0_15px_${color}]"></div>
        <div class="relative w-6 h-6 bg-[#08080F] border-[3px] border-[${color}] rounded-full flex items-center justify-center"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const StopIcon = L.divIcon({
  className: 'custom-stop-icon',
  html: `<div class="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] border-2 border-black"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const ROUTE_PATH: [number, number][] = [
  [12.8231, 80.0453],
  [12.8245, 80.0460],
  [12.8260, 80.0475],
  [12.8285, 80.0490],
  [12.8300, 80.0505],
];

export default function MapComponent({ isGlobal = false, driverCoords = null }: { isGlobal?: boolean, driverCoords?: {lat: number, lng: number} | null }) {
  const [buses, setBuses] = useState<any[]>([]);
  const busIconGreen = React.useMemo(() => createBusIcon('#00E87A'), []);
  const busIconCyan = React.useMemo(() => createBusIcon('#00FFD1'), []);

  useEffect(() => {
    if (isGlobal) {
      setBuses(JSON.parse(localStorage.getItem('routex_buses') || '[]'));
    }
  }, [isGlobal]);

  // Use real coords if provided, otherwise default to a start point or mock
  const activePosition: [number, number] = driverCoords 
    ? [driverCoords.lat, driverCoords.lng] 
    : (ROUTE_PATH[0]);

  return (
    <div className="absolute inset-0 z-0 bg-[#08080F]">
       <MapContainer 
         center={activePosition} 
         zoom={15} 
         style={{ height: '100%', width: '100%', background: '#08080F' }} 
         zoomControl={false} 
         attributionControl={false}
       >
         {/* Using activePosition as center only if we are in driver/student live mode */}
         <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png" />
         
         <Polyline positions={ROUTE_PATH} color="#5B4EFF" weight={6} opacity={0.6} className="shadow-[0_0_15px_#5B4EFF]" />

         {!isGlobal && ROUTE_PATH.map((pos, idx) => (
           <Marker key={idx} position={pos} icon={StopIcon} />
         ))}

         {isGlobal ? (
           <>
             {buses.length > 0 ? buses.map((bus: any, i: number) => {
               // In global admin view, we'd ideally fetch all live coords from socket/api
               // For now, we show the created list at fixed stops for management
               const posIndex = i % ROUTE_PATH.length;
               return (
                 <Marker key={i} position={ROUTE_PATH[posIndex]} icon={busIconCyan}>
                   <Tooltip direction="top" offset={[0, -10]} opacity={1} className="custom-tooltip">{bus.tag}</Tooltip>
                 </Marker>
               );
             }) : null}
           </>
         ) : (
           <Marker position={activePosition} icon={busIconGreen}>
              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent className="custom-tooltip">BUS LIVE</Tooltip>
           </Marker>
         )}
       </MapContainer>
    </div>
  );
}
