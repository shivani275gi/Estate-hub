import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15); // Zoom level 15 for close street view
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [center, map]);
  return null;
}

function PropertyMap({ lat, lng, title }) {
  // Use passed coordinates directly
  const latitude = parseFloat(lat) || 22.7533; // Vijay Nagar default
  const longitude = parseFloat(lng) || 75.8937;
  const position = [latitude, longitude];

  return (
    <div style={{ width: '100%', height: '300px', position: 'relative' }}>
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', borderRadius: '1rem', zIndex: 1 }}
      >
        <ChangeView center={position} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            <div className="font-bold text-xs">{title || 'Property Location'}</div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default PropertyMap;