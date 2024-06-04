import checkApiKey from "lib/checkApiKey"
import {getOffers} from "lib/database/offers"

// GET /api/offers/[id]
// get offer by id
export default async function handler(req, res) {
  let { method, headers, query } = req
  switch (method) {
    case "GET":
      try {
        let authorized = await checkApiKey(headers['x-api-key'])
        if (!authorized) {
          return res.status(403).json({ success: false, error:'Not authorized' })
        }
        let result = await getOffers(query)
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