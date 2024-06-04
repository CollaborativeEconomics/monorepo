import checkApiKey from "lib/checkApiKey"
import {getWallets, newWallet} from "lib/database/wallets"

export default async function handler(req, res) {
  const { method, headers, query, body } = req
  const authorized = await checkApiKey(headers['x-api-key'])
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
        let { address, chain } = body
        let result = await newWallet({
          chain,
          address,
          organizations: {
            connect: {
              id: query.organizationid
            }
          }
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
