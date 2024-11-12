"use server"

import authConfig from "../authConfig"
import { signIn } from "../nextAuth"

export default async function googleLogin() {
  try {
    await signIn("google", authConfig.github)
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error")
  }
}
