import checkApiKey from "lib/checkApiKey"
import {newSession, getSession, deleteSession} from "lib/database/session"

export default async function handler(req, res) {
  const { method, headers, query, body } = req
  const authorized = await checkApiKey(headers['x-api-key'])
  if (!authorized) {
    return res.status(403).json({ success: false, error:'Not authorized' })
  }
  switch (method) {
    case "GET":
      try {
        let result = await getSession(query)
        res.status(200).json({ success: true, data: result })
      } catch (error) {
        console.error('ERROR:', error)
        res.status(400).json({ success: false, error: error.message })
      }
      break
    case "POST":
      try {
        let record = body
        let result = await newSession(record)
        return res.status(200).json({ success: true, data: result })
      } catch (error) {
        console.error('ERROR:', error)
        return res.status(400).json({ success: false, error: error.message })
      }
      break
    case "DELETE":
      try {
        let result = await deleteSession(query)
        return res.status(200).json({ success: true, data: result })
      } catch (error) {
        console.error('ERROR:', error)
        return res.status(400).json({ success: false, error: error.message })
      }
      break
    default:
      res.status(400).json({ success: false, error:'HTTP method not supported' })
      break
  }
}
