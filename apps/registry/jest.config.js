module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '\\.(js|jsx)$': ['babel-jest', { configFile: './babel.config.testing.js' }],
  },
  setupFiles: ['<rootDir>/.jest/setEnvVars.ts'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  testRegex: ['(/__tests__/.*|(\\.|/)(?!test\\.ts$).*\\.test)\\.ts$'], // exclude files named test.ts, like the test api route
};