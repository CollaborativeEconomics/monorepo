/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@cfce/app-config|@cfce/database|@cfce/types)/)",
  ],
  moduleNameMapper: {
    "^@cfce/app-config$": "<rootDir>/src/mocks/appConfig.ts",
    "^@cfce/database$": "<rootDir>/src/mocks/database.ts",
    "^@cfce/types$": "<rootDir>/src/mocks/types.ts",
  },
}
