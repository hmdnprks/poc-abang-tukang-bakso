import { render, screen, fireEvent, act } from '@testing-library/react';
import LocationMarker from './LocationMarker';
import { useMap } from 'react-leaflet';
import { CalculateRouteUseCase } from '@core/usecases/CalculateRouteUseCase';
import { LatLngTuple } from 'leaflet';


jest.mock('react-leaflet', () => ({
  Marker: ({ children, eventHandlers }: any) => (
    <div data-testid="marker" onBlur={eventHandlers.popupclose} onClick={eventHandlers.click} onKeyDown={(e) => e.key === 'Enter' && eventHandlers.click()} role="button">
      {children}
    </div>
  ),
  Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
  Tooltip: ({ children }: any) => <div data-testid="tooltip">{children}</div>,
  Polyline: () => <div data-testid="polyline" />,
  useMap: jest.fn(),
}));

jest.mock('@components/DirectionBox/DirectionBox', () => ({
  __esModule: true,
  default: ({ steps }: any) => (
    <div data-testid="direction-box">
      {steps.map((step: any) => (
        <div key={step.description}>{step.description}</div>
      ))}
    </div>
  ),
}));

jest.mock('@components/WaypointsBox/WaypointsBox', () => ({
  __esModule: true,
  default: ({ waypoints }: any) => (
    <div data-testid="waypoints-box">
      {waypoints.map((waypoint: any) => (
        <div key={waypoint.name}>{waypoint.name}</div>
      ))}
    </div>
  ),
}));

jest.mock('@core/usecases/CalculateRouteUseCase');

describe('LocationMarker Component', () => {
  const mockPosition: LatLngTuple = [51.505, -0.09];
  const mockUserPosition: LatLngTuple = [51.506, -0.08];
  const mockRouteData = {
    geometry: [
      [51.505, -0.09],
      [51.506, -0.08],
    ],
    distance: 5.5,
    duration: 10.5,
    steps: [{ direction: 'right', description: 'Turn right' }],
    waypoints: [{ name: 'Waypoint 1', hint: 'hint', distance: 0.5, location: [51.506, -0.08] }],
  };

  beforeEach(() => {
    (CalculateRouteUseCase as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(mockRouteData),
    }));

    (useMap as jest.Mock).mockReturnValue({
      setView: jest.fn(),
      getZoom: jest.fn().mockReturnValue(13),
    });
  });

  test('renders marker, popup, and tooltip with correct props', () => {
    render(<LocationMarker popupText="Hello Marker" position={mockPosition} userPosition={mockUserPosition} />);


    expect(screen.getByTestId('marker')).toBeInTheDocument();
    expect(screen.getByTestId('popup')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toHaveTextContent('Hello Marker');
  });

  test('hides route and clears state on popup close', async () => {
    render(<LocationMarker popupText="Hello Marker" position={mockPosition} userPosition={mockUserPosition} />);

    const marker = screen.getByTestId('marker');


    await act(async () => {
      fireEvent.click(marker);
    });


    expect(screen.getByTestId('polyline')).toBeInTheDocument();


    await act(async () => {
      fireEvent.blur(marker);
    });


    expect(screen.queryByTestId('polyline')).not.toBeInTheDocument();
    expect(screen.queryByTestId('direction-box')).not.toBeInTheDocument();
    expect(screen.queryByTestId('waypoints-box')).not.toBeInTheDocument();
  });

  test('handles no userPosition gracefully', async () => {
    render(<LocationMarker popupText="Hello Marker" position={mockPosition} userPosition={null} />);

    const marker = screen.getByTestId('marker');


    await act(async () => {
      fireEvent.click(marker);
    });


    expect(CalculateRouteUseCase.prototype.execute).not.toHaveBeenCalled();


    expect(screen.queryByTestId('polyline')).not.toBeInTheDocument();
    expect(screen.queryByTestId('direction-box')).not.toBeInTheDocument();
    expect(screen.queryByTestId('waypoints-box')).not.toBeInTheDocument();
  });
});
