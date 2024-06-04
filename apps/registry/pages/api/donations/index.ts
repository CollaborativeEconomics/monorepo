import checkApiKey from "lib/checkApiKey"
import { getDonations, newDonation } from "lib/database/donations"


export default async function handler(req, res) {
  const { method, headers, query, body } = req
  const authorized = await checkApiKey(headers['x-api-key'])
  if (!authorized) {
    return res.status(403).json({ success: false })
  }
  switch (method) {
    // GET /api/donations[?page=0&limit=100]
    case 'GET':
      try {
        let result = await getDonations(query)
        return res.status(201).json({ success: true, data: result })
      } catch (error) {
        console.log({ error })
        return res.status(400).json({ success: false })
      }
      break
    case "POST":
      try {
        let record = body
        let result = await newDonation(record)
        return res.status(200).json({ success: true, data: result })
      } catch (error) {
        console.error('ERROR:', error)
        return res.status(400).json({ success: false, error: error.message })
      }
      break
    default:
      let message = 'Invalid HTTP method, only GET and POST accepted'
      console.error(message)
      return res.status(400).json({ success: false, error: message })
      break
  }
}