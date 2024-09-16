// /app/actions/createOrganizationAction.ts
"use server"

import { type Prisma, newOrganization } from "@cfce/database"
import { revalidatePath } from "next/cache"

export async function createOrganizationAction(
  organization: Prisma.OrganizationCreateInput,
) {
  // Perform your database logic to save the organization here
  const savedOrganization = await newOrganization(organization)

  // You can trigger revalidation if necessary
  revalidatePath("/dashboard/organization")

  if (savedOrganization) {
    return { success: true, message: "Organization saved successfully" }
  }
  return { success: false, error: "Failed to save organization" }
}
