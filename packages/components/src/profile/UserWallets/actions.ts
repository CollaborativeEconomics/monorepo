"use server"

import { auth } from "@cfce/auth"
import {
  type Chain,
  deleteUserWallet,
  getUserWalletByAddress,
  newUserWallet,
} from "@cfce/database"

export async function removeWallet(id: string) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("User not authenticated")
  }

  await deleteUserWallet(id)
}

export async function connectWallet(chain: string, address: string) {
  const session = await auth()
  // @ts-ignore: module augmentation issue
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("User not authenticated")
  }

  // Check if wallet already exists
  const existing = await getUserWalletByAddress(address, chain as Chain)
  if (existing) {
    throw new Error("Wallet already connected")
  }

  // Create new wallet
  const wallet = await newUserWallet({
    chain: chain as Chain,
    address,
    users: {
      connect: { id: userId },
    },
  })

  return wallet
}
