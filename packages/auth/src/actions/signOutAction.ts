"use server"

import { revalidatePath } from "next/cache"
import { signOut } from "../nextAuth"

export default async function signOutAction() {
  // NOTE: don't wrap this in a try/catch, it will log the error instead of redirecting
  // yep, for some reason a redirect is actually an intentional error
  await signOut({ redirectTo: "/" })
  revalidatePath("/")
}
