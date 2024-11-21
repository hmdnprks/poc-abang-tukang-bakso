import { Marker } from '@core/entities/Marker';

export interface MarkerRepository {
  fetchMarkers(userRole: string, userDocId: string): Promise<{
    userMarkers: Marker[];
    vendorMarkers: Marker[];
  }>;
}
