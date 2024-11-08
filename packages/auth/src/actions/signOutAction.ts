"use server"

import { signOut } from "next-auth/react"

export async function signOutAction() {
  await signOut()
}
