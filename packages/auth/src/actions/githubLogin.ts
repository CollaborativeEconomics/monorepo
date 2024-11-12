"use server"

import authConfig from "../authConfig"
import { signIn } from "../nextAuth"

export default async function githubLogin() {
  await signIn("github", authConfig.github)
}
