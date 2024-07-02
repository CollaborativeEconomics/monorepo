import { Prisma, Story } from "@prisma/client"
import { put } from "@vercel/blob"
import { File } from "formidable"
import { prismaClient } from "index"
import uploadDataToIPFS from "ipfs/uploadDataToIPFS"
import uploadFileToIPFS from "ipfs/uploadFileToIPFS"
import { ListQuery } from "types"

interface StoryQuery extends ListQuery {
  orgId?: string
  initId?: string
  recent?: string
}

export async function getStories(query: StoryQuery): Promise<Story | Array<Story>> {
  let where = {}
  let include = {
    media: true,
    organization: true,
    initiative: {
      include: {
        category: true
      }
    }
  }
  let skip = 0
  let take = 100
  let orderBy = { created: 'desc' } as Prisma.StoryOrderByWithRelationInput

  if (query?.recent) {
    const qty = parseInt(query.recent) || 10
    const result = await prismaClient.story.findMany({ include, take: qty, orderBy: { created: 'desc' } })
    return result
  }

  if (query?.orgId) {
    where = { organizationId: query.orgId }
  } else if (query?.initId) {
    where = { initiativeId: query.initId }
  }

  let filter = { where, include, skip, take, orderBy }
  if (query?.page || query?.size) {
    let page = parseInt(query?.page || '0')
    let size = parseInt(query?.size || '100')
    if (page < 0) { page = 0 }
    if (size < 0) { size = 100 }
    if (size > 200) { size = 200 }
    let start = page * size
    filter.skip = start
    filter.take = size
    //filter.orderBy = { name: 'asc' }
  }
  const result = await prismaClient.story.findMany(filter)
  return result
}

export async function getStoryById(id: string): Promise<Story | null> {
  const include = {
    media: true,
    organization: true,
    initiative: {
      include: {
        category: true
      }
    }
  }
  const result = await prismaClient.story.findUnique({ where: { id }, include })
  return result
}

export async function addStory(data: Story): Promise<Story> {
  console.log('DATA', data)
  const result = await prismaClient.story.create({ data })
  return result
}

export async function newStory({ organizationId, initiativeId, amount, ...story }: Omit<Story, 'tokenId' | 'created' | 'categoryId'>, image?: File): Promise<Story> {
  let imageCID = '';
  let tokenCID = '';
  let storyId = '';
  try {
    // If there's an image url, upload it to IPFS and get the Content ID
    if (story.image && typeof story.image === 'string') {
      const response = await fetch(story.image);
      const mimeType = response.headers.get('content-type');

      // Check if the MIME type is an image
      if (!mimeType || !mimeType.startsWith('image/')) {
        throw new Error('The image URL does not point to an image.');
      }

      const imageBuffer = await response.arrayBuffer();
      const bytes = new Uint8Array(imageBuffer);
      imageCID = await uploadDataToIPFS(story.image, bytes, mimeType);

      // also upload to Vercel Blob
      await put(`stories/${imageCID}`, imageBuffer, { access: 'public', contentType: mimeType });
      console.log('Uploaded image to IPFS, CID', imageCID);
    }
    // If there's an image file, upload it to IPFS and get the Content ID
    else if (image) {
      imageCID = await uploadFileToIPFS(image)
      console.log('Uploaded image to IPFS, CID', imageCID);
    }

    // Get the related organization and initiative
    const organization = await prismaClient.organization.findUnique({ where: { id: organizationId } })
    const initiative = await prismaClient.initiative.findUnique({ where: { id: initiativeId } })

    // Create the story DB entry with the data
    let dbStory = await prismaClient.story.create({
      data: {
        ...story,
        amount: amount ?? 0,
        image: `ipfs:${imageCID}`,
        organization: {
          connect: { id: organizationId },
        },
        initiative: {
          connect: { id: initiativeId },
        }
      },
    })
    storyId = dbStory.id;
    console.log('Created story in DB', dbStory.id, dbStory.name)

    // Create the NFT metadata object
    const created = new Date().toISOString();
    const nftMetadata = {
      mintedBy: 'CFCE via Give',
      title: 'Impact NFT',
      created: created,
      organization: organization?.name,
      initiative: initiative?.title,
      event: story.name,
      description: story.description,
      image: `ipfs:${imageCID}`,
    }

    // Upload the NFT metadata to IPFS and get the Content ID
    const nftMetadataBytes = Buffer.from(JSON.stringify(nftMetadata, null, 2))
    tokenCID = await uploadDataToIPFS(storyId, nftMetadataBytes, 'text/plain')

    // Mint the NFT
    const { tokenId } = await mintStoryNFT(storyId, tokenCID)
    console.log('Minted NFT', tokenCID, nftMetadata)

    dbStory = await prismaClient.story.update({
      where: { id: dbStory.id },
      data: {
        tokenId,
        metadata: `ipfs:${tokenCID}`,
      }
    })
    return dbStory
  } catch (error) {
    // If it failed, delete the DB entry and throw the error
    prismaClient.story.delete({ where: { id: storyId } })
    throw error;
  }
}

export async function updateStory(id: string, data): Promise<Story> {
  let result = await prismaClient.story.update({ where: { id }, data })
  console.log('UPDATE', result)
  return result
}
