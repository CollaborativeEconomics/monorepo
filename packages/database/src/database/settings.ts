import type { Setting } from "@prisma/client"
import { prismaClient } from ".."

interface SettingsQuery {
  id: string
  name: string
}

export async function getSettings(
  query: SettingsQuery,
): Promise<Setting | Array<Setting> | null> {
  let result = null
  if (query?.id) {
    result = await prismaClient.setting.findUnique({ where: { id: query.id } })
  } else if (query?.name) {
    result = await prismaClient.setting.findUnique({
      where: { name: query.name },
    })
  } else {
    result = await prismaClient.setting.findMany()
  }
  return result
}

export async function getSettingById(id: string): Promise<Setting | null> {
  const result = await prismaClient.setting.findUnique({ where: { id } })
  return result
}

export async function getSettingByName(name: string): Promise<Setting | null> {
  const result = await prismaClient.setting.findUnique({ where: { name } })
  return result
}

export async function newSetting(data: Setting): Promise<Setting> {
  const result = await prismaClient.setting.create({ data })
  return result
}
