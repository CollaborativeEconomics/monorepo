import { NextApiRequest, NextApiResponse } from 'next'
import { addStoryMedia } from 'utils/registry'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req
  const storyid = query?.id.toString()
  console.log('STID', storyid)
  console.log('BODY', body)

  try {
    if (method === 'GET') {
      res.status(405).send(JSON.stringify({error:'Method not allowed'}))
    } else if (method === 'POST') {
      //res.status(501).send(JSON.stringify({error:'Not ready'}))
      const result = await addStoryMedia(storyid, body)
      console.log('RESULT', result)
      res.status(200).send(JSON.stringify(result))
    } else {
      res.status(405).send(JSON.stringify({error:'Method not allowed'}))
    }
  } catch(ex) {
    console.error(ex)
    res.status(500).send(JSON.stringify({error:ex.message}))
  }
}
