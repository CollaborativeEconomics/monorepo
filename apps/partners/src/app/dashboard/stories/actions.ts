// /app/dashboard/storyActions.ts
"use server"

import type { Prisma } from "@cfce/database" // assuming Story is your Prisma model or similar
import { createStory } from "@cfce/utils"
import { revalidatePath } from "next/cache"

interface StoryData {
  userId: string
  //story: Omit<
  //  Prisma.StoryCreateInput,
  //  "organization" | "initiative" | "category"
  //>
  story: {
    name: string
    description: string
    amount: string
    unitvalue: string
    unitlabel: string
  }
  categoryId?: string
  organizationId: string
  initiativeId: string
  images?: File[]
  media?: File
}

export async function saveStory(
  {
    userId,
    story,
    categoryId,
    organizationId,
    initiativeId,
    images,
    media,
  }: StoryData,
  tba = false,
) {
  try {
    const response = await createStory(
      {
        userId,
        story,
        organizationId,
        initiativeId,
        categoryId,
        images,
        media,
      },
      tba,
    )
    revalidatePath("/dashboard/stories")
    return response
  } catch(error) {
    console.error(error)
    return {success:false, error:(error as Error)?.message||'Unknown'}
  }
}
