// Fetch our api servers
// Returns payload result as json
// On error returns error:message

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type Dictionary = { [key: string]: any }

export async function apiFetch(query: string) {
  try {
    const url = `/api/${query}`
    console.log("FETCH", url)
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
    const result = await fetch(url, options)
    const data = await result.json()
    //console.log('<DATA', data)
    return data
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (ex: any) {
    console.error(ex)
    return { error: ex.message }
  }
}

export async function apiPost(query: string, data: Dictionary) {
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
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (ex: any) {
    console.error(ex)
    return { error: ex.message }
  }
}
