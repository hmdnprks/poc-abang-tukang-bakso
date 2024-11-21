import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(),
  getApp: jest.fn(),
}));

jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
}));

jest.mock('firebase/database', () => ({
  getDatabase: jest.fn(),
}));

describe('Firebase Initialization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should reuse existing Firebase app if one exists', () => {
    const mockApp = { name: 'mockApp' };
    (getApps as jest.Mock).mockReturnValue([mockApp]);
    (getApp as jest.Mock).mockReturnValue(mockApp);


    jest.isolateModules(() => {
      const { app } = require('./firebase');
      expect(getApp).toHaveBeenCalled();
      expect(initializeApp).not.toHaveBeenCalled();
      expect(app).toEqual(mockApp);
    });
  });

  test('should not initialize Analytics on the server', () => {
    const mockApp = { name: 'mockApp' };
    (getApps as jest.Mock).mockReturnValue([mockApp]);
    (getApp as jest.Mock).mockReturnValue(mockApp);


    Object.defineProperty(global, 'window', {
      value: undefined,
      writable: true,
    });


    jest.isolateModules(() => {
      const { analytics } = require('./firebase');
      expect(getAnalytics).not.toHaveBeenCalled();
      expect(analytics).toBeNull();
    });
  });
});
