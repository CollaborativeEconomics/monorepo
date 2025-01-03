// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: "https://edf8f6fe181573e95140bb017f1a151b@o4508047475081216.ingest.us.sentry.io/4508047477964800",

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
})
