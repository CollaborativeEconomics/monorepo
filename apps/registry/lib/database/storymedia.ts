import prismaClient from "prisma/client"
import { StoryMedia } from "prisma/models"

export async function getStoryMedia(query): Promise<StoryMedia | Array<StoryMedia>> {
  let where = {}
  let skip = 0
  let take = 100
  //let orderBy = { created: 'desc' }
  //let include = {}

  if (query?.id) {
    where = { storyId: query.id }
  }

  let filter = { where, skip, take }
  if (query?.page || query?.size) {
    let page = parseInt(query?.page || 0)
    let size = parseInt(query?.size || 100)
    if (page < 0) { page = 0 }
    if (size < 0) { size = 100 }
    if (size > 200) { size = 200 }
    let start = page * size
    filter.skip = start
    filter.take = size
    //filter.orderBy = { name: 'asc' }
  }
  const  result = await prismaClient.StoryMedia.findMany(filter)
  return result
}

export async function addStoryMedia(id, recs): Promise<StoryMedia> {
  console.log('SPIX', id, recs)
  if(recs?.media?.length<1){ return null }
  const data = recs?.media?.map((it)=>{ return {storyId:id, media:it.media, mime:it.mime} })
  const result = await prismaClient.StoryMedia.createMany({ data })
  return result
}

