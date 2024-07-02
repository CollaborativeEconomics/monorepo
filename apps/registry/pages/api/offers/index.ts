import { getOffers, newOffer, updateOffer } from "@cfce/database"
import checkApiKey from "lib/checkApiKey"

export default async function handler(req, res) {
  let { method, headers, query, body } = req
  let authorized = await checkApiKey(req.headers['x-api-key'])
  if (!authorized) {
    return res.status(403).json({ success: false, error: 'Not authorized' })
  }
  switch (method) {
    // GET /api/offers[?page=0&size=100]
    // gets a list of recently created offers
    // page and size are optional
    case "GET":
      try {
        let result = await getOffers(query)
        res.status(201).json({ success: true, data: result })
      } catch (error) {
        console.log({ error })
        res.status(400).json({ success: false, error:error.message })
      }
      break
    // POST /api/offers {form:data}
    // Creates a new entry in the offers table
    case "POST":
      try {
        let record = req.body
        let result = await newOffer(record)
        return res.status(201).json({ success: true, data: result })
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message })
      }
      break
    case "PUT":
      try {
        const data = req.body
        const {id, ...record} = data
        let result = await updateOffer(id, record)
        return res.status(201).json({ success: true, data: result })
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message })
      }
      break
    default:
      return res.status(400).json({ success: false, error: 'Invalid HTTP method' })
      break
  }
}