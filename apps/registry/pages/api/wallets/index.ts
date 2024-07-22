import { getWallets, newWallet } from "@cfce/database"
import checkApiKey from "lib/checkApiKey"

export default async function handler(req, res) {
  const { method, headers, query, body } = req
  const authorized = await checkApiKey(headers["x-api-key"])
  if (!authorized) {
    return res.status(403).json({ success: false })
  }
  switch (method) {
    case "GET":
      try {
        let result = await getWallets(query)
        res.status(200).json({ success: true, data: result })
      } catch (error) {
        console.log({ error })
        res.status(400).json({ success: false })
      }
      break
    case "POST":
      try {
        const { address, chain } = body
        const result = await newWallet({
          chain,
          address,
          organizationId: query.organizationid,
          initiativeId: null,
        })
        res.status(201).json({ success: true, data: result })
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
