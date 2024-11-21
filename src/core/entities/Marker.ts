import { LatLngTuple } from 'leaflet';

export interface Marker {
  id: string;
  position: LatLngTuple;
  popupText: string;
}
