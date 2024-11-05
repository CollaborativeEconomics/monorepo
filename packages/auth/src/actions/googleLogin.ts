"use server"

import { signIn } from "../auth/nextAuth"
import authConfig from "../authConfig"

export async function googleLogin() {
  await signIn("google", authConfig.github)
}
