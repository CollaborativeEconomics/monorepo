import {
  type Story,
  getInitiativeById,
  getOrganizationById,
  newStory,
  prismaClient,
  updateStory,
} from "@cfce/database"
import { put } from "@vercel/blob"
import type { File } from "formidable"
import uploadDataToIPFS from "./ipfs/uploadDataToIPFS"
import uploadFileToIPFS from "./ipfs/uploadFileToIPFS"
import mintStoryNFT from "./mintStoryNFT"

export default async function createStory(
  {
    organizationId,
    initiativeId,
    amount,
    ...story
  }: Omit<Story, "tokenId" | "created">,
  image?: File,
): Promise<Story> {
  let imageCID = ""
  let tokenCID = ""
  let storyId = ""
  try {
    // If there's an image url, upload it to IPFS and get the Content ID
    if (story.image && typeof story.image === "string") {
      const response = await fetch(story.image)
      const mimeType = response.headers.get("content-type")

      // Check if the MIME type is an image
      if (!mimeType || !mimeType.startsWith("image/")) {
        throw new Error("The image URL does not point to an image.")
      }

      const imageBuffer = await response.arrayBuffer()
      const bytes = new Uint8Array(imageBuffer)
      imageCID = await uploadDataToIPFS(story.image, bytes, mimeType)

      // also upload to Vercel Blob
      await put(`stories/${imageCID}`, imageBuffer, {
        access: "public",
        contentType: mimeType,
      })
      console.log("Uploaded image to IPFS, CID", imageCID)
    }
    // If there's an image file, upload it to IPFS and get the Content ID
    else if (image) {
      imageCID = await uploadFileToIPFS(image)
      console.log("Uploaded image to IPFS, CID", imageCID)
    }

    // Get the related organization and initiative
    const organization = await getOrganizationById(organizationId)
    const initiative = await getInitiativeById(initiativeId)

    // Create the story DB entry with the data
    let dbStory = await newStory({
      ...story,
      amount: amount ?? 0,
      image: `ipfs:${imageCID}`,
      organizationId,
      initiativeId,
    })
    storyId = dbStory.id
    console.log("Created story in DB", dbStory.id, dbStory.name)

    // Create the NFT metadata object
    const created = new Date().toISOString()
    const nftMetadata = {
      mintedBy: "CFCE via Give",
      title: "Impact NFT",
      created: created,
      organization: organization?.name,
      initiative: initiative?.title,
      event: story.name,
      description: story.description,
      image: `ipfs:${imageCID}`,
    }

    // Upload the NFT metadata to IPFS and get the Content ID
    const nftMetadataBytes = Buffer.from(JSON.stringify(nftMetadata, null, 2))
    tokenCID = await uploadDataToIPFS(storyId, nftMetadataBytes, "text/plain")

    // Mint the NFT
    const { tokenId } = await mintStoryNFT(storyId, tokenCID)
    console.log("Minted NFT", tokenCID, nftMetadata)

    dbStory = await updateStory(dbStory.id, {
      tokenId,
      metadata: `ipfs:${tokenCID}`,
    })
    return dbStory
  } catch (error) {
    // If it failed, delete the DB entry and throw the error
    prismaClient.story.delete({ where: { id: storyId } })
    throw error
  }
}
