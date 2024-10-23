import { useEffect, useState } from 'react';
import { Marker, Polyline, Popup, Tooltip, useMap } from 'react-leaflet';
import { icon, LatLngTuple } from 'leaflet';
import DirectionBox from '@components/DirectionBox/DirectionBox';
import { estimateDuration } from '../../lib/common';
import WaypointsBox from '@components/WaypointsBox/WaypointsBox';
interface LocationMarkerProps {
  position: LatLngTuple;
  popupText?: string;
  iconUrl?: string;
  userPosition?: LatLngTuple | null;
}

interface RouteData {
  distance: number;
  duration: number;
  geometry: GeoJSON.LineString;
  steps: Step[];
  waypoints?: Waypoint[];
}

interface Step {
  direction: string;
  description: string;
}

interface Waypoint {
  name: string;
  hint: string;
  distance: number;
  location: LatLngTuple;
}
const LocationMarker: React.FC<LocationMarkerProps> = ({ position, popupText, iconUrl, userPosition }) => {
  const [route, setRoute] = useState<LatLngTuple[] | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [showRoute, setShowRoute] = useState<boolean>(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [wayPoints, setWayPoints] = useState<Waypoint[]>([]);

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

  const handleMarkerClick = async () => {
    if (userPosition) {
      const distanceDuration = await calculateRoute(userPosition, position);
      if (distanceDuration) {
        setRoute(distanceDuration.geometry.coordinates.map(coord => [coord[1], coord[0]] as LatLngTuple));
        setRouteInfo({
          distance: parseFloat(distanceDuration.distance.toFixed(2)).toLocaleString('id-ID') + ' km',
          duration: parseFloat(distanceDuration.duration.toFixed(2)).toLocaleString('id-ID') + ' menit',
        });
        setSteps(distanceDuration.steps);
        setWayPoints(distanceDuration.waypoints || []);
        setShowRoute(true);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getDirectionFromStep = (step: any): string => {
    switch (step.maneuver.type) {
      case 'turn':
        return step.maneuver.modifier === 'left' ? 'left' : 'right';
      case 'straight':
        return 'straight';
      default:
        return 'straight';
    }
  };


  const calculateRoute = async (origin: LatLngTuple, destination: LatLngTuple): Promise<RouteData | null> => {
    const [originLat, originLon] = origin;
    const [destLat, destLon] = destination;
    const url = `http://router.project-osrm.org/route/v1/foot/${originLon},${originLat};${destLon},${destLat}?overview=full&geometries=geojson`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];


        const distanceInKilometers = route.distance / 1000;
        const durationInMinutes = estimateDuration(distanceInKilometers, 'bike');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const routeSteps = route.legs[0].steps.map((step: any) => ({
          direction: getDirectionFromStep(step),
          description: step?.name,
        }));

        return {
          distance: distanceInKilometers,
          duration: durationInMinutes,
          geometry: route.geometry,
          steps: routeSteps,
          waypoints: data.waypoints
        };
      } else {
        console.error('No route found');
        return null;
      }
    } catch (error) {
      console.error('Error fetching route:', error);
      return null;
    }
  };

  const handlePopupClose = () => {
    setShowRoute(false);
    setRoute(null);
    setRouteInfo(null);
    setSteps([]);
  };

  return (
    <>
      <Marker position={position} icon={customIcon} eventHandlers={{
        click: handleMarkerClick,
        popupclose: handlePopupClose
      }}>
        <Popup

        >
          <div className="font-medium">
            <p className="text-lg font-tsel-batik font-semibold">{popupText}</p>
            {routeInfo && (
              <div className="font-poppins">
                <p>Jarak: {routeInfo.distance}</p>
                <p>Perkiraan Waktu: {routeInfo.duration}</p>
              </div>
            )}
          </div>
        </Popup>
        <Tooltip direction="right" offset={[25, -25]} opacity={1} permanent>
          <span className="font-poppins">
            {popupText}
          </span>
        </Tooltip>
      </Marker>

      {showRoute && route && (
        <Polyline
          positions={route}
          color="blue"
          weight={4}
          opacity={0.6}
        />
      )}

      {showRoute && steps.length > 0 && (
        <DirectionBox steps={steps} />
      )}

      {showRoute && wayPoints.length > 0 && (
        <WaypointsBox waypoints={wayPoints} />
      )}
    </>
  );
};

export default LocationMarker;
