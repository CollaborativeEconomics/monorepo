import { getLocations } from "@cfce/database"
import checkApiKey from "lib/checkApiKey"

export default async function handler(req, res) {
  const { method, headers } = req
  const authorized = await checkApiKey(headers['x-api-key'])
  if (!authorized) {
    return res.status(403).json({ success: false })
  }

  switch (method) {
    case "GET":
      try {
        let result = await getLocations()
        res.status(200).json({ success: true, data: result })
      } catch (error) {
        console.log({ error })
        res.status(400).json({ success: false })
      }
      break
    case "POST":
      res.status(500).json({ success: false, error:'Method not allowed' })
      break
    default:
      res.status(500).json({ success: false, error:'Method not allowed' })
      break
  }
}
