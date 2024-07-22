const apiUrl = process.env.CFCE_REGISTRY_API_URL || ""
const apiKey = process.env.CFCE_REGISTRY_API_KEY || ""

type Dictionary = { [key: string]: any }

const fetchRegistry = async (url: string) => {
  console.log("FETCH", url)
  const headers = new Headers()
  headers.set("content-type", "application/json")
  headers.set("x-api-key", apiKey)
  const options: RequestInit = {
    method: "GET",
    headers: headers,
  }
  const response = await fetch(url, options)
  const result = await response.json()
  //console.log('DB', result)
  if (result?.error) {
    console.log("FETCH ERROR", result.error)
    return null
  }
  return result.data
}

const postRegistry = async (url: string, body: Dictionary) => {
  console.log("POST", url)
  const headers = new Headers()
  headers.set("content-type", "application/json; charset=utf8")
  headers.set("x-api-key", apiKey)
  const options: RequestInit = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  }
  const response = await fetch(url, options)
  const result = await response.json()
  return result
}

const putRegistry = async (url: string, body: Dictionary) => {
  console.log("PUT", url)
  const headers = new Headers()
  headers.set("content-type", "application/json; charset=utf8")
  headers.set("x-api-key", apiKey)
  const options: RequestInit = {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(body),
  }
  const response = await fetch(url, options)
  const result = await response.json()
  return result
}

async function dbQuery(endpoint: string) {
  const url = `${apiUrl}/${endpoint}`
  const res = await fetchRegistry(url)
  return res
}

async function dbPost(endpoint: string, body: Dictionary) {
  const url = `${apiUrl}/${endpoint}`
  const res = await postRegistry(url, body)
  return res
}

async function dbPut(endpoint: string, body: Dictionary) {
  const url = `${apiUrl}/${endpoint}`
  const res = await putRegistry(url, body)
  return res
}

export const newOrganization = (body: Dictionary) =>
  dbPost("organizations", body)
export const getOrganizations = () => dbQuery("organizations")
export const getOrganizationById = (id: string) =>
  dbQuery(`organizations/${id}`)
export const getOrganizationByEmail = (email: string) =>
  dbQuery("organizations?email=" + email)
export const getOrganizationsByCategory = (categorySlug: string) =>
  dbQuery(`organizations?category=${categorySlug}`)
export const getOrganizationsByWallet = (walletAddress: string) =>
  dbQuery(`organizations?wallet=${walletAddress}`)
export const newOrganizationWallet = (orgId: string, body: Dictionary) =>
  dbPost("wallets?organizationid=" + orgId, body)
export const getFeaturedOrganization = () =>
  dbQuery(`organizations?featured=true`)

export const getCategories = () => dbQuery("categories")

export const newInitiative = (body: Dictionary) => dbPost("initiatives", body)
export const getInitiativeById = (id: string) => dbQuery(`initiatives/${id}`)
export const getInitiativeByTag = (tag: string) =>
  dbQuery(`initiatives?tag=${tag}`)
export const getInitiatives = () => dbQuery("initiatives")
export const getInitiativesByOrganization = (id: string) =>
  dbQuery(`initiatives?orgId=${id}`)

export const newProvider = (body: Dictionary) => dbPost("providers", body)
export const getProviderById = (id: string) => dbQuery(`providers/${id}`)
export const getProviders = () => dbQuery("providers")

export const newCredit = (body: Dictionary) => dbPost("credits", body)
export const getCreditById = (id: string) => dbQuery(`credits/${id}`)
export const getCredits = () => dbQuery("credits")
export const getCreditsByInitiative = (id: string) =>
  dbQuery(`credits?initid=${id}`)
export const getCreditsByProvider = (id: string) =>
  dbQuery(`credits?provid=${id}`)

export const createNFT = (body: Dictionary) => dbPost("nft", body)
export const getAllNFTs = (id: string) => dbQuery(`nft`)
export const getNFTbyId = (id: string) => dbQuery(`nft?id=${id}`)
export const getNFTbyTokenId = (id: string) => dbQuery(`nft?tokenid=${id}`)
export const getNFTsByAccount = (id: string) => dbQuery(`nft?userid=${id}`)
export const getNFTsByOrganization = (id: string) => dbQuery(`nft?orgId=${id}`)

export const newUser = (body: Dictionary) => dbPost("users", body)
export const getUsers = () => dbQuery("users")
export const getUserByWallet = (wallet: string) =>
  dbQuery("users?wallet=" + wallet)
export const getUserByEmail = (email: string) => dbQuery("users?email=" + email)
export const getUserById = (id: string) => dbQuery("users/" + id)
export const updateUser = (id: string, body: Dictionary) =>
  dbPost("users/" + id, body)
export const getUserWallets = () => dbQuery("userwallets")
export const newUserWallet = (body: Dictionary) => dbPost("userwallets", body)

export const addStory = (body: Dictionary) => dbPut("stories", body) // simply add record
export const newStory = (body: Dictionary) => dbPost("stories", body) // add record and upload images
export const getStories = () => dbQuery("stories")
export const getStoryById = (id: string) => dbQuery("stories/" + id)
export const getStoriesByOrganization = (id: string) =>
  dbQuery("stories?orgId=" + id)
export const getStoriesByInitiative = (id: string) =>
  dbQuery("stories?initid=" + id)
export const updateStory = (id: string, body: Dictionary) =>
  dbPost("stories/" + id, body)
export const getStoryMedia = (id: string) => dbQuery("storymedia?id=" + id)
export const addStoryMedia = (id: string, body: Dictionary) =>
  dbPost("storymedia?id=" + id, body)

export const getDonations = (query: string) => dbQuery(`donations?` + query)
export const getDonationsByOrganization = (orgId: string) =>
  dbQuery(`donations?orgId=${orgId}`)
export const getDonationsByOrganizationAndDate = (
  orgId: string,
  from: string,
  to: string,
) => dbQuery(`donations?orgId=${orgId}&from=${from}&to=${to}`)
export const getDonationsByInitiative = (initid: string) =>
  dbQuery(`donations?initid=${initid}`)
export const getDonationsByInitiativeAndDate = (
  initid: string,
  from: string,
  to: string,
) => dbQuery(`donations?initid=${initid}&from=${from}&to=${to}`)
export const getDonationsByStory = (storyid: string) =>
  dbQuery(`donations?storyid=${storyid}`)
export const updateStoryLink = (body: Dictionary) => dbPut("donations", body)

// END
