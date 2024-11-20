import { renderHook, act } from '@testing-library/react';
import useLocalStorage from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('should initialize with the value from localStorage if it exists', () => {
    window.localStorage.setItem('testKey', JSON.stringify('stored value'));

    const { result } = renderHook(() => useLocalStorage('testKey', 'default value'));

    expect(result.current[0]).toBe('stored value');
  });

  test('should initialize with the default value if localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'default value'));

    expect(result.current[0]).toBe('default value');
  });

  test('should update localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'default value'));

    act(() => {
      result.current[1]('new value');
    });

    expect(result.current[0]).toBe('new value');
    expect(window.localStorage.getItem('testKey')).toBe(JSON.stringify('new value'));
  });

  test('should handle functional updates correctly', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
    expect(window.localStorage.getItem('testKey')).toBe(JSON.stringify(1));
  });

  test('should handle errors gracefully when localStorage throws', () => {

    const mockSetItem = jest.fn(() => {
      throw new Error('localStorage error');
    });

    Object.defineProperty(window, 'localStorage', {
      value: {
        ...window.localStorage,
        setItem: mockSetItem,
      },
      writable: true,
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    const { result } = renderHook(() => useLocalStorage('testKey', 'default value'));


    act(() => {
      result.current[1]('new value');
    });

    expect(result.current[0]).toBe('new value');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error writing to localStorage', expect.any(Error));


    consoleErrorSpy.mockRestore();
  });

});
