module.exports = {
  icon: jest.fn(() => ({})),
  map: jest.fn(() => ({
    setView: jest.fn(),
    getZoom: jest.fn(),
  })),
};
