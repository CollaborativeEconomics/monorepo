"use server"

import { signOut } from "../nextAuth"
//import { revalidatePath } from "next/cache"

export default async function signOutAction() {
  await signOut({ redirect: true, redirectTo: '/' })
  //revalidatePath('/')
}
