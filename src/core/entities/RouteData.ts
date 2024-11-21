import { LatLngTuple } from 'leaflet';
import { Step } from './Step';
import { Waypoint } from './Waypoint';

export interface RouteData {
  distance: number;
  duration: number;
  geometry: LatLngTuple[];
  steps: Step[];
  waypoints?: Waypoint[];
}
