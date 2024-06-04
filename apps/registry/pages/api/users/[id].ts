import checkApiKey from "lib/checkApiKey"
import { getUser, setUser } from "lib/database/users"

export default async function handler(req, res) {
  const { method, headers, query, body } = req;
  switch (method) {
    // GET /api/users/[id]
    // Get user by id
    // Returns an object if found
    case "GET":
      try {
        const authorized = await checkApiKey(headers['x-api-key']);
        if (!authorized) {
          return res.status(403).json({ success: false, error:'Not authorized' });
        }
        console.log('GET USER ID', query.id)
        let result = await getUser(query.id)
        if(result){
          return res.status(200).json({ success: true, data: result });
        } else {
          return res.status(200).json({ success: false, error: 'User not found' });
        }
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
      break;
    // POST /api/users/[id] {body}
    // Update user by id
    // Returns an object if updated
    case "POST":
      try {
        const authorized = await checkApiKey(headers['x-api-key']);
        if (!authorized) {
          return res.status(403).json({ success: false, error:'Not authorized' });
        }
        console.log('SET USER ID', query.id)
        let result = await setUser(query.id, body)
        return res.status(201).json({ success: true, data: result })
      } catch (error) {
        console.error('ERROR:', error)
        return res.status(400).json({ success: false, error: error.message })
      }
      break
    default:
      return res.status(400).json({ success: false, error:'HTTP method not supported' });
      break;
  }
}
