import checkApiKey from "lib/checkApiKey"
import {getArtworkById} from "lib/database/artworks"

// GET /api/artworks/[id]
// get artwork by id
export default async function handler(req, res) {
  let { method, headers, query } = req
  switch (method) {
    case "GET":
      try {
        let authorized = await checkApiKey(headers['x-api-key'])
        if (!authorized) {
          return res.status(403).json({ success: false, error:'Not authorized' })
        }
        let result = await getArtworkById(query.id)
        res.status(200).json({ success: true, data: result })
      } catch (error) {
        console.log({ error })
        res.status(400).json({ success: false, error:error.message })
      }
      break
    default:
      res.status(400).json({ success: false, error:'HTTP method not accepted' })
      break
  }
}