import { getOrganizationById } from "@cfce/database";
import checkApiKey from "lib/checkApiKey"

export default async function handler(req, res) {
  const { method, header, query } = req;
  switch (method) {

    case "GET":
      console.log("query", query);
      try {
        const authorized = await checkApiKey(req.headers['x-api-key']);
        if (!authorized) {
          return res.status(403).json({ success: false });
        }
        let result = await getOrganizationById(query.id)
        res.status(201).json({ success: true, data: result });
      } catch (error) {
        console.log(error)
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
