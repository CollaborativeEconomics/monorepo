const apiUrl = process.env.CFCE_REGISTRY_API_URL || ''
const apiKey = process.env.OFFICIAL_CFCE_API_KEY || ''
//const apiKey = process.env.CFCE_REGISTRY_API_KEY || ''

type Dictionary = { [key:string]:any }

const fetchRegistry = async (url:string) => {
  try {
    console.log('Fetching', url)
    const options = {
      headers: {
        'x-api-key': apiKey,
        'content-type': 'application/json'
      }
    }
    const response = await fetch(url, options)
    const result = await response.json()
    //console.log('DBRES', result)
    return result.data
  } catch(ex:any) {
    console.error(ex)
    return {error:ex.message}
  }
}

const postRegistry = async (url: string, body: Dictionary) => {
  try {
    console.log('Posting', url)
    const options = {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(body)
    }
    const response = await fetch(url, options)
    const result = await response.json()
    return result
  } catch(ex:any) {
    console.error(ex)
    return {error:ex.message}
  }
}

// DATABASE

async function dbQuery(endpoint: string){
  const url = `${apiUrl}/${endpoint}`
  const res = await fetchRegistry(url)
  return res
}

async function dbPost(endpoint: string, body: Dictionary){
  const url = `${apiUrl}/${endpoint}`
  const res = await postRegistry(url, body)
  return res
}

export const newOrganization = (body: Dictionary) => dbPost('organizations', body)
export const getOrganizations = () => dbQuery('organizations')
export const getOrganizationById = (id: string) => dbQuery(`organizations/${id}`)
export const getOrganizationByEmail = (email: string) => dbQuery(`organizations?email=${email}`)
export const getOrganizationsByCategory = (categorySlug: string) => dbQuery(`organizations?category=${categorySlug}`)
export const getOrganizationsByWallet = (walletAddress: string) => dbQuery(`organizations?wallet=${walletAddress}`)
export const getOrganizationsByChain = (chain: string) => dbQuery(`organizations?chain=${chain}`)
export const searchOrganizations = (q:string, c:string, l:string) => dbQuery(`organizations?search=${q}&category=${c}&location=${l}`)

export const getCategories = () => dbQuery('categories')
export const getCategoriesDistinct = (val:string) => dbQuery('categories?distinct='+val)

export const newInitiative = (body: Dictionary) => dbPost('initiatives', body)
export const getInitiativeById = (id: string) => dbQuery(`initiatives/${id}`)
export const getInitiativeByTag = (tag: string) => dbQuery(`initiatives?tag=${tag}`)
export const getInitiatives = () => dbQuery('initiatives')
export const getInitiativesByOrganization = (id: string) => dbQuery(`initiatives?orgid=${id}`)
export const searchInitiatives = (q:string, c:string, l:string) => dbQuery(`initiatives?search=${q}&category=${c}&location=${l}`)

export const newProvider = (body: Dictionary) => dbPost('providers', body)
export const getProviderById = (id: string) => dbQuery(`providers/${id}`)
export const getProviders = () => dbQuery('providers')

export const newCredit = (body: Dictionary) => dbPost('credits', body)
export const getCreditById = (id: string) => dbQuery(`credits/${id}`)
export const getCredits = () => dbQuery('credits')
export const getCreditsByInitiative = (id: string) => dbQuery(`credits?initiativeid=${id}`)
export const getCreditsByProvider = (id: string) => dbQuery(`credits?providerid=${id}`)
export const updateCredit = (id: string, data: Dictionary) => dbPost(`credits/${id}`, data)

export const createNFT = (body: Dictionary) => dbPost('nft', body)
export const getNFTs = () => dbQuery(`nft`)
export const getAllNFTs = () => dbQuery(`nft`)
export const getNFTById = (id: string) => dbQuery(`nft?id=${id}`)
export const getNFTByTokenId = (id: string) => dbQuery(`nft?tokenid=${id}`)
export const getNFTsByAccount = (id: string) => dbQuery(`nft?userid=${id}`)
export const getNFTsByWallet = (id: string) => dbQuery(`nft?address=${id}`)
export const getNFTsByOrganization = (id: string) => dbQuery(`nft?orgid=${id}`)

export const newUser = (body: Dictionary) => dbPost('users', body)
export const getUsers = () => dbQuery('users')
export const getUserByWallet = (wallet: string) => dbQuery('users?wallet='+wallet)
export const getUserByEmail = (email: string) => dbQuery('users?email='+email)
export const getUserById = (id: string) => dbQuery('users/'+id)
export const updateUser = (id: string, body: Dictionary) => dbPost('users/'+id, body)
export const getUserWallets = (userid: string) => dbQuery('userwallets?userid='+userid)
export const newUserWallet = (body: Dictionary) => dbPost('userwallets', body)

export const newStory = (body: Dictionary) => dbPost('stories', body)
export const getStories = () => dbQuery('stories')
export const getStoryById = (id: string) => dbQuery('stories/'+id)
export const getStoriesByOrganization = (id: string) => dbQuery('stories?orgid='+id)
export const getStoriesByInitiative = (id: string) => dbQuery('stories?initid='+id)
export const getRecentStories = (qty:number) => dbQuery('stories?recent='+qty)

export const getLocations = () => dbQuery('locations')

export const newDonation = (body: Dictionary) => dbPost('donations', body)
export const getDonations = () => dbQuery('donations')
export const getDonationById = (id: string) => dbQuery('donations?id='+id)
export const getDonationsByUser = (id: string) => dbQuery('donations?userid='+id)

export const getFavoriteOrganizations = (userid: string) => dbQuery('donations?favs='+userid)
export const getUserBadges = (userid: string) => dbQuery('donations?badges='+userid)

// END