import { useState } from 'react';
import { Marker, Polyline, Popup, Tooltip } from 'react-leaflet';
import { icon, LatLngTuple } from 'leaflet';
import DirectionBox from '@components/DirectionBox/DirectionBox';
import WaypointsBox from '@components/WaypointsBox/WaypointsBox';
import { CalculateRouteUseCase } from '@core/usecases/CalculateRouteUseCase';
import { RouteDatasource } from '@data/datasources/RouteDatasource';
import { RouteData } from '@core/entities/RouteData';
import { useMapHelpers } from '@hooks/useMapHelpers';

interface LocationMarkerProps {
  position: LatLngTuple;
  popupText?: string;
  iconUrl?: string;
  userPosition?: LatLngTuple | null;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ position, popupText, iconUrl, userPosition }) => {
  const [route, setRoute] = useState<LatLngTuple[] | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [steps, setSteps] = useState<RouteData['steps']>([]);
  const [wayPoints, setWayPoints] = useState<RouteData['waypoints']>([]);
  const [showRoute, setShowRoute] = useState(false);

  useMapHelpers(position);

  const customIcon = icon({
    iconUrl: iconUrl ?? '/images/cart.png',
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [0, -30],
    shadowUrl: '/images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });

  const handleMarkerClick = async () => {
    if (userPosition) {
      const datasource = new RouteDatasource();
      const calculateRouteUseCase = new CalculateRouteUseCase(datasource);

      const routeData = await calculateRouteUseCase.execute(userPosition, position);
      if (routeData) {
        setRoute(routeData.geometry);
        setRouteInfo({
          distance: `${routeData.distance.toFixed(2)} km`,
          duration: `${routeData.duration.toFixed(2)} menit`,
        });
        setSteps(routeData.steps);
        setWayPoints(routeData.waypoints || []);
        setShowRoute(true);
      }
    }
  };

  const handlePopupClose = () => {
    setShowRoute(false);
    setRoute(null);
    setRouteInfo(null);
    setSteps([]);
    setWayPoints([]);
  };

  return (
    <>
      <Marker
        eventHandlers={{
          click: handleMarkerClick,
          popupclose: handlePopupClose,
        }}
        icon={customIcon}
        position={position}
      >
        <Popup>
          <div>
            <p>{popupText}</p>
            {routeInfo && (
              <div>
                <p>Jarak: {routeInfo.distance}</p>
                <p>Perkiraan Waktu: {routeInfo.duration}</p>
              </div>
            )}
          </div>
        </Popup>
        <Tooltip direction="right" offset={[25, -25]} opacity={1} permanent>
          {popupText}
        </Tooltip>
      </Marker>

      {showRoute && route && <Polyline color="blue" opacity={0.6} positions={route} weight={4} />}
      {showRoute && steps.length > 0 && <DirectionBox steps={steps} />}
      {showRoute && wayPoints && wayPoints.length > 0 && <WaypointsBox waypoints={wayPoints} />}
    </>
  );
};

export default LocationMarker;
