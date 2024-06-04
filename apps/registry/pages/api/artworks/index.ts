import checkApiKey from "lib/checkApiKey"
import {getArtworks, newArtwork} from "lib/database/artworks"

export default async function handler(req, res) {
  let { method, headers, query, body } = req
  let authorized = await checkApiKey(headers['x-api-key'])
  if (!authorized) {
    return res.status(403).json({ success: false, error:'Not authorized' })
  }
  switch (method) {
    // GET /api/artworks[?page=0&size=100]
    // gets latest minted nfts
    // page and size are optional
    case "GET":
      try {
        let result = await getArtworks(query) 
        res.status(200).json({ success: true, data: result })
      } catch (error) {
        console.log({ error })
        res.status(400).json({ success: false, error:error.message })
      }
      break
    // POST /api/artworks {form:data}
    // create new nft artwork
    case "POST":
      try {
        let record = body
        let result = await newArtwork(record)
        return res.status(201).json({ success: true, data: result })
      } catch (error) {
        console.error('REGISTRY ERROR', { error })
        return res.status(400).json({ success: false, error: error.message })
      }
      break
    default:
      res.status(400).json({ success: false, error:'HTTP method not accepted' })
      break
  }
}