"use client"
import posthog from "posthog-js"
import {
  PostHogProvider as PostHogProviderBase,
  usePostHog,
} from "posthog-js/react"
import React, { type PropsWithChildren, useEffect } from "react"

export function initializeAnalytics() {
  posthog.init("phc_ycqncNaqbtyTy1Drs5p1paG8TzekkVR4nq7CrRVZEYP", {
    api_host: "https://us.i.posthog.com",
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
  })
}

export function PostHogProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    initializeAnalytics()
  }, [])
  return <PostHogProviderBase client={posthog}>{children}</PostHogProviderBase>
}

export { usePostHog }
