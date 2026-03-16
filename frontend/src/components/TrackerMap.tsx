"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion } from 'framer-motion';

// Fix for default Leaflet icons (we don't strictly need this since we use a custom divIcon, but good practice)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
  iconUrl: require('leaflet/dist/images/marker-icon.png').default,
  shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
});

// Custom Bus Icon using divIcon for arbitrary glowing CSS
const createBusIcon = () => {
  return L.divIcon({
    className: 'custom-bus-icon',
    html: `
      <div class="relative w-8 h-8 flex items-center justify-center">
        <div class="absolute inset-0 bg-routex-cyan rounded-full animate-ping opacity-75"></div>
        <div class="relative w-6 h-6 bg-routex-bg border-2 border-routex-cyan rounded-full shadow-[0_0_15px_#00FFD1] flex items-center justify-center">
          <span class="text-[10px] pb-0.5">🚌</span>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const StopIcon = L.divIcon({
  className: 'custom-stop-icon',
  html: `<div class="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] border border-black"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const ROUTE_PATH: [number, number][] = [
  [12.8231, 80.0453], // Approx Kattankulathur
  [12.8245, 80.0460],
  [12.8260, 80.0475],
  [12.8285, 80.0490],
  [12.8300, 80.0505],
];

export default function TrackerMap() {
  const [busPosition, setBusPosition] = useState<[number, number]>(ROUTE_PATH[0]);
  const [targetIndex, setTargetIndex] = useState(1);
  const busIcon = React.useMemo(() => createBusIcon(), []);

  // Simple interpolation logic for smooth moving bus (simulating real-time)
  useEffect(() => {
    let t = 0;
    let animationFrame: number;

    const animateBus = () => {
      const p1 = ROUTE_PATH[targetIndex - 1];
      const p2 = ROUTE_PATH[targetIndex];
      
      if (!p1 || !p2) {
        setTargetIndex(1); // loop back
        return;
      }

      t += 0.005; // speed
      if (t >= 1) {
        t = 0;
        setTargetIndex((prev) => (prev + 1) >= ROUTE_PATH.length ? 1 : prev + 1);
        return;
      }

      // Linear interpolation
      const lat = p1[0] + (p2[0] - p1[0]) * t;
      const lng = p1[1] + (p2[1] - p1[1]) * t;
      
      setBusPosition([lat, lng]);
      animationFrame = requestAnimationFrame(animateBus);
    };

    animationFrame = requestAnimationFrame(animateBus);
    return () => cancelAnimationFrame(animationFrame);
  }, [targetIndex]);

  return (
    <div className="absolute inset-0 z-0 bg-black">
       <MapContainer 
          center={ROUTE_PATH[2]} 
          zoom={15} 
          style={{ height: '100%', width: '100%', background: '#0A0A0F' }}
          zoomControl={false}
          attributionControl={false}
       >
         {/* Using CartoDB Dark Matter tiles for cinematic dark mode */}
         <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
         />
         
         <Polyline 
            positions={ROUTE_PATH} 
            color="#5B4EFF" 
            weight={6} 
            opacity={0.8} 
            className="animate-pulse-subtle shadow-[0_0_15px_#5B4EFF]"
         />

         {/* Stops */}
         {ROUTE_PATH.map((pos, idx) => (
           <Marker key={idx} position={pos} icon={StopIcon} />
         ))}

         {/* Live Moving Bus */}
         <Marker position={busPosition} icon={busIcon} />
       </MapContainer>
    </div>
  );
}
