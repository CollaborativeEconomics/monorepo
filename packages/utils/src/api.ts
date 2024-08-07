// Fetch our api servers
// Returns payload result as json
// On error returns error:message

type Dictionary = { [key: string]: any }

export async function fetchApi(query: string) {
  try {
    const url = `/api/${query}`
    console.log("FETCH", url)
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
    const result = await fetch(url, options)
    const data = await result.json()
    return data
  } catch (ex) {
    console.error(ex)
    if (ex instanceof Error) {
      return { error: ex.message }
    }
    return { error: "Unknown error" }
  }
}

export async function postApi(query: string, data: Dictionary) {
  try {
    const url = `/api/${query}`
    const body = JSON.stringify(data)
    console.log("POST", url)
    console.log("BODY", body)
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
    }
    const result = await fetch(url, options)
    const info = await result.json()
    return info
  } catch (ex) {
    console.error(ex)
    if (ex instanceof Error) {
      return { error: ex.message }
    }
    return { error: "Unknown error" }
  }
}
