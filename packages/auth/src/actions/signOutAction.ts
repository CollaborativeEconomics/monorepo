"use server"

import { signOut } from "../nextAuth"

export default async function signOutAction() {
  try {
    await signOut()
  } catch (error) {
    throw new Error(
      `Failed to sign out: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
}
