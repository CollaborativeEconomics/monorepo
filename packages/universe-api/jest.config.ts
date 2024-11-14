/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  roots: ['src'],
  // customExportConditions: ['react-server', 'node', 'node-addons'],
  transform: {
    '\\.[jt]sx?$': [
      'ts-jest',
      {
        isolatedModules: true,
        tsconfig: '<rootDir>/tsconfig.json',
        useESM: true,
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

module.exports = config;
