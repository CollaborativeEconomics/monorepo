"use server"

import authConfig from "../authConfig"
import { signIn } from "../nextAuth"

export default async function githubLogin() {
  try {
    await signIn("github", authConfig.github)
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error")
  }
}
