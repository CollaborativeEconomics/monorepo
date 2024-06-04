const apiUrl = process.env.CFCE_REGISTRY_API_URL
const apiKey = process.env.CFCE_REGISTRY_API_KEY

type Dictionary = { [key: string]: any }

const fetchRegistry = async (endpoint: string) => {
  if(!apiUrl || !apiKey){ 
    console.error('ERROR: registry can only be called from server')
    return null
  }
  const url = `${apiUrl}/${endpoint}`
  console.log('FETCH', url)
  const options = {
    headers: {
      'x-api-key': apiKey,
      'content-type': 'application/json'
    }
  }
  const response = await fetch(url, options)
  const result = await response.json()
  if(result?.error){
    console.log('FETCH ERROR', result.error)
    return null
  }
  return result.data
}

const postRegistry = async (endpoint: string, body: Dictionary) => {
  if(!apiUrl || !apiKey){ 
    console.error('ERROR: registry can only be called from server')
    return null
  }
  const url = `${apiUrl}/${endpoint}`
  const options = {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  }
  const response = await fetch(url, options)
  const result = await response.json()
  return result
}

const deleteRegistry = async (endpoint: string) => {
  if(!apiUrl || !apiKey){ 
    console.error('ERROR: registry can only be called from server')
    return null
  }
  const url = `${apiUrl}/${endpoint}`
  console.log('FETCH', url)
  const options = {
    method: 'DELETE',
    headers: {
      'x-api-key': apiKey,
      'content-type': 'application/json'
    }
  }
  const response = await fetch(url, options)
  const result = await response.json()
  if(result?.error){
    console.log('FETCH ERROR', result.error)
    return null
  }
  return result.data
}


export const getSettings = () => fetchRegistry('settings')
export const getSettingByName = (name: string) => fetchRegistry('settings?name='+name)

export const newOrganization = (body: Dictionary) => postRegistry('organizations', body)
export const getOrganizations = () => fetchRegistry('organizations')
export const getOrganizationById = (id: string) => fetchRegistry(`organizations/${id}`)
export const getOrganizationsByCategory = (categorySlug: string) => fetchRegistry(`organizations?category=${categorySlug}`)
export const getOrganizationsByWallet = (walletAddress: string) => fetchRegistry(`organizations?wallet=${walletAddress}`)
export const getFeaturedOrganization = () => fetchRegistry(`organizations?featured=true`)
export const searchOrganizations = (q:string, c:string, l:string) => fetchRegistry(`organizations?search=${q}&category=${c}&location=${l}`)

export const getCategories = () => fetchRegistry('categories')
export const getCategoriesDistinct = (val:string) => fetchRegistry('categories?distinct='+val)

export const newInitiative = (body: Dictionary) => postRegistry('initiatives', body)
export const getInitiativeById = (id: string) => fetchRegistry(`initiatives/${id}`)
export const getInitiativeByTag = (tag: string) => fetchRegistry(`initiatives?tag=${tag}`)
export const getInitiatives = () => fetchRegistry('initiatives')
export const getInitiativesByOrganization = (id: string) => fetchRegistry(`initiatives?orgid=${id}`)
export const searchInitiatives = (q:string, c:string, l:string) => fetchRegistry(`initiatives?search=${q}&category=${c}&location=${l}`)

export const newProvider = (body: Dictionary) => postRegistry('providers', body)
export const getProviderById = (id: string) => fetchRegistry(`providers/${id}`)
export const getProviders = () => fetchRegistry('providers')

export const newCredit = (body: Dictionary) => postRegistry('credits', body)
export const getCreditById = (id: string) => fetchRegistry(`credits/${id}`)
export const getCredits = () => fetchRegistry('credits')
export const getCreditsByInitiative = (id: string) => fetchRegistry(`credits?initid=${id}`)
export const getCreditsByProvider = (id: string) => fetchRegistry(`credits?provid=${id}`)

export const createNFT = (body: Dictionary) => postRegistry('nft', body)
export const getAllNFTs = (id: string) => fetchRegistry(`nft`)
export const getNFTsByAccount = (id: string) => fetchRegistry(`nft?userid=${id}`)
export const getNFTsByOrganization = (id: string) => fetchRegistry(`nft?orgid=${id}`)

export const newUser = (body: Dictionary) => postRegistry('users', body)
export const getUsers = () => fetchRegistry('users')
export const getUserByWallet = (wallet: string) => fetchRegistry('users?wallet='+wallet)
export const getUserById = (id: string) => fetchRegistry('users/'+id)
export const updateUser = (id: string, body: Dictionary) => postRegistry('users/'+id, body)
export const getUserWallets = () => fetchRegistry('userwallets')
export const newUserWallet = (body: Dictionary) => postRegistry('userwallets', body)

export const newStory = (body: Dictionary) => postRegistry('stories', body)
export const getStories = () => fetchRegistry('stories')
export const getStoryById = (id: string) => fetchRegistry('stories/'+id)
export const getStoriesByOrganization = (id: string) => fetchRegistry('stories?orgid='+id)
export const getStoriesByInitiative = (id: string) => fetchRegistry('stories?initid='+id)
export const getRecentStories = (qty:number) => fetchRegistry('stories?recent='+qty)

export const newSession = (body: Dictionary) => postRegistry('session', body)
export const getSession = (id: string) => fetchRegistry('session?token='+id)
export const deleteSession = (id: string) => deleteRegistry('session?token='+id)

export const getLocations = () => fetchRegistry('locations')

export const newDonation = (body: Dictionary) => postRegistry('donations', body)
export const getDonations = () => fetchRegistry('donations')
export const getDonationsByUser = (id: string) => fetchRegistry('donations?userid='+id)

export const getFavoriteOrganizations = (userid: string) => fetchRegistry('donations?favs='+userid)
export const getUserBadges = (userid: string) => fetchRegistry('donations?badges='+userid)

// END