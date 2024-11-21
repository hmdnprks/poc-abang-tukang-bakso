import { render, screen, fireEvent } from '@testing-library/react';
import MapComponent from './Map';


jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
}));


jest.mock('../LocationMarker/LocationMarker', () => {
  const MockLocationMarker = () => <div data-testid="location-marker">LocationMarker</div>;
  MockLocationMarker.displayName = 'MockLocationMarker';
  return MockLocationMarker;
});

const onValueMock = jest.fn();
jest.mock('firebase/database', () => ({
  ref: jest.fn(),
  onValue: jest.fn((ref, callback) => onValueMock(ref, callback)),
  update: jest.fn(),
}));


jest.mock('@hooks/useLocalStorage', () => {
  return jest.fn(() => [jest.fn(), jest.fn()]);
});

jest.mock('@infrastructure/firebase/firebase', () => ({
  realtimeDb: {},
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));


jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

describe('MapComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the map container and tile layer', () => {
    render(<MapComponent />);

    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
  });

  // test('renders location markers when data is available', async () => {
  //   const mockFirebaseData = {
  //     user1: { location: { latitude: 51.505, longitude: -0.09 }, name: 'User 1', role: 'vendor', status: 'active' },
  //     user2: { location: { latitude: 51.51, longitude: -0.1 }, name: 'User 2', role: 'customer', status: 'active' },
  //   };

  //   render(<MapComponent />);

  //   const callback = onValueMock.mock.calls[0][1];
  //   callback({
  //     val: () => mockFirebaseData,
  //   });

  //   await waitFor(() => {
  //     expect(screen.getAllByTestId('location-marker').length).toBeGreaterThan(0);
  //   });

  //   expect(screen.getAllByTestId('location-marker')).toHaveLength(2);
  // });

  test('shows confirmation drawer on close button click', () => {
    render(<MapComponent />);

    const closeButton = screen.getByTestId('btn-close');
    fireEvent.click(closeButton);

    expect(screen.getByTestId('confirmation-drawer')).toBeInTheDocument();
  });

  // test('handles permission denied error', async () => {
  //   render(<MapComponent />);

  //   const { navigator } = global;
  //   global.navigator = {
  //     ...navigator,
  //     geolocation: {
  //       getCurrentPosition: jest.fn(),
  //       watchPosition: jest.fn((_, errorCallback) => {
  //         if (errorCallback) {
  //           errorCallback({
  //             code: 1,
  //             message: 'Permission denied',
  //             PERMISSION_DENIED: 1,
  //             POSITION_UNAVAILABLE: 2,
  //             TIMEOUT: 3,
  //           });
  //         }
  //         return 1;
  //       }),
  //       clearWatch: jest.fn(),
  //     },
  //   };

  //   await waitFor(() => {
  //     expect(screen.getByText(/akses lokasi ditolak/i)).toBeInTheDocument();
  //   });

  //   global.navigator = navigator;
  // });

  // test('handles GPS error and retries', async () => {
  //   render(<MapComponent />);

  //   const { navigator } = global;
  //   global.navigator = {
  //     ...navigator,
  //     geolocation: {
  //       getCurrentPosition: jest.fn(),
  //       watchPosition: jest.fn((_, errorCallback) => {
  //         if (errorCallback) {
  //           errorCallback({
  //             code: 2,
  //             message: 'Position unavailable',
  //             PERMISSION_DENIED: 1,
  //             POSITION_UNAVAILABLE: 2,
  //             TIMEOUT: 3,
  //           });
  //         }
  //         return 1;
  //       }),
  //       clearWatch: jest.fn(),
  //     },
  //   };

  //   await waitFor(() => {
  //     expect(screen.getByText(/sinyal gps lemah/i)).toBeInTheDocument();
  //   });

  //   expect(toast.error).not.toHaveBeenCalled();

  //   global.navigator = navigator;
  // });

  // test('updates user location on position change', async () => {
  //   const mockWatchPosition = jest.fn((successCallback) => {
  //     successCallback({ coords: { latitude: 51.505, longitude: -0.09 } });
  //     return 1;
  //   });

  //   const mockClearWatch = jest.fn();

  //   const { navigator } = global;
  //   global.navigator = {
  //     ...navigator,
  //     geolocation: {
  //       getCurrentPosition: jest.fn(),
  //       watchPosition: mockWatchPosition,
  //       clearWatch: mockClearWatch,
  //     },
  //   };

  //   render(<MapComponent />);

  //   await waitFor(() => {
  //     expect(update).toHaveBeenCalledWith(expect.anything(), {
  //       location: { latitude: 51.505, longitude: -0.09 },
  //       status: 'active',
  //     });
  //   });

  //   expect(mockWatchPosition).toHaveBeenCalled();
  //   expect(mockClearWatch).not.toHaveBeenCalled();

  //   global.navigator = navigator;
  // });
});
