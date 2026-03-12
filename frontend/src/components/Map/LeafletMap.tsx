"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Compass, Bus as BusIcon } from 'lucide-react';

// Fix for default Leaflet icon paths in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const busIcon = L.divIcon({
  html: `<div style="background-color: #14b8a6; color: white; border-radius: 12px; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(20, 184, 166, 0.4); border: 2px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(4px);"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h10"></path><circle cx="7" cy="17" r="2"></circle><circle cx="17" cy="17" r="2"></circle></svg></div>`,
  className: "custom-bus-icon",
  iconSize: [48, 48],
  iconAnchor: [24, 24],
});

const userIcon = L.divIcon({
  html: `<div style="background-color: #f8fafc; color: #14b8a6; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 16px rgba(0,0,0,0.3); border: 3px solid #14b8a6;"><div style="width: 8px; height: 8px; background-color: #14b8a6; border-radius: 50%; animate: pulse 2s infinite;"></div></div>`,
  className: "custom-user-icon",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Helper component to center map
function MapController({ center, zoom }: { center: [number, number], zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom || map.getZoom(), { animate: true });
  }, [center, zoom, map]);
  return null;
}

interface LeafletMapProps {
  liveLocation: any;
  trip: any;
}

export default function LeafletMap({ liveLocation, trip }: LeafletMapProps) {
  // Default to Madurai coordinates if no live location available
  const defaultCenter: [number, number] = liveLocation ? [liveLocation.lat, liveLocation.lng] : [9.9252, 78.1198]; 
  
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const panToBus = () => {
    if (liveLocation) {
      setMapCenter([liveLocation.lat, liveLocation.lng]);
    } else {
      alert("Bus location is currently unavailable");
    }
  };

  // Automatically center on bus when the coordinates change significantly or arrive for the first time
  useEffect(() => {
    if (liveLocation && liveLocation.lat && liveLocation.lng) {
      setMapCenter([liveLocation.lat, liveLocation.lng]);
    }
  }, [liveLocation?.lat, liveLocation?.lng]);

  const panToUser = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting user location", error);
          alert("Could not get your location. Please check permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={mapCenter}
        zoom={15}
        style={{ width: "100%", height: "100%", zIndex: 0 }}
      >
        <MapController center={mapCenter} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {liveLocation && (
          <Marker position={[liveLocation.lat, liveLocation.lng]} icon={busIcon}>
            <Popup>
              <div className="font-semibold text-lg text-gray-800">Bus {trip?.buses?.bus_number || 'Tracker'}</div>
              <div className="text-sm text-gray-600 mt-1">
                Speed: {liveLocation.speed || 0} km/h
              </div>
            </Popup>
          </Marker>
        )}

        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div className="font-semibold text-gray-800">Your Location</div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Control Buttons */}
      <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-4">
        <button
          onClick={panToBus}
          className="p-4 bg-white text-teal-600 rounded-full shadow-2xl hover:bg-teal-50 transition-colors border border-teal-100 focus:outline-none flex items-center justify-center group"
          title="Track Bus"
        >
          <BusIcon className="w-7 h-7 group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={panToUser}
          className="p-4 bg-white text-blue-600 rounded-full shadow-2xl hover:bg-blue-50 transition-colors border border-blue-100 focus:outline-none flex items-center justify-center group"
          title="My Location"
        >
          <Compass className="w-7 h-7 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}
