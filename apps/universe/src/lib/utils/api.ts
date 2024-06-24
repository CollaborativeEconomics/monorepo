import { UUID } from '@/lib/utils/random'
type Dictionary = { [key: string]: any }

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


export async function getUserByWallet(address:string){
  const result = await fetchApi('user?wallet='+address)
  console.log('API USER', result)
  if(!result || result?.error){
    return null
  }
  return result
}

export async function newUser(rec:Dictionary){
  console.log('API NEW USER', rec)
  const result = await postApi('user', rec)
  console.log('API SAVED USER', result)
  if(!result || result?.error){
    return null
  }
  return result?.data || null
}

export function anonymousUser(address:string, chain:string){
  const uuid = UUID()
  const user = {
    id:            null,
    created:       (new Date()).toJSON(),
    api_key:       uuid,
    name:          'Anonymous',
    description:   '',
    email:         '',
    emailVerified: false,
    image:         '',
    inactive:      false,
    wallet:        address||'',
    wallets: {
      create: [
        {
          chain: chain||'',
          address: address||''
        }
      ]
    }
  }
  return user
}

