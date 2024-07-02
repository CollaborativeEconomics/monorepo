import { getStoryMediaById } from "@cfce/database";
import checkApiKey from "lib/checkApiKey"

export default async function handler(req, res) {
  const { method, headers, query, body } = req;
  const orgId  = Array.isArray(query.orgId) ? query.orgId[0] : query.orgId;
  const authorized = await checkApiKey(headers['x-api-key'], orgId);

  if (!authorized) {
    return res.status(403).json({ success: false });
  }
  
  switch (method) {
    case "GET":
      try {
        let result = await getStoryMediaById(query.id)
        res.status(201).json({ success: true, data: result });
      } catch (error) {
        console.log('ERROR', error)
        res.status(400).json({ success: false, error: error?.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: 'method not allowed' });
      break;
  }
}
