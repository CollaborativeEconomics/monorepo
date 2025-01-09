"use server"

import { revalidatePath } from "next/cache"
import { signOut } from "../nextAuth"

export default async function signOutAction() {
  await signOut()
  revalidatePath("/")
}
