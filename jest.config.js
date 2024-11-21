// jest.config.js
const nextJest = require('next/jest');
const createJestConfig = nextJest({ dir: './' });

// Any custom config you want to pass to Jest
const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Handle module aliases (if you have them in your tsconfig.json)
    '^@components/(.*)$': '<rootDir>/src/presentation/components/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@hooks/(.*)$': '<rootDir>/src/presentation/hooks/$1',
    '^@data/(.*)$': '<rootDir>/src/data/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
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
