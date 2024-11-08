// /app/actions/createOrganizationAction.ts
'use server';

import { type Prisma, newOrganization } from '@cfce/database';
import { revalidatePath } from 'next/cache';
import { EntityType } from "@cfce/types"
import { newAccount } from "@cfce/tbas"

export async function createOrganizationAction(
  organization: Prisma.OrganizationCreateInput,
  tba = false
) {
  // Perform your database logic to save the organization here
  const savedOrganization = await newOrganization(organization);

  // Create TBA for organization
  if(tba && savedOrganization?.id){
    console.log('TBA will be created for organization ', savedOrganization.id)
    const account = await newAccount(EntityType.organization, savedOrganization.id)
    console.log('TBA created', account)
  }

  // You can trigger revalidation if necessary
  revalidatePath('/dashboard/organization');

  if (savedOrganization) {
    return { success: true, message: 'Organization saved successfully' };
  }
  return { success: false, error: 'Failed to save organization' };
}
