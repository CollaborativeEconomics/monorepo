import { getCollections, newCollection } from "@cfce/database"
import checkApiKey from "lib/checkApiKey"

export default async function handler(req, res) {
  const { method, headers, query } = req
  const authorized = await checkApiKey(headers["x-api-key"])
  if (!authorized) {
    return res.status(403).json({ success: false, error: "Not authorized" })
  }
  switch (method) {
    // GET /api/collections[?page=0&size=100]
    // gets a list of recently created collections
    // page and size are optional
    case "GET":
      try {
        const result = await getCollections(query)
        return res.status(201).json({ success: true, data: result })
      } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, error: error.message })
      }
      break
    // POST /api/collections {data}
    // Creates a new entry in the collections table
    case "POST":
      try {
        const record = req.body
        const result = await newCollection(record)
        return res.status(201).json({ success: true, data: result })
      } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, error: error.message })
      }
    default:
      return res
        .status(400)
        .json({ success: false, error: "Invalid HTTP method" })
  }
}
