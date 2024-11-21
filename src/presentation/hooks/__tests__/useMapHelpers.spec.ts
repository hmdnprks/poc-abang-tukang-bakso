import { renderHook } from "@testing-library/react";
import { useMapHelpers } from "../useMapHelpers";
import { useMap } from "react-leaflet";
import { LatLngTuple } from "leaflet";


jest.mock("react-leaflet", () => ({
  useMap: jest.fn(),
}));

describe("useMapHelpers", () => {
  const mockSetView = jest.fn();
  const mockGetZoom = jest.fn(() => 13);

  beforeEach(() => {

    jest.clearAllMocks();


    (useMap as jest.Mock).mockReturnValue({
      setView: mockSetView,
      getZoom: mockGetZoom,
    });
  });

  test("calls `setView` with the correct position and zoom level", () => {
    const position: LatLngTuple = [51.505, -0.09];


    renderHook(() => useMapHelpers(position));


    expect(mockSetView).toHaveBeenCalledWith(position, 13);
    expect(mockSetView).toHaveBeenCalledTimes(1);
  });

  test("does not call `setView` if position is not provided", () => {

    renderHook(() => useMapHelpers(null as unknown as LatLngTuple));


    expect(mockSetView).not.toHaveBeenCalled();
  });

  test("updates the map view when the position changes", () => {
    const initialPosition: LatLngTuple = [51.505, -0.09];
    const updatedPosition: LatLngTuple = [51.515, -0.1];

    const { rerender } = renderHook(({ position }: { position: LatLngTuple }) => useMapHelpers(position), {
      initialProps: { position: initialPosition },
    });

    expect(mockSetView).toHaveBeenCalledWith(initialPosition, 13);
    expect(mockSetView).toHaveBeenCalledTimes(1);

    rerender({ position: updatedPosition });

    expect(mockSetView).toHaveBeenCalledWith(updatedPosition, 13);
    expect(mockSetView).toHaveBeenCalledTimes(2);
  });
});
