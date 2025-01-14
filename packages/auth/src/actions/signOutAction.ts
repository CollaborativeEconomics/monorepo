"use server"

import { revalidatePath } from "next/cache"
import { signOut } from "../nextAuth"

export default async function signOutAction() {
  try {
    await signOut()
    revalidatePath("/")
  } catch (error) {
    console.error("Error signing out:", error)
  }
}
