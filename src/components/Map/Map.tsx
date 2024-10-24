// pages/MapComponent.js
'use client';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useCallback, useEffect, useState } from 'react';
import LocationMarker from '../LocationMarker/LocationMarker';
import useLocalStorage from '../../hooks/useLocalStorage';
import { realtimeDb } from '../../lib/firebase';
import { ref, onValue, update } from 'firebase/database';
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
  const [user, setUser] = useLocalStorage<{
    name: string;
    role: string;
    docId: string;
  }>('user', { name: '', role: '', docId: '' });

  useEffect(() => {
    if (!user || !user.docId) {
      router.push('/verification');
    }
  }, [user, router]);

  const updateUserLocation = useCallback((latitude: number, longitude: number) => {
    if (!user || !user.docId) { return; }
    const userRef = ref(realtimeDb, `users/${user.docId}`);

    update(userRef, {
      location: { latitude, longitude },
      status: 'active',
    });
  }, [user.docId, user.name, user.role]);

  useEffect(() => {
    if (!user || !user.docId) { return; }

    const usersRef = ref(realtimeDb, 'users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const newUserMarkers = [];
      const newVendorMarkers = [];


      for (const id in data) {
        const userData = data[id];
        if (userData.location && userData.status === 'active') {
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
            if (user.role === 'customer') {
              newUserMarkers.push(marker);
            } else {
              newVendorMarkers.push(marker);
            }
          }
        }
      }

      setUserMarkers(newUserMarkers);
      setVendorMarkers(newVendorMarkers);
      setLoading(false);
    });
  }, [user.docId, user.role]);

  useEffect(() => {
    if (!user || !user.docId) { return; }

    if (typeof window !== 'undefined' && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          updateUserLocation(latitude, longitude);
          setLoading(false);
        },
        () => {
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
  }, [updateUserLocation]);

  const handleCloseClick = () => {
    setIsDrawerOpen(true);
  };

  const handleConfirm = async () => {
    if (!user || !user.docId) { return; }

    try {
      const userRef = ref(realtimeDb, `users/${user.docId}`);
      await update(userRef, { status: 'inactive' });
      let message = 'Kamu telah keluar dari pantauan Tukang Bakso';
      if (user.role === 'vendor') {
        message = 'Kamu telah menonaktifkan status Tukang Bakso';
      }
      toast.info(message);
      setUser({
        name: '',
        role: '',
        docId: '',
      });
      router.push('/verification');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating user status: ', error);
    }
    setIsDrawerOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="absolute top-4 right-4 z-20 p-2 bg-white rounded-full shadow-xl hover:bg-gray-200 transition duration-200"
        onClick={handleCloseClick}
      >
        <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </button>
      <div className="h-screen w-full md:h-screen md:w-screen">
        <MapContainer
          attributionControl={false}
          center={position || [51.505, -0.09]}
          className="h-full w-full transition-opacity duration-300 z-10"
          key={loading ? 'loading' : 'loaded'}
          style={{ opacity: loading ? 0.5 : 1 }}
          zoom={20}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {vendorMarkers.map((marker) => (
            <LocationMarker key={marker.id} popupText={marker.popupText} position={marker.position}
              userPosition={position} />
          ))}
          {userMarkers.map((marker) => (
            <LocationMarker iconUrl="/images/user.png" key={marker.id} popupText={marker.popupText} position={marker.position} userPosition={position} />
          ))}
        </MapContainer>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin" />
          </div>
        )}

        <ConfirmationDrawer
          isOpen={isDrawerOpen}
          message={`Dengan menutup halaman ini, kamu akan keluar dari pantauan ${user.role === 'customer' ? 'Tukang Bakso' : 'Customer'}`}
          onClose={() => setIsDrawerOpen(false)}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
};

export default MapComponent;
