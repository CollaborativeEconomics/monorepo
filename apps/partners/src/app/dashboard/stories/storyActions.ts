// /app/dashboard/storyActions.ts
"use server"

import type { Prisma } from "@cfce/database" // assuming Story is your Prisma model or similar
import { createStory } from "@cfce/utils"
import type { File } from "formidable"
import { revalidatePath } from "next/cache"

export async function saveStory({
  story,
  organizationId,
  initiativeId,
  images,
  media,
}: {
  story: Prisma.StoryCreateInput
  organizationId: string
  initiativeId: string
  images?: (string | File)[]
  media?: string | File
}) {
  const response = await createStory({
    story,
    organizationId,
    initiativeId,
    images,
    media,
  })
  revalidatePath("/dashboard/stories")
  return response
}
