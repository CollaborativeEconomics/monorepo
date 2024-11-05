"use server"

import { signIn } from "../auth/nextAuth"
import authConfig from "../authConfig"

export async function githubLogin() {
  await signIn("github", authConfig.github)
}
