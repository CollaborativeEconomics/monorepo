// /app/actions/createOrganizationAction.ts
"use server"

import { type Prisma, newOrganization } from "@cfce/database"
import { revalidatePath } from "next/cache"

export async function saveOrganization(formData: FormData) {
  const data: Prisma.OrganizationCreateInput = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    slug: formData.get("slug") as string,
    EIN: formData.get("EIN") as string,
    country: formData.get("country") as string,
    description: formData.get("description") as string,
    image: formData.get("image") as string,
    background: formData.get("background") as string,
    phone: formData.get("phone") as string,
    mailingAddress: formData.get("mailingAddress") as string,
    url: formData.get("url") as string,
    twitter: formData.get("twitter") as string,
    facebook: formData.get("facebook") as string,
    category: {
      connect: {
        id: formData.get("categoryId") as string,
      },
    },
  }

  // Perform your database logic to save the organization here
  const savedOrganization = await newOrganization(data)

  // You can trigger revalidation if necessary
  revalidatePath("/organizations")

  if (savedOrganization) {
    return { success: true }
  }
  return { success: false, error: "Failed to save organization" }
}
