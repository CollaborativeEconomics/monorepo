"use server"

import { type Prisma, newInitiative } from "@cfce/database"
import { snakeCase } from "lodash"
import { randomNumber, randomString } from "~/utils/random"

async function saveImage(data: { name: string; file: File }) {
  const body = new FormData()
  body.append("name", data.name)
  body.append("file", data.file)
  const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ipfs`, {
    method: "POST",
    body,
  })
  return resp.json()
}

export async function createInitiative(
  data: Omit<
    Prisma.InitiativeCreateInput,
    "organization" | "tag" | "slug" | "defaultAsset"
  > & {
    image: File[]
  },
  orgId: string,
) {
  if (!data.title || !data.description || !data.image) {
    return { success: false, error: "Missing required fields" }
  }

  const file = data.image[0]
  const ext = file.type.split("/")[1]
  if (!["jpg", "jpeg", "png", "webp"].includes(ext)) {
    return { success: false, error: "Invalid image format" }
  }

  try {
    const image = {
      name: `${randomString()}.${ext}`,
      file: file,
    }

    const resimg = await saveImage(image)
    if (resimg.error) {
      return { success: false, error: `Error saving image: ${resimg.error}` }
    }

    const record = {
      title: data.title,
      slug: snakeCase(data.title),
      description: data.description,
      start: data.start ?? undefined,
      finish: data.finish ?? undefined,
      defaultAsset: resimg.uri || "",
      organization: {
        connect: {
          id: orgId,
        },
      },
      tag: Number.parseInt(randomNumber(8)),
    }

    const result = await newInitiative(record)

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
