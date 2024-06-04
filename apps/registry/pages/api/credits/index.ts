import { NextApiRequest, NextApiResponse } from "next"
import checkApiKey from "lib/checkApiKey"
import {getCredits, newCredit} from "lib/database/credits"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, headers, query, body } = req;
  const apiKey = Array.isArray(headers['x-api-key']) ? headers['x-api-key'][0] : headers['x-api-key'];
  const authorized = await checkApiKey(apiKey);
  if (!authorized) {
    return res.status(403).json({ success: false });
  }
  switch (method) {
    case "GET":
      try {
        let result = await getCredits(query)
        res.status(200).json({ success: true, data: result })
      } catch (error) {
        console.error({ error });
        res.status(400).json({ success: false, error: error.message || 'An error occurred' });
      }
      break
    case "POST":
      try {
        let result = await newCredit(body)
        res.status(201).json({ success: true, data: result })
      } catch (error) {
        console.error({ error })
        res.status(400).json({ success: false, error: error.message || 'An error occurred' })
      }
      break
    default:
      res.status(405).json({ success: false, message: "Method Not Allowed" })
      break
  }
}
