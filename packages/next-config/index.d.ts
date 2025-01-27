import type { NextConfig } from "next"
import type { Configuration as WebpackConfig } from "webpack"

declare const webpackConfig: (
  config: WebpackConfig,
  context: { isServer: boolean },
) => WebpackConfig

declare const sharedNextConfig: NextConfig

export = sharedNextConfig
