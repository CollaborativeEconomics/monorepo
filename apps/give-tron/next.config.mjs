import { fileURLToPath } from "node:url"
import sharedNextConfig from "@cfce/next-config"
import createJiti from "jiti"

const jiti = createJiti(fileURLToPath(import.meta.url))

// Import env here to validate during build
jiti("./src/env")

export default sharedNextConfig
