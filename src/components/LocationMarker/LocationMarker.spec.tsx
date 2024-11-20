import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LocationMarker from './LocationMarker';

jest.mock('react-leaflet', () => ({
  useMap: jest.fn(() => ({
    setView: jest.fn(),
    getZoom: jest.fn(() => 13),
  })),
  Marker: jest.fn(({ children, eventHandlers }) => (
    <div data-testid="marker" onClick={eventHandlers?.click}>
      {children}
    </div>
  )),
  Popup: jest.fn(({ children }) => <div data-testid="popup">{children}</div>),
  Tooltip: jest.fn(({ children }) => <div data-testid="tooltip">{children}</div>),
  Polyline: jest.fn(({ positions }) => <div data-testid="polyline">{JSON.stringify(positions)}</div>),
}));

jest.mock('@components/DirectionBox/DirectionBox', () => jest.fn(() => <div data-testid="direction-box" />));
jest.mock('@components/WaypointsBox/WaypointsBox', () => jest.fn(() => <div data-testid="waypoints-box" />));
jest.mock('../../lib/common', () => ({
  estimateDuration: jest.fn(() => 10),
}));

global.fetch = jest.fn();

const mockRouteData = {
  routes: [
    {
      distance: 5000,
      geometry: { coordinates: [[0, 0], [1, 1]] },
      legs: [
        {
          steps: [
            { maneuver: { type: 'turn', modifier: 'left' }, name: 'Turn left' },
          ],
        },
      ],
    },
  ],
  waypoints: [{ name: 'Start', location: [0, 0] }],
};

describe('LocationMarker', () => {
  const defaultProps = {
    position: [0, 0] as [number, number],
    popupText: 'Test Location',
    iconUrl: '/test-icon.png',
    userPosition: [1, 1] as [number, number],
  };

  beforeEach(() => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockRouteData),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders marker with popup and tooltip', () => {
    render(<LocationMarker {...defaultProps} />);
    expect(screen.getByTestId('popup')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  test('displays route and directions when marker is clicked', async () => {
    render(<LocationMarker {...defaultProps} />);

    fireEvent.click(screen.getByTestId('marker'));

    await waitFor(() => {
      expect(screen.getByTestId('polyline')).toBeInTheDocument();
      expect(screen.getByTestId('direction-box')).toBeInTheDocument();
    });
  });

  test('displays waypoints when marker is clicked', async () => {
    render(<LocationMarker {...defaultProps} />);

    fireEvent.click(screen.getByTestId('marker'));

    await waitFor(() => {
      expect(screen.getByTestId('waypoints-box')).toBeInTheDocument();
    });
  });

  test('clears route and directions when popup is closed', async () => {
    render(<LocationMarker {...defaultProps} />);

    fireEvent.click(screen.getByTestId('marker'));

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('popup')); // Simulates closing the popup
      expect(screen.queryByTestId('polyline')).not.toBeInTheDocument();
      expect(screen.queryByTestId('direction-box')).not.toBeInTheDocument();
    });
  });
});
