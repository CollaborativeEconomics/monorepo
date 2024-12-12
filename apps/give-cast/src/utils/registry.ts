const apiUrl = process.env.CFCE_REGISTRY_API_URL || ""
const apiKey = process.env.CFCE_REGISTRY_API_KEY || ""

const fetchRegistry = async (url: string) => {
  try {
    console.log("Fetching", url)
    const options = {
      headers: {
        "x-api-key": apiKey,
        "content-type": "application/json",
      },
    }
    const response = await fetch(url, options)
    const result = await response.json()
    return result.data
  } catch (ex) {
    console.error(ex)
    return { error: ex instanceof Error ? ex.message : "Unknown error" }
  }
}

const postRegistry = async (url: string, body: Dictionary) => {
  try {
    console.log("Posting", url)
    const options = {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    }
    const response = await fetch(url, options)
    const result = await response.json()
    return result
  } catch (ex) {
    console.error(ex instanceof Error ? ex.message : "Unknown error")
    return { error: ex instanceof Error ? ex.message : "Unknown error" }
  }
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

export const getInitiativeById = (id: string) => dbQuery(`initiatives/${id}`)
export const getInitiatives = () => dbQuery("initiatives")
export const getOrganizations = () => dbQuery("organizations")
export const getUserByWallet = (wallet: string) =>
  dbQuery(`users?wallet=${wallet}`)
export const newDonation = (body: Dictionary) => dbPost("donations", body)
export const newUser = (body: Dictionary) => dbPost("users", body)
