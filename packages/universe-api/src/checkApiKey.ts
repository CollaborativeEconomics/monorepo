import { prismaClient } from "@cfce/database"
import { UserType } from "@cfce/types"

const officialApiKey = process.env.OFFICIAL_CFCE_API_KEY

const checkApiKey = async (
  apiKey: string | null,
  options?: {
    userId?: string
    orgId?: string
    adminOnly?: boolean
    devOnly?: boolean
  },
): Promise<boolean> => {
  const { userId, orgId, adminOnly, devOnly } = options || {}

  console.log({
    apiKey,
    userId,
    orgId,
    adminOnly,
    devOnly,
    officialApiKey,
    dev: process.env.NEXT_PUBLIC_APP_ENV,
  })

  if (!apiKey) {
    return false
  }

  if (apiKey === officialApiKey) {
    return true
  }

  if (devOnly && process.env.NEXT_PUBLIC_APP_ENV !== "development") {
    return false
  }

  const user = await prismaClient.user.findUnique({
    where: { api_key: apiKey },
  })

  if (adminOnly && user?.type !== UserType.admin) {
    return false
  }

  // If the API key is not enabled or there's no user, return unauthorized
  if (!user?.api_key_enabled) {
    return false
  }

  // TODO: this is all broken because there's no user/organization relationship
  // If an ID is provided, check if it matches the user's ID or organization ID
  // if (userId) {
  //   const isUserIdMatch = userId === user.id
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
  return false
}

export default checkApiKey
