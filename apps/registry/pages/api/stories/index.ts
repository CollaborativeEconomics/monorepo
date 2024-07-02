import type { NextApiRequest, NextApiResponse } from 'next'
import formidable, { PersistentFile } from 'formidable'
import checkApiKey from "@/lib/checkApiKey"
import { Story } from '@prisma/client'
import { addStory, getStories, newStory } from '@cfce/database'

// Configure API route to allow multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, headers, query, body } = req
  const apiKey = Array.isArray(headers['x-api-key']) ? headers['x-api-key'][0] : headers['x-api-key'];
  const orgId  = Array.isArray(query.orgId) ? query.orgId[0] : query.orgId;
  const authorized = await checkApiKey(apiKey, orgId);


  if (!authorized) {
    return res.status(403).json({ success: false, error: 'Not authorized' })
  }
  switch (method) {
    case "GET":
      try {
        if (!authorized) {
          return res.status(403).json({ success: false, error: 'Not authorized' });
        }
  
        const story = await getStories(query);
  
        return res.status(200).json({ success: true, data: story });
      } catch (error) {
        console.error('ERROR:', error);
        return res.status(400).json({ success: false, error: error?.message });
      }
    case "POST":
      try {
        const form = formidable({});
        const [fields, files] = await form.parse(req);

        const flattenedTypedStory = Object.keys(fields)
          .reduce((acc, key) => {
            const value = fields[key][0];
            switch (key) {
              case ('amount'): {
                acc[key] = Number(value);
                break;
              }
              case ('inactive'): {
                acc[key] = value === 'true' || value === '1';
                break;
              }
              case ('created'): {
                acc[key] = new Date(value);
                break;
              }
              default: {
                acc[key] = value;
              }
            }
            return acc;
          }, {} as Story)

        const image = files?.files?.[0] as PersistentFile;

        let result = await newStory(flattenedTypedStory, image)
        res.status(201).json({ success: true, data: result })
      } catch (error) {
        console.log({ error })
        res.status(400).json({ success: false })
      }
      break
    case "PUT":
      // Temp method to add plain story already processed on the client or server
      try {
        const form = formidable({})
        const [fields, files] = await form.parse(req)
        console.log('REC', fields)
        let result = await addStory(fields)
        res.json({ success: true, data: result })
      } catch (error) {
        console.error('ERROR:', error)
        return res.status(400).json({ success: false, error: error.message })
      }
      break
    default:
      res.status(400).json({ success: false, error: 'Method not allowed' })
      break
  }
}
