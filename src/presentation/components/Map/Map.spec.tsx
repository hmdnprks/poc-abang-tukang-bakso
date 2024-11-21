import { render, screen, fireEvent, act } from '@testing-library/react';
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
const updateMock = jest.fn();
jest.mock('firebase/database', () => ({
  ref: jest.fn(),
  onValue: jest.fn((ref, callback) => onValueMock(ref, callback)),
  update: jest.fn(() => Promise.resolve()),
}));

jest.mock('@hooks/useLocalStorage', () => jest.fn(() => [{ name: 'John', role: 'customer', docId: '123' }, jest.fn()]));

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

jest.mock('@core/usecases/PermissionStatusUseCase', () => ({
  PermissionStatusUseCase: jest.fn(() => ({
    execute: jest.fn((permissionDenied, gpsError, role) => {
      if (permissionDenied) return 'permissionDenied';
      if (gpsError) return 'gpsError';
      return role === 'customer' ? 'customer' : 'vendor';
    }),
  })),
}));

jest.mock('@core/usecases/FetchMarkersUseCase', () => ({
  FetchMarkersUseCase: jest.fn(() => ({
    execute: jest.fn(() =>
      Promise.resolve({
        userMarkers: [{ id: '1', position: [51.505, -0.09], popupText: 'User Marker' }],
        vendorMarkers: [{ id: '2', position: [51.506, -0.08], popupText: 'Vendor Marker' }],
      })
    ),
  })),
}));

jest.mock('@core/usecases/UpdateUserLocationUseCase', () => ({
  UpdateUserLocationUseCase: jest.fn(() => ({
    execute: jest.fn(),
  })),
}));

jest.mock('@core/usecases/UpdateUserStatusUseCase', () => ({
  UpdateUserStatusUseCase: jest.fn(() => ({
    execute: jest.fn(() =>
      Promise.resolve({
        message: 'User status updated successfully',
      })
    ),
  })),
}));

describe('MapComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(global.navigator, 'geolocation', {
      value: {
        watchPosition: jest.fn(),
        clearWatch: jest.fn(),
        getCurrentPosition: jest.fn(),
      },
      writable: true,
    });
  });

  test('renders the map container and tile layer', () => {
    render(<MapComponent />);

    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
  });

  // test('renders location markers', async () => {
  //   await act(async () => {
  //     render(<MapComponent />);
  //   });

  //   await act(async () => {
  //     await new Promise((resolve) => setTimeout(resolve, 0));
  //   });

  //   expect(screen.getAllByTestId('location-marker')).toHaveLength(2);
  // });


  // test('shows confirmation drawer on close button click', () => {
  //   render(<MapComponent />);

  //   const closeButton = screen.getByTestId('btn-close');
  //   fireEvent.click(closeButton);

  //   expect(screen.getByTestId('confirmation-drawer')).toBeInTheDocument();
  // });

  // test('handles permission denied scenario', async () => {
  //   const geolocationMock = {
  //     watchPosition: jest.fn((success, error) => {
  //       error({ code: 1 });
  //       return 1;
  //     }),
  //     clearWatch: jest.fn(),
  //     getCurrentPosition: jest.fn(),
  //   };

  //   Object.defineProperty(global.navigator, 'geolocation', {
  //     value: geolocationMock,
  //     writable: true,
  //   });

  //   await act(async () => {
  //     render(<MapComponent />);
  //   });

  //   expect(screen.getByTestId('confirmation-drawer')).toBeInTheDocument();
  //   expect(screen.getByText(/akses lokasi ditolak/i)).toBeInTheDocument();
  // });

  // test('handles GPS error scenario', async () => {
  //   const geolocationMock = {
  //     watchPosition: jest.fn((success, error) => {
  //       error({ code: 2 });
  //       return 1;
  //     }),
  //     clearWatch: jest.fn(),
  //     getCurrentPosition: jest.fn(),
  //   };

  //   Object.defineProperty(global.navigator, 'geolocation', {
  //     value: geolocationMock,
  //     writable: true,
  //   });

  //   await act(async () => {
  //     render(<MapComponent />);
  //   });

  //   expect(screen.getByTestId('confirmation-drawer')).toBeInTheDocument();
  //   expect(screen.getByText(/sinyal gps lemah/i)).toBeInTheDocument();
  // });
});
