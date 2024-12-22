import "server-only"
import {
  type Prisma,
  type Story,
  getInitiativeById,
  getOrganizationById,
  newStory,
  prismaClient,
  updateStory,
} from "@cfce/database"
import { uploadDataToIPFS, uploadFileToIPFS } from "@cfce/ipfs"
import { put } from "@vercel/blob"
import { mintStoryNFT } from "./mintStoryNFT"

async function processFile(
  file: string | File,
  prefix: string,
): Promise<string> {
  if (typeof file === "string") {
    const response = await fetch(file)
    const mimeType =
      response.headers.get("content-type") || "application/octet-stream"
    const buffer = await response.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    const cid = await uploadDataToIPFS(file, bytes, mimeType)
    await put(`${prefix}/${cid}`, buffer, {
      access: "public",
      contentType: mimeType,
    })
    return cid
  }
  return await uploadFileToIPFS(file)
}

interface CreateStoryParams {
  story: Omit<Prisma.StoryCreateInput, "organization" | "initiative">
  categoryId?: string
  organizationId: string
  initiativeId: string
  images?: (string | File)[]
  media?: string | File
}

export default async function createStory({
  story,
  organizationId,
  initiativeId,
  categoryId,
  images,
  media,
}: CreateStoryParams): Promise<Story> {
  const imageCIDs: string[] = []
  let mediaCID = ""
  let storyId = ""

  try {
    // Process images
    if (images && Array.isArray(images)) {
      for (const image of images) {
        const cid = await processFile(image, "stories")
        imageCIDs.push(cid)
        console.log("Uploaded image to IPFS, CID", cid)
      }
    }

    // Process media
    if (media) {
      mediaCID = await processFile(media, "stories")
      console.log("Uploaded media to IPFS, CID", mediaCID)
    }

    // Get the related organization and initiative
    const [organization, initiative] = await Promise.all([
      getOrganizationById(organizationId),
      getInitiativeById(initiativeId),
    ])

    // Create the story DB entry with the data
    const dbStory = await newStory({
      ...story,
      amount: story.amount ?? 0,
      image: imageCIDs.length > 0 ? `ipfs:${imageCIDs[0]}` : null,
      ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
      organization: { connect: { id: organizationId } },
      initiative: { connect: { id: initiativeId } },
      media: {
        create: [
          ...imageCIDs.map((cid, index) => ({
            media: `ipfs:${cid}`,
            type: "IMAGE",
            order: index,
          })),
          ...(mediaCID
            ? [
                {
                  media: `ipfs:${mediaCID}`,
                  type: "MEDIA",
                  order: imageCIDs.length,
                },
              ]
            : []),
        ],
      },
    })
    storyId = dbStory.id
    console.log("Created story in DB", dbStory.id, dbStory.name)

    // Create and upload the NFT metadata
    const nftMetadata = {
      mintedBy: "CFCE via Give",
      title: "Impact NFT",
      created: new Date().toISOString(),
      organization: organization?.name,
      initiative: initiative?.title,
      event: story.name,
      description: story.description,
      image: imageCIDs.map((cid) => `ipfs:${cid}`),
      media: mediaCID ? `ipfs:${mediaCID}` : undefined,
    }
    const nftMetadataBytes = Buffer.from(JSON.stringify(nftMetadata, null, 2))
    const tokenCID = await uploadDataToIPFS(
      storyId,
      nftMetadataBytes,
      "text/plain",
    )

    // Mint the NFT
    const { tokenId } = await mintStoryNFT(storyId, tokenCID)
    console.log("Minted NFT", tokenCID, nftMetadata)

    // Update the story with token information
    return await updateStory(dbStory.id, {
      tokenId,
      metadata: `ipfs:${tokenCID}`,
    })
  } catch (error) {
    // If it failed, delete the DB entry and throw the error
    if (storyId) await prismaClient.story.delete({ where: { id: storyId } })
    throw error
  }
}
