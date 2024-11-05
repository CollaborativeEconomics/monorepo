"use server"

import authConfig from "../authConfig"
import { signIn } from "../nextAuth"

export default async function googleLogin() {
  await signIn("google", authConfig.github)
}
