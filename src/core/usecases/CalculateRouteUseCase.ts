import { LatLngTuple } from 'leaflet';
import { RouteDatasource } from '../../data/datasources/RouteDatasource';
import { RouteData } from '../entities/RouteData';

export class CalculateRouteUseCase {
  private readonly datasource: RouteDatasource;

  constructor(datasource: RouteDatasource) {
    this.datasource = datasource;
  }

  async execute(origin: LatLngTuple, destination: LatLngTuple): Promise<RouteData | null> {
    return this.datasource.getRoute(origin, destination);
  }
}
