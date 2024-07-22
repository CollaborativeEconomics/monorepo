import { prismaClient } from "@cfce/database"

const officialApiKey = process.env.OFFICIAL_CFCE_API_KEY

const checkApiKey = async (apiKey: string, id?: string): Promise<boolean> => {
  if (apiKey === officialApiKey) {
    return true
  }

  const user = await prismaClient.user.findUnique({
    where: { api_key: apiKey },
  })

  // If the API key is not enabled or there's no user, return unauthorized
  if (!user?.api_key_enabled) {
    return false
  }

  // TODO: this is all broken because there's no user/organization relationship
  // If an ID is provided, check if it matches the user's ID or organization ID
  // if (id) {
  //   const isUserIdMatch = id === user.id
  //   const organization = await prismaClient.organization.findFirst({
  //     where: {
  //       userId: user.email,
  //     },
  //   })

  //   if (isUserIdMatch) {
  //     return true
  //   } else {
  //     return false
  //   }
  // } else {
  //   // If no ID is provided, just check if the user is associated with an organization
  //   const organization = await prismaClient.Organization.findFirst({
  //     where: {
  //       email: user.email,
  //     },
  //   })

  //   if (organization) {
  //     return true
  //   } else {
  //     return false
  //   }
  // }
}

export default checkApiKey
