module.exports = {
  ...jest.requireActual('react-leaflet'),
  Marker: ({ children, eventHandlers }) => (
    <div data-testid="marker" onBlur={eventHandlers?.popupclose} onClick={eventHandlers?.click}>
      {children}
    </div>
  ),
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
  Tooltip: ({ children }) => <div data-testid="tooltip">{children}</div>,
  Polyline: () => <div data-testid="polyline" />,
  useMap: jest.fn(() => ({
    setView: jest.fn(),
    getZoom: jest.fn().mockReturnValue(13),
  })),
};
