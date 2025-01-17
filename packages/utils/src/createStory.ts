import "server-only"
import { posthogNodeClient } from "@cfce/analytics/server"
import {
  type Prisma,
  type Story,
  type StoryMedia,
  getInitiativeById,
  getOrganizationById,
  newStory,
  prismaClient,
  updateStory,
  addStoryMedia,
  updateImpactLink,
  updateStoryLink,
} from "@cfce/database"
import { uploadDataToIPFS, uploadFileToIPFS } from "@cfce/ipfs"
import { put } from "@vercel/blob"
import { mintStoryNFT } from "./mintStoryNFT"
import { EntityType } from "@cfce/types"
import { newTBAccount } from "@cfce/tbas"
import appConfig from "@cfce/app-config"

async function processFile(
  file: string | File,
  prefix: string,
): Promise<string> {
  let cid = ''
  if (typeof file === "string") {
    const response = await fetch(file)
    const mimeType = response.headers.get("content-type") || "application/octet-stream"
    const buffer = await response.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    cid = await uploadDataToIPFS(file, bytes, mimeType)
    await put(`${prefix}/${cid}`, buffer, {
      access: "public",
      contentType: mimeType,
    })
    console.log('TEXT CID', cid)
    return cid
  }
  cid = await uploadFileToIPFS(file)
  console.log('FILE CID', cid)
  return cid
}

interface CreateStoryParams {
  //story: Omit<Prisma.StoryCreateInput, "organization" | "initiative">
  story: {
    name:string
    description:string
    amount:string
    unitlabel:string
    unitvalue:string
  }
  userId: string
  organizationId: string
  initiativeId: string
  categoryId?: string
  images?: File[]
  media?: File
  //images?: (string | File)[]
  //media?: string | File
}

interface MediaRecord {
  media: string
  mime: string
}

export default async function createStory({
  userId,
  story,
  organizationId,
  initiativeId,
  categoryId,
  images,
  media,
}: CreateStoryParams, tba=false): Promise<Story> {
  let storyId = ''
  const gateway = appConfig.apis.ipfs.gateway

  try {
    //const allMedia: Omit<StoryMedia, "id" | "storyId" | "created">[] = []
    const allMedia: MediaRecord[] = []
    let image = '' // main image
    const imageCIDs = []
    let mediaCID = ''
    // Process images
    if (images && Array.isArray(images)) {
      let mime = ''
      let cid = ''
      for (const image of images) {
        mime = image?.type || ''
        cid = await processFile(image, 'stories')
        imageCIDs.push(`ipfs:${cid}`)
        allMedia.push({media:`${gateway}${cid}`, mime}) // media record
        console.log("Uploaded image to IPFS, CID", cid)
      }
      // Main image goes in story record, rest goes to storyMedia table
      image = allMedia.length > 0 ? allMedia[0].media : ''
      allMedia.shift() // remove first image from stack
    }

    // Process media
    if (media) {
      const mime = media?.type || 'application/octet-stream' // any file
      const cid = await processFile(media, "stories")
      mediaCID = `ipfs:${cid}`
      console.log("Uploaded media to IPFS, CID", cid)
      allMedia.push({media:`${gateway}${cid}`, mime})
    }
    console.log('ALL MEDIA', allMedia)

    // Get the related organization and initiative
    const [organization, initiative] = await Promise.all([
      getOrganizationById(organizationId),
      getInitiativeById(initiativeId),
    ])

    // Create the story DB entry with the data
    const storyData = {
      name: story.name,
      description: story.description,
      amount: Number(story.amount),
      organization: { connect: { id: organizationId } },
      initiative: { connect: { id: initiativeId } },
      category: categoryId ? { connect: { id: categoryId } } : undefined,
      unitvalue: Number(story.unitvalue),
      unitlabel: story.unitlabel,
      image,
    }
    console.log('STORY', storyData)
    const dbStory = await newStory(storyData)
/*
    const dbStory = await newStory({
      ...story,
      amount: story.amount ?? 0,
      image: imageCIDs.length > 0 ? `ipfs:${imageCIDs[0]}` : null,
      ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
      organization: { connect: { id: organizationId } },
      initiative: { connect: { id: initiativeId } },
      ...{ category: categoryId ? { connect: { id: categoryId } } : {} },
      media: {
        create: [
          ...imageCIDs.map((cid, index) => ({
            media: `ipfs:${cid}`,
            mime: "IMAGE",
            order: index,
          })),
          ...(mediaCID
            ? [
                {
                  media: `ipfs:${mediaCID}`,
                  mime: "MEDIA",
                  order: imageCIDs.length,
                },
              ]
            : []),
        ],
      },
    })
*/
    storyId = dbStory.id
    console.log("Created story in DB", dbStory.id, dbStory.name)
    if(allMedia.length > 0){
      const dbMedia = await addStoryMedia(storyId, allMedia)
      console.log("Media added", dbMedia)
    }

    // IMPACT LINK
    if(storyId && storyData.amount > 0){
      const link = {
        initiativeId,
        storyId,
        amount: storyData.amount
      }
      const impact = await updateImpactLink(link)
      console.log('IMPACT', impact?.rowCount)
      const linked = await updateStoryLink(link)
      console.log('LINKED', linked?.rowCount)
    }

    // Create and upload the NFT metadata
    const nftMetadata = {
      mintedBy: "CFCE via Give",
      title: "Impact NFT",
      created: new Date().toISOString(),
      organization: organization?.name,
      initiative: initiative?.title,
      event: story.name,
      description: story.description,
      amount: story.amount,
      unitValue: story.unitvalue,
      unitLabel: story.unitlabel,
      image: imageCIDs,
      media: mediaCID,
    }
    const nftMetadataBytes = Buffer.from(JSON.stringify(nftMetadata, null, 2))
    const tokenCID = await uploadDataToIPFS(
      storyId,
      nftMetadataBytes,
      "text/plain",
    )

    // Create TBA for story
    if(tba){
      console.log('TBA will be created for story', storyId)
      const metadata = JSON.stringify(nftMetadata)
      const account = await newTBAccount(EntityType.story, storyId, EntityType.initiative, initiativeId, metadata) // Parent initiative
      console.log('TBA created', account)
    }

    // Mint the NFT
    const { tokenId } = await mintStoryNFT(storyId, tokenCID, initiativeId)
    console.log("Minted NFT", tokenCID, nftMetadata)

    posthogNodeClient.capture({
      distinctId: userId,
      event: "story_minted",
      properties: {
        storyId: storyId,
        tokenCID: tokenCID,
      },
    })
    posthogNodeClient.shutdown()

    // Update the story with token information
    const result = await updateStory(dbStory.id, {
      tokenId,
      metadata: `ipfs:${tokenCID}`,
    })
    return result
  } catch (error) {
    // If it failed, delete the DB entry and throw the error
    if (storyId) await prismaClient.story.delete({ where: { id: storyId } })
    throw error
  }
}
