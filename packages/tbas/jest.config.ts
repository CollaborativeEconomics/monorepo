import type { Config } from "jest"
import { createDefaultPreset } from "ts-jest"

const config: Config = {
  ...createDefaultPreset(),
  coverageProvider: "v8",
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
    "^.+\\.[tj]s$": "ts-jest",
    //   "^.+\\.m?js$": "jest-esm-transformer",
  },
  transformIgnorePatterns: ["dist/"],
  // globals: {
  //   "ts-jest": {
  //     tsconfig: {
  //       allowJs: true,
  //     },
  //   },
  // },
  // extensionsToTreatAsEsm: [".ts"],
}

// @ts-ignore
export default config
