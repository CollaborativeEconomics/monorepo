"use server"

import { prismaClient } from "@cfce/database"
import { authOptions } from "@cfce/utils"
import { getServerSession } from "next-auth/next"
import { revalidatePath } from "next/cache"

export async function generateApiKey() {
  const session = await getServerSession(authOptions)
  const userEmail = session?.user?.email

  if (!userEmail) {
    throw new Error("User not authenticated")
  }

  const newApiKey = Math.random().toString(36).substring(2, 15)

  const updatedUser = await prismaClient.user.update({
    where: { email: userEmail },
    data: { api_key: newApiKey },
  })

  revalidatePath("/ApiKeyManager")
  return updatedUser.api_key
}
