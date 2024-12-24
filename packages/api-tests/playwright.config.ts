import { defineConfig } from "@playwright/test"

import path from "node:path"
import dotenv from "dotenv"

// Read from ".env" file.
dotenv.config({ path: path.resolve(__dirname, ".env.local") })

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000/api",
    trace: "on-first-retry",
  },
})
