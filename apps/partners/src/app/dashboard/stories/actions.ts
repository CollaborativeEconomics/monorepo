// /app/dashboard/storyActions.ts
"use server"

import type { Prisma } from "@cfce/database" // assuming Story is your Prisma model or similar
import { createStory } from "@cfce/utils"
import { revalidatePath } from "next/cache"

export async function saveStory({
  story,
  categoryId,
  organizationId,
  initiativeId,
  images,
  media,
}: {
  story: Omit<
    Prisma.StoryCreateInput,
    "organization" | "initiative" | "category"
  >
  categoryId?: string
  organizationId: string
  initiativeId: string
  images?: (string | File)[]
  media?: string | File
}) {
  const response = await createStory({
    story,
    organizationId,
    initiativeId,
    categoryId,
    images,
    media,
  })
  revalidatePath("/dashboard/stories")
  return response
}
