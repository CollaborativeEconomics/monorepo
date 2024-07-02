import prismaClient from "prisma/client"
import { Setting } from "prisma/models"

export async function getSettings(query): Promise<Setting | Array<Setting>> {
  let result = null
  if(query?.id){
    result = await prismaClient.Setting.findUnique({ where: { id:query.id } })
  } else if (query?.name){
    result = await prismaClient.Setting.findUnique({ where: { name:query.name } })
  } else {
    result = await prismaClient.Setting.findMany()
  }
  return result
}

export async function getSettingById(id): Promise<Setting> {
  const  result = await prismaClient.Setting.findUnique({ where: { id } })
  return result
}

export async function getSettingByName(name): Promise<Setting> {
  const  result = await prismaClient.Setting.findUnique({ where: { name } })
  return result
}

export async function newSetting(data): Promise<Setting> {
  const  result = await prismaClient.Setting.create({ data })
  return result
}
