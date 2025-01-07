"use server"

import { type Prisma, newInitiative } from "@cfce/database"
import { snakeCase } from "lodash"
import { randomNumber, randomString } from "~/utils/random"
import { uploadFile } from "@cfce/utils"
import { uploadFileToIPFS } from "@cfce/ipfs"

type FormData = {
  title: string;
  description: string;
  start?: string;
  finish?: string;
  image: FileList;
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

export async function createInitiative(data: FormData, orgId: string) {
  console.log('DATA', data)
  if (!data.title || !data.description || !data.image) {
    return { success: false, error: "Missing required fields" }
  }

  try {
    const file = data.image?.length>0 ? data.image[0] : null; // Only one image per initiative
    let imageUri = ''
    let defaultAsset = ''
    if(file){
      const ext = file.type.split("/")[1]
      if (!["jpg", "jpeg", "png", "webp"].includes(ext)) {
        return { success: false, error: "Invalid image format" }
      }

      // Save image to Vercel
      const name = `${randomString()}.${ext}`
      const folder = 'media'
      const resup = await uploadFile({file, name, folder})
      if (!resup || resup?.error) {
        return { success: false, error: `Error saving image: ${resup.error}` }
      }
      defaultAsset = resup?.result?.url || ''
      
      // Save image to IPFS
      const cid = await uploadFileToIPFS(file)
      imageUri = cid ? `ipfs:${cid}` : ''
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
    console.log('RES', result)

    if (!result) {
      return { success: false, error: "Unknown error" }
    }

    // TODO: create TBA 6551 for initiative
    // 1. mint 1155 NFT using REGISTRY_NFT_COPY env var
    // get tokenId
    // chainId = 51 // xdc testnet
    // 2. create TBA for that NFT
    // const tab = await createAccount(REGISTRY_NFT_COPY, tokenId, chainId, waitForReceipt=false)


    return { success: true, data: result }
  } catch (ex) {
    console.error(ex)
    return {
      success: false,
      error: ex instanceof Error ? ex.message : "Unknown error",
    }
  }
}
