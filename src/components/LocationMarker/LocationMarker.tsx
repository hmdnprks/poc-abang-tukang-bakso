import { useEffect } from 'react';
import { Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import { icon, LatLngTuple } from 'leaflet';

interface LocationMarkerProps {
  position: LatLngTuple;
  popupText?: string;
  iconUrl?: string;
}


const LocationMarker: React.FC<LocationMarkerProps> = ({ position, popupText, iconUrl }) => {
  const map = useMap();

  const customIcon = icon({
    iconUrl: iconUrl || '/images/cart.png',
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [0, -30],
    shadowUrl: '/images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41]
  });

  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  return (
    <Marker position={position} icon={customIcon}>
      <Popup>
        <div className="text-lg font-medium">
          {popupText}
        </div>
      </Popup>
      <Tooltip direction="right" offset={[25, -25]} opacity={1} permanent>
        <span className="font-poppins">
          {popupText}
        </span>
      </Tooltip>
    </Marker>
  );
};

export default LocationMarker;
