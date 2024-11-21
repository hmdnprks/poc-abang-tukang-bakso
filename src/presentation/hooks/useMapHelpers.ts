import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import { LatLngTuple } from 'leaflet';

export const useMapHelpers = (position: LatLngTuple) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
};
