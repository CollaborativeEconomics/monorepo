import { getDonations } from "@cfce/database"
import checkApiKey from "lib/checkApiKey"

export default async function handler(req, res) {
  const { method, headers, query, body } = req
  const authorized = await checkApiKey(headers['x-api-key'])
  if (!authorized) {
    return res.status(403).json({ success: false })
  }
  switch (method) {
    // GET /api/donations/[id]
    case 'GET':
      try {
        let result = await getDonations(query)
        return res.status(201).json({ success: true, data: result })
      } catch (error) {
        console.log({ error })
        return res.status(400).json({ success: false })
      }
      break
    default:
      let message = 'Invalid HTTP method, only GET and POST accepted'
      console.error(message)
      return res.status(400).json({ success: false, error: message })
      break
  }
}