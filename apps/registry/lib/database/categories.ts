import prismaClient from "prisma/client"
import { Category } from "prisma/models"

export async function getCategories(query): Promise<Array<Category>> {
  if(query?.distinct=='organizations'){
    const data = await prismaClient.Organization.findMany({
      distinct: ['categoryId'],
      select: {
        category: {
          select: {
            slug:true,
            title:true
          }
        }
      },  
      orderBy: { category: { title: 'asc'} }
    })
    const list = data.flatMap(it=>{ 
      if(!it?.category){
        return []
      }
      return {value:it?.category?.slug, label:it?.category?.title}
    })
    return list
  }

  if(query?.distinct=='initiatives'){
    const data = await prismaClient.Initiative.findMany({
      distinct: ['categoryId'],
      select: {
        category: {
          select: {
            slug:true,
            title:true
          }
        }
      },  
      orderBy: { category: { title: 'asc'} }
    })
    const list = data.flatMap(it=>{ 
      if(!it?.category){
        return []
      }
      return {value:it?.category?.slug, label:it?.category?.title}
    })
    return list
  }

  let filter = { skip: 0, take: 100 }
  if (query?.page || query?.size) {
    let page = parseInt(query?.page || 0)
    let size = parseInt(query?.size || 100)
    if (page < 0) { page = 0 }
    if (size < 0) { size = 100 }
    if (size > 200) { size = 200 }
    let start = page * size
    filter.skip = start
    filter.take = size
  }
  console.log({ filter });

  let data = await prismaClient.Category.findMany(filter)
  return data
}