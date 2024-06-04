import checkApiKey from "lib/checkApiKey"
import {getNftData, newNftData} from "lib/database/nftData"


export default async function handler(req, res) {
  const { method, headers, query, body } = req
  const authorized = await checkApiKey(headers['x-api-key'])
  if (!authorized) {
    return res.status(403).json({ success: false })
  }
  switch (method) {
    // GET /api/nft[?page=0&limit=100]
    // gets a list of recently minted nfts order by created desc
    case "GET":
      try {
        let result = await getNftData(query)
        return res.status(201).json({ success: true, data: result })
      } catch (error) {
        console.log({ error })
        return res.status(400).json({ success: false })
      }
      break
    // POST /api/nft {nft:data}
    case "POST":
      try {
        const record = body
        const result = await newNftData(record)
        return res.status(201).json({ success: true, data: result })
      } catch (error) {
        console.error('REGISTRY ERROR', { error })
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