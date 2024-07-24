import {
  getUserWallets,
  getWallets,
  newUserWallet,
  newWallet,
} from "@cfce/database"
import checkApiKey from "lib/checkApiKey"

export default async function handler(req, res) {
  const { method, headers, query, body } = req
  const authorized = await checkApiKey(headers["x-api-key"])
  if (!authorized) {
    return res.status(403).json({ success: false, error: "Unauthorized" })
  }
  switch (method) {
    case "GET":
      try {
        let result = await getUserWallets(query)
        res.status(200).json({ success: true, data: result })
      } catch (error) {
        console.log({ error })
        res.status(400).json({ success: false, error: error.message })
      }
      break
    case "POST":
      try {
        let { address, chain } = body
        let result = await newUserWallet({
          chain,
          address,
          userId: query.userId,
        })
        res.status(200).json({ success: true, data: result })
      } catch (error) {
        console.log({ error })
        res.status(400).json({ success: false, error: error.message })
      }
      break
    default:
      res.status(400).json({ success: false, error: "Invalid HTTP method" })
      break
  }
}
