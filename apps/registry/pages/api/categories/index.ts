import checkApiKey from "lib/checkApiKey"
import {getCategories} from "lib/database/categories"

export default async function handler(req, res) {
  const { method, headers, query } = req
  switch (method) {
    case "GET":
      try {
        console.log('get')
        const authorized = await checkApiKey(headers['x-api-key'])
        if (!authorized) {
          return res.status(403).json({ success: false })
        }
        const categories = await getCategories(query)
        res.status(200).json({ success: true, data: categories })
      } catch (error) {
        console.log(error)
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
