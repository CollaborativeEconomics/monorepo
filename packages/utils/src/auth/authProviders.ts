import appConfig from "@cfce/app-config"
import { chainConfig } from "@cfce/blockchain-tools"
import type { Chain } from "@cfce/database"
import type { AuthTypes } from "@cfce/types"
import type { User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import type { CredentialInput, Provider } from "next-auth/providers/index"
import { v7 as uuidv7 } from "uuid"
import { registryApi } from "../registryApi"

interface Credentials {
  id: string
  address: string
  chain: string
  chainId: string
  network: string
  currency: string
}

async function getUserByCredentials(credentials: Credentials) {
  console.log("CREDS", credentials)
  try {
    // let user: User | null = await getUserByWallet(credentials?.address || "")
    let { data: user } = await registryApi.get<User>(
      `/users?wallet=${credentials?.address}`,
    )
    console.log("USER", user)
    const chain =
      credentials?.chain ?? chainConfig[appConfig.chainDefaults.chain].name
    if (!user) {
      const uuid = uuidv7()
      const mail = `_${uuid.substr(0, 8)}@example.com`
      const { data: result } = await registryApi.post<User>("/users", {
        created: new Date(),
        api_key: uuid,
        name: "Anonymous",
        description: "",
        email: mail,
        emailVerified: false,
        image: "",
        inactive: false,
        wallet: credentials?.address || "",
        wallets: {
          create: [
            {
              chain: chain as Chain,
              address: credentials?.address || "",
            },
          ],
        },
      })
      if (!result.id) {
        return null
      }
      user = result
    }
    const info = {
      id: user?.id,
      name: user?.name || "Anonymous",
      email: user?.email || "test@example.com",
      image: user?.image || "/media/nopic.png",
      address: credentials?.address || "",
      chain: chain,
      network: credentials?.network || "",
      currency: credentials?.currency || "",
    }
    return info
  } catch (ex) {
    console.error(ex)
    return null
  }
}

const credentialsDefinition: Record<string, CredentialInput> = {
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
  if (!credentials) {
    return null
  }
  try {
    // TODO: this hack shouldn't be needed
    const user = await getUserByCredentials(credentials as Credentials)
    return user
  } catch (ex) {
    console.error("ERROR:", ex)
    return null
  }
}

const authProviders: Record<AuthTypes, Provider> = {
  argent: CredentialsProvider({
    id: "Argent",
    name: "Argent",
    credentials: credentialsDefinition,
    authorize: authorizeChain,
  }),
  // lobstr: CredentialsProvider({
  //   id: "Lobstr",
  //   name: "Stellar - Lobstr",
  //   credentials: credentialsDefinition,
  //   authorize: authorizeChain,
  // }),
  freighter: CredentialsProvider({
    id: "Freighter",
    name: "Stellar - Freighter",
    credentials: credentialsDefinition,
    authorize: authorizeChain,
  }),
  xaman: CredentialsProvider({
    id: "Xaman",
    name: "XRPL - Xaman",
    credentials: credentialsDefinition,
    authorize: authorizeChain,
  }),
  metamask: CredentialsProvider({
    id: "Metamask",
    name: "Metamask",
    credentials: credentialsDefinition,
    authorize: authorizeChain,
  }),
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

export default authProviders
