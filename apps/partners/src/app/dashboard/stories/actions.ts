// /app/dashboard/storyActions.ts
"use server"

import type { Prisma } from "@cfce/database" // assuming Story is your Prisma model or similar
import { createStory } from "@cfce/utils"
import type { File } from "formidable"
import { revalidatePath } from "next/cache"

export async function saveStory({
  userId,
  story,
  organizationId,
  initiativeId,
  images,
  media,
}: {
  userId: string
  story: Omit<Prisma.StoryCreateInput, "organization" | "initiative">
  organizationId: string
  initiativeId: string
  images?: (string | File)[]
  media?: string | File
}) {
  const response = await createStory({
    userId,
    story,
    organizationId,
    initiativeId,
    images,
    media,
  })
  revalidatePath("/dashboard/stories")
  return response
}
