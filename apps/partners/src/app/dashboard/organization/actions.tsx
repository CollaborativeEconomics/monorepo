'use server';
import { type Prisma, newOrganization, updateOrganization } from '@cfce/database';
import { revalidatePath } from 'next/cache';
import { EntityType } from "@cfce/types"
import { newTBAccount } from "@cfce/tbas"
import { snakeCase } from "lodash"
import { randomNumber, randomString } from "~/utils/random"
import { uploadFile } from "@cfce/utils"
import type { OrganizationData } from '~/types/data'

async function fileUpload(file: File){
  try {
    console.log('Saving file...')
    const ext = file.type.split("/")[1]
    if (!["jpg", "jpeg", "png", "webp"].includes(ext)) {
      console.log("Invalid image format")
      return ''
    }
    const name = `${randomString()}.${ext}`
    const folder = "media"
    const resup = await uploadFile({ file, name, folder })
    if (!resup || resup?.error) {
      console.log(`Error saving file: ${resup?.error||'Unknown'}`)
      return ''
    }
    const url = resup?.result?.url || ''
    return url
  } catch (ex) {
    console.error(ex)
    return ''
  }
}

  //organization: Prisma.OrganizationCreateInput,
export async function createOrganizationAction(
  data: OrganizationData,
  tba = false
) {
  try {
    let image = ''
    let background = ''
    if(data.image && data.image?.size > 0){
      image = await fileUpload(data.image)
    }
    if(data.background && data.background?.size > 0){
      background = await fileUpload(data.background)
    }

    const record = {
      name: data.name,
      slug: snakeCase(data.name),
      description: data.description,
      email: data.email,
      EIN: data.EIN || '',
      phone: data.phone || '',
      mailingAddress: data.mailingAddress || '',
      country: data.country || '',
      url: data.url || '',
      twitter: data.twitter || '',
      facebook: data.facebook || '',
      category: { connect: { id: data.categoryId } },
      image,
      background
    }

    console.log("REC", record)
    const result = await newOrganization(record);
    console.log("RES", result)

    // Create TBA for organization
    if(tba && result?.id){
      console.log('TBA will be created for organization ', result.id)
      const metadata = JSON.stringify({
        name: data.name,
        description: data.description
      })
      const account = await newTBAccount(EntityType.organization, result.id, '', '', metadata) // No parent TBA
      console.log('TBA created', account)
    }

    // You can trigger revalidation if necessary
    revalidatePath('/dashboard/organization');

    if (result) {
      return { success: true, message: 'Organization saved successfully' };
    }
    return { success: false, error: 'Failed to save organization' };
  } catch (ex) {
    console.error(ex)
    return { success: false, error: ex instanceof Error ? ex.message : "Unknown error" }
  }
}

export async function updateOrganizationAction(id: string, data: OrganizationData){
  try {
    let image = ''
    let background = ''
    if(data.image && data.image?.size > 0){
      image = await fileUpload(data.image)
    }
    if(data.background && data.background?.size > 0){
      background = await fileUpload(data.background)
    }

    const record = {
      name: data.name,
      slug: snakeCase(data.name),
      description: data.description,
      email: data.email,
      EIN: data.EIN || '',
      phone: data.phone || '',
      mailingAddress: data.mailingAddress || '',
      country: data.country || '',
      url: data.url || '',
      twitter: data.twitter || '',
      facebook: data.facebook || '',
      category: { connect: { id: data.categoryId } },
      image,
      background
    }

    console.log("REC", record)
    const result = await updateOrganization(id, record)
    console.log("RES", result)

    if (!result) {
      return { success: false, error: "Unknown error" }
    }
    return { success: true, data: result }
  } catch (ex) {
    console.error(ex)
    return { success: false, error: ex instanceof Error ? ex.message : "Unknown error" }
  }
}
