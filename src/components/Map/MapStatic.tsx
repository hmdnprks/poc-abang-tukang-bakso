// pages/MapComponent.js
'use client';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useEffect, useState } from 'react';
import LocationMarker from '../LocationMarker/LocationMarker';
import useLocalStorage from '../../hooks/useLocalStorage';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, GeoPoint } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import ConfirmationDrawer from '@components/ConfirmationDrawer/ConfirmationDrawer';
import { toast } from 'react-toastify';


const MapComponent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [position, setPosition] = useState<LatLngTuple | null>([51.505, -0.09]);
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

  const [user,] = useLocalStorage('user', { name: '', role: '', docId: '' });

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchMarkers = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'users'),
          where('status', '==', 'active'),
        );

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.docId !== user.docId && data.location && data.role) {
            const geoPoint = data.location;

            const marker = {
              id: doc.id,
              position: [geoPoint.latitude, geoPoint.longitude] as LatLngTuple,
              popupText: data.name,
            };
            if (data.role === 'customer') {
              setUserMarkers((prevMarkers) => [...prevMarkers, marker]);
            } else if (data.role === 'vendor') {
              setVendorMarkers((prevMarkers) => [...prevMarkers, marker]);
            }
          }
        });

      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching markers:', error);
      } finally {
        setLoading(false);
      }

    };

    fetchMarkers();
  }, [user.docId]);

  useEffect(() => {
    if (position) {
      const currentUserMarker = {
        id: user.docId,
        position: position,
        popupText: user.name || 'You are here!',
      };

      if (user.role === 'customer') {
        setUserMarkers((prevMarkers) => [...prevMarkers, currentUserMarker]);
      } else if (user.role === 'vendor') {
        setVendorMarkers((prevMarkers) => [...prevMarkers, currentUserMarker]);
      }
    }
  }, [position, user.docId, user.name, user.role]);

  useEffect(() => {
    if (position && user.docId) {
      const updateLocation = async () => {
        setLoading(true);
        try {
          const userDocRef = doc(db, 'users', user.docId);
          await updateDoc(userDocRef, {
            location: new GeoPoint(position[0], position[1]),
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error updating location: ', error);
        } finally {
          setLoading(false);
        }
      };

      updateLocation();
    }
  }, [position, user.docId]);

  const handleCloseClick = () => {
    setIsDrawerOpen(true);
  };

  const handleConfirm = async () => {
    try {
      const userDocRef = doc(db, 'users', user.docId);
      await updateDoc(userDocRef, { status: 'inactive' });
      let message = 'Kamu telah keluar dari pantauan Tukang Bakso';
      if (user.role === 'vendor') {
        message = 'Kamu telah menonaktifkan status Tukang Bakso';
      }
      toast.info(message);
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
            <LocationMarker key={marker.id} popupText={marker.popupText}
              position={marker.position} />
          ))}
          {userMarkers.map((marker) => (
            <LocationMarker iconUrl="/images/user.png" key={marker.id} popupText={marker.popupText} position={marker.position} />
          ))}
        </MapContainer>

        {/* Loading Overlay */}
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
