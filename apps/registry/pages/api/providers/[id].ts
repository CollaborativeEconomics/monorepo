import checkApiKey from "lib/checkApiKey"
import { getProviderById } from "lib/database/providers"

export default async function handler(req, res) {
  const { method, header, query } = req;
  switch (method) {
    case "GET":
      try {
        const authorized = await checkApiKey(req.headers['x-api-key']);
        if (!authorized) {
          return res.status(403).json({ success: false });
        }
        let result = await getProviderById(query.id)
        res.status(201).json({ success: true, data: result });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
