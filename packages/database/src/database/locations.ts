import { prismaClient } from ".."

export async function getLocations(): Promise<Array<string>> {
  const data = await prismaClient.organization.findMany({
    distinct: ["country"],
    select: {
      country: true,
    },
    orderBy: { country: "asc" },
  })
  const list = data.map((it) => {
    return it.country || "[All World]"
  })
  return list
}
