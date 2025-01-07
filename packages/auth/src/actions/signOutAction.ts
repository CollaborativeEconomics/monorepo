"use server"

import { signOut } from "../nextAuth"

export default async function signOutAction() {
  await signOut()
}
