'use client';
import React, { useState, useEffect } from 'react';
import { LatLngTuple } from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';
import LocationMarker from '@components/LocationMarker/LocationMarker';
import ConfirmationDrawer from '@components/ConfirmationDrawer/ConfirmationDrawer';
import ContentConfirmation from '@components/ContentConfirmation/ContentConfirmation';
import useLocalStorage from '@hooks/useLocalStorage';
import { PermissionStatusUseCase } from '@core/usecases/PermissionStatusUseCase';
import { FetchMarkersUseCase } from '@core/usecases/FetchMarkersUseCase';
import { UpdateUserLocationUseCase } from '@core/usecases/UpdateUserLocationUseCase';
import { RealtimeDatabaseDatasource } from '@data/datasources/RealtimeDatabaseDatasource';
import { Marker } from '@core/entities/Marker';
import 'leaflet/dist/leaflet.css';
import CloseButton from '@components/CloseButton/CloseButton';
import { toast } from 'react-toastify';
import { UpdateUserStatusUseCase } from '@core/usecases/UpdateUserStatusUseCase';
import { useRouter } from 'next/navigation';

const datasource = new RealtimeDatabaseDatasource();
const fetchMarkersUseCase = new FetchMarkersUseCase(datasource);
const updateUserLocationUseCase = new UpdateUserLocationUseCase(datasource);
const updateUserStatusUseCase = new UpdateUserStatusUseCase(datasource);

const permissionStatusUseCase = new PermissionStatusUseCase();

const MapComponent: React.FC = () => {
  const [user, setUser] = useLocalStorage('user', { name: '', role: '', docId: '' });
  const [position, setPosition] = useState<LatLngTuple | null>(null);
  const [userMarkers, setUserMarkers] = useState<Marker[]>([]);
  const [vendorMarkers, setVendorMarkers] = useState<Marker[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [gpsError, setGpsError] = useState(false);

  const router = useRouter();
  const status = permissionStatusUseCase.execute(permissionDenied, gpsError, user.role) as 'permissionDenied' | 'gpsError' | 'customer' | 'vendor';

  const handleConfirm = async () => {
    if (!user?.docId) {
      return;
    }

    try {
      const { message } = await updateUserStatusUseCase.execute(user.docId, user.role);
      toast.info(message);

      setUser({ name: '', role: '', docId: '' });
      router.push('/verification');
    } catch (error) {
      toast.error('Failed to update user status. Please try again.');
    } finally {
      setIsDrawerOpen(false);
    }
  };

  useEffect(() => {
    if (!user?.docId) { return; }

    fetchMarkersUseCase.execute(user.role, user.docId).then(({ userMarkers, vendorMarkers }) => {
      setUserMarkers(userMarkers);
      setVendorMarkers(vendorMarkers);
    });
  }, [user]);

  useEffect(() => {
    if (!navigator.geolocation) { return; }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        updateUserLocationUseCase.execute(user.docId, latitude, longitude);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setPermissionDenied(true);
          setIsDrawerOpen(true);
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setGpsError(true);
          setIsDrawerOpen(true);
        }
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [user]);

  return (
    <div className="relative">
      <div className="h-screen w-full md:h-screen md:w-screen">
        <CloseButton onClick={() => setIsDrawerOpen(true)} />
        <MapContainer center={position || [0, 0]} className="h-screen" zoom={15}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {vendorMarkers.map((marker) => (
            <LocationMarker key={marker.id} popupText={marker.popupText} position={marker.position} userPosition={position} />
          ))}
          {userMarkers.map((marker) => (
            <LocationMarker key={marker.id} popupText={marker.popupText} position={marker.position} userPosition={position} />
          ))}
        </MapContainer>
      </div>

      <ConfirmationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onConfirm={handleConfirm}
      >
        <ContentConfirmation status={status} />
      </ConfirmationDrawer>
    </div>
  );
};

export default MapComponent;
