import { MarkerRepository } from '@core/repositories/MarkerRepository';
import { Marker } from '../entities/Marker';

export class FetchMarkersUseCase {
  constructor(private markerRepository: MarkerRepository) { }

  async execute(userRole: string, userDocId: string): Promise<{
    userMarkers: Marker[];
    vendorMarkers: Marker[];
  }> {
    return this.markerRepository.fetchMarkers(userRole, userDocId);
  }
}
