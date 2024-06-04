import checkApiKey from "lib/checkApiKey"
import { getCronjobs } from "lib/database/cronjobs"


export default async function handler(req, res) {
  const { method, headers, query, body } = req
  const authorized = await checkApiKey(headers['x-api-key'])
  if (!authorized) {
    return res.status(403).json({ success: false })
  }

  switch (method) {
    case 'GET':
      try {
        let result = await getCronjobs(query)
        return res.json({ success: true, data: result })
      } catch (error) {
        console.log({ error })
        return res.status(400).json({ success: false, error: error?.message })
      }
      break
    default:
      return res.status(400).json({ success: false, error: 'Method not allowed' })
      break
  }
}