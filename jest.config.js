const nextJest = require('next/jest');
const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/presentation/components/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@hooks/(.*)$': '<rootDir>/src/presentation/hooks/$1',
    '^@data/(.*)$': '<rootDir>/src/data/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  transformIgnorePatterns: ['/node_modules/(?!(react-leaflet|@react-leaflet|leaflet)/)'],
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html', 'text-summary'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!src/**/*.d.ts',
    '!src/**/*.cy.tsx',
  ],
};

module.exports = createJestConfig(customJestConfig);
