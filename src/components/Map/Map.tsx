// pages/MapComponent.js
'use client'
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useEffect, useState } from 'react';
import LocationMarker from '../LocationMarker/LocationMarker';
import useLocalStorage from '../../hooks/useLocalStorage';
import { realtimeDb } from "../../lib/firebase";
import { ref, set, onValue, update } from "firebase/database";
import { useRouter } from 'next/navigation';
import ConfirmationDrawer from '@components/ConfirmationDrawer/ConfirmationDrawer';
import { toast } from 'react-toastify';

const MapComponent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [position, setPosition] = useState<LatLngTuple | null>(null);
  const [vendorMarkers, setVendorMarkers] = useState<{
    id: string;
    position: LatLngTuple;
    popupText: string;
  }[]>([]);
  const [userMarkers, setUserMarkers] = useState<{
    id: string;
    position: LatLngTuple;
    popupText: string;
  }[]>([]);
  const [user] = useLocalStorage('user', { name: '', role: '', docId: '' });

  const updateUserLocation = (latitude: number, longitude: number) => {
    const userRef = ref(realtimeDb, `users/${user.docId}`);
    set(userRef, {
      name: user.name,
      role: user.role,
      location: { latitude, longitude },
      status: "active",
    });
  };

  useEffect(() => {
    const usersRef = ref(realtimeDb, 'users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const newUserMarkers = [];
      const newVendorMarkers = [];


      for (const id in data) {
        const userData = data[id];
        if (userData.location && userData.status === "active") {
          const marker = {
            id,
            position: [userData.location.latitude, userData.location.longitude] as LatLngTuple,
            popupText: userData.name,
          };

          if (user.role === 'customer' && userData.role === 'vendor') {
            newVendorMarkers.push(marker);
          } else if (user.role === 'vendor' && userData.role === 'customer') {
            newUserMarkers.push(marker);
          }

          if (id === user.docId) {
            user.role === 'customer' ? newUserMarkers.push(marker) : newVendorMarkers.push(marker);
          }
        }
      }

      setUserMarkers(newUserMarkers);
      setVendorMarkers(newVendorMarkers);
      setLoading(false);
    });
  }, [user.docId, user.role]);

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          updateUserLocation(latitude, longitude);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching location:", error);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setLoading(false);
    }
  }, []);

  const handleCloseClick = () => {
    setIsDrawerOpen(true);
  };

  const handleConfirm = async () => {
    try {
      const userRef = ref(realtimeDb, `users/${user.docId}`);
      await update(userRef, { status: "inactive" });
      let message = "Kamu telah keluar dari pantauan Tukang Bakso";
      if (user.role === 'vendor') {
        message = "Kamu telah menonaktifkan status Tukang Bakso";
      }
      toast.info(message);
      router.push('/verification');
    } catch (error) {
      console.error("Error updating user status: ", error);
    }
    setIsDrawerOpen(false);
  };

  return (
    <div className='relative'>
      <button
        onClick={handleCloseClick}
        className="absolute top-4 right-4 z-20 p-2 bg-white rounded-full shadow-xl hover:bg-gray-200 transition duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="h-screen w-full md:h-screen md:w-screen">
        <MapContainer
          key={loading ? 'loading' : 'loaded'}
          center={position || [51.505, -0.09]}
          zoom={20}
          className="h-full w-full transition-opacity duration-300 z-10"
          style={{ opacity: loading ? 0.5 : 1 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {vendorMarkers.map((marker) => (
            <LocationMarker key={marker.id} position={marker.position} popupText={marker.popupText} />
          ))}
          {userMarkers.map((marker) => (
            <LocationMarker key={marker.id} position={marker.position} popupText={marker.popupText} iconUrl="/images/user.png" />
          ))}
        </MapContainer>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          </div>
        )}

        <ConfirmationDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onConfirm={handleConfirm}
          message={`Dengan menutup halaman ini, kamu akan keluar dari pantauan ${user.role === 'customer' ? 'Tukang Bakso' : 'Customer'}`}
        />
      </div>
    </div>
  );
};

export default MapComponent;
