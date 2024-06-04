import checkApiKey from "lib/checkApiKey"
import { getStoryById, updateStory } from "lib/database/stories"

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
        let result = await getStoryById(query.id)
        res.status(201).json({ success: true, data: result });
      } catch (error) {
        console.log('ERROR', error)
        res.status(400).json({ success: false, error: error?.message });
      }
      break;
    // POST /api/users/[id] {body}
    // Update user by id
    // Returns an object if updated
    case "POST":
      try {
        // If organizationId is present, ensure the story belongs to the organization
        if (orgId) {
          const story = await getStoryById(query.id);
          if (story.organizationId !== orgId) {
            return res.status(403).json({ success: false, error: 'Access denied for this organization' });
          }
        }

        let result = await updateStory(query.id, body);
        return res.status(201).json({ success: true, data: result });
      } catch (error) {
        console.error('ERROR:', error);
        return res.status(400).json({ success: false, error: error?.message });
      }
      break
    default:
      res.status(400).json({ success: false, error: 'method not allowed' });
      break;
  }
}
