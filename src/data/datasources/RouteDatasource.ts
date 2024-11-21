import { LatLngTuple } from 'leaflet';
import { RouteData } from '../../core/entities/RouteData';
import { Step } from '../../core/entities/Step';
import { estimateDuration } from '@core/services/estimateDuration';

export class RouteDatasource {
  async getRoute(origin: LatLngTuple, destination: LatLngTuple): Promise<RouteData | null> {
    const [originLat, originLon] = origin;
    const [destLat, destLon] = destination;

    const url = `https://router.project-osrm.org/route/v1/foot/${originLon},${originLat};${destLon},${destLat}?overview=full&geometries=geojson`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceInKilometers = route.distance / 1000;
        const durationInMinutes = estimateDuration(distanceInKilometers, 'bike');

        const steps: Step[] = route.legs[0].steps.map((step: any) => ({
          direction: this.getDirectionFromStep(step),
          description: step?.name,
        }));

        return {
          distance: distanceInKilometers,
          duration: durationInMinutes,
          geometry: route.geometry.coordinates.map(
            ([lon, lat]: [number, number]) => [lat, lon] as LatLngTuple
          ),
          steps,
          waypoints: data.waypoints,
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  private getDirectionFromStep(step: any): string {
    switch (step.maneuver.type) {
      case 'turn':
        return step.maneuver.modifier === 'left' ? 'left' : 'right';
      case 'straight':
        return 'straight';
      default:
        return 'straight';
    }
  }
}
