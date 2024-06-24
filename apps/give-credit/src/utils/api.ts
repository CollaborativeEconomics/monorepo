// Fetch our api servers
// Returns payload result as json
// On error returns error:message

type Dictionary = { [key:string]:any }

export async function fetchApi(query:string) {
  try {
    let url = '/api/'+query
    console.log('FETCH', url)
    let options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
    let result = await fetch(url, options)
    let data = await result.json()
    return data
  } catch (ex:any) {
    console.error(ex)
    return { error: ex.message }
  }
}

export async function postApi(query:string, data:Dictionary) {
  try {
    let url = '/api/'+query
    let body = JSON.stringify(data)
    console.log('POST', url)
    console.log('BODY', body)
    let options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    }
    let result = await fetch(url, options)
    let info = await result.json()
    return info
  } catch (ex:any) {
    console.error(ex)
    return { error: ex.message }
  }
}
