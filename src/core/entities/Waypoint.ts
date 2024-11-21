import { LatLngTuple } from 'leaflet';

export interface Waypoint {
  name: string;
  hint: string;
  distance: number;
  location: LatLngTuple;
}
