import checkApiKey from "lib/checkApiKey"
import { getNFTById } from "@cfce/database"

export default async function handler(req, res) {
  const { method, query } = req
  switch (method) {
    // GET /api/nft/[id]
    // gets unique nft by id
    case "GET":
      try {
        const authorized = await checkApiKey(req.headers['x-api-key'])
        if (!authorized) {
          return res.status(403).json({ success: false })
        }
        let nft = await getNFTById(query.id)
        res.status(200).json({ success: true, data: nft })
      } catch (error) {
        console.log({ error })
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}