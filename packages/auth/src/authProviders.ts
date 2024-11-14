import type { Prisma } from "@cfce/database"
import type { Chain, User } from "@cfce/database/types"
import type { AuthTypes } from "@cfce/types"
import { registryApi } from "@cfce/utils"
//import type { User } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import type { Provider } from "next-auth/providers/index"
import { v7 as uuidv7 } from "uuid"
interface Credentials {
  id: string
  address: string
  chain: string
  chainId: string
  network: string
  currency: string
}

async function getUserByCredentials(
  { id: userId, address, chain, chainId, network, currency }: Credentials,
  createTBA = false,
) {
  try {
    // let user: User | null = await getUserByWallet(credentials?.address || "")
    const result = await registryApi.get<User>(`/users?wallet=${address}`)
    let user = result.data
    console.log("USER", user)
    if (!user) {
      const uuid = uuidv7()
      const mail = `${userId}@cfce.io`
      const userData: Prisma.UserCreateInput = {
        created: new Date(),
        api_key: uuid,
        name: "Anonymous",
        description: "",
        email: mail,
        emailVerified: false,
        image: "",
        inactive: false,
        wallet: address || "",
        wallets: {
          create: [
            {
              chain: chain as Chain,
              address: address || "",
            },
          ],
        },
      }
      const result = await registryApi.post<User>("/users", {
        ...userData,
        createTBA,
      })
      user = result.data
    }
    const info = {
      id: user?.id,
      name: user?.name || "Anonymous",
      email: user?.email || "test@example.com",
      image: user?.image || "/media/nopic.png",
      address: address || "",
      chain: chain,
      network: network || "",
      currency: currency || "",
    }
    return info
  } catch (ex) {
    console.error(ex)
    return null
  }
}

const credentialsDefinition = {
  id: { label: "id", type: "text" },
  address: { label: "address", type: "text" },
  chain: { label: "chain", type: "text" },
  chainId: { label: "chainId", type: "text" },
  network: { label: "network", type: "text" },
  currency: { label: "currency", type: "text" },
}

const authorizeChain = async (
  credentials: Partial<Record<keyof Credentials, unknown>>,
) => {
  console.log("Credentials", credentials)
  if (!credentials) {
    return null
  }
  try {
    const user = await getUserByCredentials(credentials as Credentials)
    return user
  } catch (ex) {
    console.error("ERROR:", ex)
    return null
  }
}

const authProviders: Record<AuthTypes, Provider> = {
  argent: {
    id: "Argent",
    name: "Argent",
    type: "credentials",
    credentials: credentialsDefinition,
    authorize: authorizeChain,
  },
  // lobstr: CredentialsProvider({
  //   id: "Lobstr",
  //   name: "Stellar - Lobstr",
  //   credentials: credentialsDefinition,
  //   authorize: authorizeChain,
  // }),
  freighter: {
    id: "Freighter",
    name: "Stellar - Freighter",
    type: "credentials",
    credentials: credentialsDefinition,
    authorize: authorizeChain,
  },
  xaman: {
    id: "Xaman",
    name: "XRPL - Xaman",
    type: "credentials",
    credentials: credentialsDefinition,
    authorize: authorizeChain,
  },
  metamask: {
    id: "metamask",
    name: "Metamask",
    type: "credentials",
    credentials: credentialsDefinition,
    authorize: authorizeChain,
  },
  google: GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  }),
  github: GithubProvider({
    clientId: process.env.GITHUB_ID ?? "",
    clientSecret: process.env.GITHUB_SECRET ?? "",
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.name || profile.login,
        email: profile.email,
        image: profile.avatar_url,
      } as User
    },
  }),
  /*
  auth0:Auth0Provider({
    clientId: process.env.AUTH0_ID,
    clientSecret: process.env.AUTH0_SECRET,
    issuer: process.env.AUTH0_ISSUER,
  }),
  facebook:FacebookProvider({
    clientId: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
  }),
  twitter:TwitterProvider({
    clientId: process.env.TWITTER_ID,
    clientSecret: process.env.TWITTER_SECRET,
    version: "2.0",
  })
*/
}

console.log("Configured AUTH PROVIDERS:", Object.keys(authProviders))

export default authProviders