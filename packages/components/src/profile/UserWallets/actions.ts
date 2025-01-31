"use server"

import appConfig from "@cfce/app-config"
import { auth } from "@cfce/auth"
import {
  type Chain,
  // deleteUserWallet,
  getUserWalletByAddress,
  newUserWallet,
} from "@cfce/database"
import { revalidatePath } from "next/cache"
// export async function removeWallet(id: string) {
//   const session = await auth()
//   const userId = session?.user?.id

//   if (!userId) {
//     throw new Error("User not authenticated")
//   }

//   await deleteUserWallet(id)
//   revalidatePath(`/profile/${userId}`)
// }

export async function connectWallet(address: string, chain: string) {
  const session = await auth()
  // @ts-ignore: module augmentation issue
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("User not authenticated")
  }

  // Check if wallet already exists
  const existing = await getUserWalletByAddress(address, chain as Chain)
  if (existing) {
    throw new Error("Wallet already connected to another account")
  }

  // Create new wallet
  const wallet = await newUserWallet({
    network: appConfig.chainDefaults.network,
    chain: chain as Chain,
    address,
    users: {
      connect: { id: userId },
    },
  })

  revalidatePath(`/profile/${userId}`)

  return wallet
}
