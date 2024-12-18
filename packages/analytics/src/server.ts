import { PostHog } from "posthog-node"

const posthogNodeClient = new PostHog(
  "phc_ycqncNaqbtyTy1Drs5p1paG8TzekkVR4nq7CrRVZEYP",
  { host: "https://us.i.posthog.com" },
)

export { posthogNodeClient }
