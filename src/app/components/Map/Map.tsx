'use client'
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useEffect, useState } from 'react';
import LocationMarker from '@components/LocationMarker/LocationMarker';


const MapComponent = () => {
  const [position, setPosition] = useState<LatLngTuple | null>([51.505, -0.09]);
  const [markers, setMarkers] = useState<{
    id: number;
    position: LatLngTuple;
    popupText: string;
  }[]>([]);

  const [userMarkers, setUserMarkers] = useState<{
    id: number;
    position: LatLngTuple;
    popupText: string;
  }[]>([]);


  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    }
  }, []);


  useEffect(() => {
    const vendorMarkers = [
      { id: 1, position: [-6.2285, 106.8170] as LatLngTuple, popupText: "Marker 1" },
      { id: 2, position: [-6.2310, 106.8195] as LatLngTuple, popupText: "Marker 2" },
      { id: 3, position: [-6.2298, 106.8200] as LatLngTuple, popupText: "Marker 3" },
      { id: 4, position: [-6.2322, 106.8189] as LatLngTuple, popupText: "Marker 4" },
    ];

    const usersMarkers = [
      { id: 5, position: [-6.2283, 106.8167] as LatLngTuple, popupText: "Marker 5" },
      { id: 6, position: [-6.2308, 106.8201] as LatLngTuple, popupText: "Marker 6" },
      { id: 7, position: [-6.2295, 106.8192] as LatLngTuple, popupText: "Marker 7" },
      { id: 8, position: [-6.2315, 106.8175] as LatLngTuple, popupText: "Marker 8" },
      { id: 9, position: [-6.2301, 106.8182] as LatLngTuple, popupText: "Marker 9" },
    ];


    if (position) {
      vendorMarkers.push({ id: 5, position: position, popupText: "You are here!" });
      setMarkers(vendorMarkers);
      setUserMarkers(usersMarkers);
    }

    const interval = setInterval(() => {
      setMarkers((prevMarkers) =>
        prevMarkers.map(marker => ({
          ...marker,
          position: generateNearbyPosition(marker.position)
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [position])

  const generateNearbyPosition = ([lat, lng]: LatLngTuple): LatLngTuple => {
    const latOffset = (Math.random() - 0.5) * 0.001;
    const lngOffset = (Math.random() - 0.5) * 0.001;
    return [lat + latOffset, lng + lngOffset];
  };


  return (
    <MapContainer center={position || [51.505, -0.09]} zoom={13}
      className="h-screen w-full md:h-screen md:w-screen"

    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers.map((marker) => (
        <LocationMarker key={marker.id} position={marker.position} popupText={marker.popupText} />
      ))}
      {userMarkers.map((marker) => (
        <LocationMarker key={marker.id} position={marker.position} popupText={marker.popupText} iconUrl="/images/user.png" />
      ))}
    </MapContainer>
  );
};

export default MapComponent;
