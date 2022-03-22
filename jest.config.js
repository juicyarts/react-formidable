module.exports = {
  testPathIgnorePatterns: ['/node_modules/'],
  testRegex: 'spec.(js|ts|tsx)$',
  globals: {
    Enzyme: true,
  },
  testEnvironment: 'jest-environment-jsdom-fourteen',
  testEnvironmentOptions: {
    enzymeAdapter: 'react16',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: '<rootDir>/reports/unit/',
      },
    ],
  ],
  coverageReporters: ['cobertura', 'lcov', 'text-summary'],
  coverageDirectory: '<rootDir>/reports/unit',
  collectCoverageFrom: ['src/**/*.{js,ts,tsx}', 'tests/**/*.{js,ts,tsx}'],
  collectCoverage: true,
};
