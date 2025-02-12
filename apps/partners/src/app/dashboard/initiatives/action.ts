"use server"

import { type Prisma, newInitiative, updateInitiative } from "@cfce/database"
import { uploadFileToIPFS } from "@cfce/ipfs"
import { newTBAccount } from "@cfce/tbas"
import { EntityType } from "@cfce/types"
import { uploadFile } from "@cfce/utils"
import { snakeCase } from "lodash"
import { revalidatePath } from "next/cache"
import { randomNumber, randomString } from "~/utils/random"

type FormData = {
  title: string
  description: string
  start?: Date
  finish?: Date
  image: FileList
}

type EditData = {
  initiativeId: string;
  organizationId: string;
  title: string;
  description: string;
  start?: Date;
  finish?: Date;
  image: FileList;
  imageUri?: string;
  defaultAsset?: string;
};

//async function saveImageToIPFS(data: { name: string; file: File }) {
//  const body = new FormData()
//  body.append("name", data.name)
//  body.append("file", data.file)
//  //const url = process.env.NEXT_PUBLIC_API_URL
//  const resp = await fetch('/api/ipfs', {
//    method: "POST",
//    body,
//  })
//  return resp.json()
//}

export async function createInitiative(
  data: FormData,
  orgId: string,
  tba = false,
) {
  console.log("DATA", data)
  if (!data.title || !data.description || !data.image) {
    return { success: false, error: "Missing required fields" }
  }

  try {
    const file = data.image?.length > 0 ? data.image[0] : null // Only one image per initiative
    let imageUri = ""
    let defaultAsset = ""
    if (file) {
      const ext = file.type.split("/")[1]
      if (!["jpg", "jpeg", "png", "webp"].includes(ext)) {
        return { success: false, error: "Invalid image format" }
      }

      // Save image to Vercel
      const name = `${randomString()}.${ext}`
      const folder = "media"
      const resup = await uploadFile({ file, name, folder })
      if (!resup || resup?.error) {
        return { success: false, error: `Error saving image: ${resup.error}` }
      }
      defaultAsset = resup?.result?.url || ""

      // Save image to IPFS
      const cid = await uploadFileToIPFS(file)
      imageUri = cid ? `ipfs:${cid}` : ""
      //const resimg = await saveImageToIPFS({ name, file })
      //if (resimg.error) {
      //  return { success: false, error: `Error saving image: ${resimg.error}` }
      //}
    }

    const record = {
      title: data.title,
      slug: snakeCase(data.title),
      description: data.description,
      start: data.start,
      finish: data.finish,
      defaultAsset,
      imageUri,
      tag: Number.parseInt(randomNumber(8)),
      organization: {
        connect: {
          id: orgId,
        },
      },
    }

    const result = await newInitiative(record)
    console.log("RES", result)

    if (!result) {
      return { success: false, error: "Unknown error" }
    }

    const metadata = JSON.stringify({
      name: record.title,
      description: record.description,
      start: record.start,
      finish: record.finish,
      image: record.imageUri,
    })

    // Create TBA for initiative
    if (tba && result?.id) {
      const initId = result.id
      console.log("TBA will be created for initiative", initId)
      const account = await newTBAccount(
        EntityType.initiative,
        initId,
        EntityType.organization,
        orgId,
        metadata,
      ) // Parent org
      console.log("TBA created", account)
    }

    revalidatePath("/dashboard/initiatives")
    return { success: true, data: result }
  } catch (ex) {
    console.error(ex)
    return {
      success: false,
      error: ex instanceof Error ? ex.message : "Unknown error",
    }
  }
}

export async function editInitiative(data: EditData) {
  console.log("EDIT", data)

  try {
    const file = data.image?.length > 0 ? data.image[0] : null
    let imageUri = data.imageUri
    let defaultAsset = data.defaultAsset
    if (file) {
      console.log('Saving file...')
      const ext = file.type.split("/")[1]
      if (!["jpg", "jpeg", "png", "webp"].includes(ext)) {
        return { success: false, error: "Invalid image format" }
      }

      // Save image to Vercel
      const name = `${randomString()}.${ext}`
      const folder = "media"
      const resup = await uploadFile({ file, name, folder })
      if (!resup || resup?.error) {
        return { success: false, error: `Error saving image: ${resup.error}` }
      }
      defaultAsset = resup?.result?.url || defaultAsset

      // Save image to IPFS
      const cid = await uploadFileToIPFS(file)
      imageUri = cid ? `ipfs:${cid}` : imageUri
    }

    const record = {
      title: data.title,
      slug: snakeCase(data.title),
      description: data.description,
      start: data.start,
      finish: data.finish,
      defaultAsset,
      imageUri,
      //tag: Number.parseInt(randomNumber(8)),
      //organization: {
      //  connect: {
      //    id: data.organizationId,
      //  },
      //},
    }

    const result = await updateInitiative(data.initiativeId, record)
    console.log("RES", result)

    if (!result) {
      return { success: false, error: "Unknown error" }
    }

    return { success: true, data: result }
  } catch (ex) {
    console.error(ex)
    return {
      success: false,
      error: ex instanceof Error ? ex.message : "Unknown error",
    }
  }
}
