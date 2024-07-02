import { NextApiRequest, NextApiResponse } from 'next'
import { addStory, updateStoryLink } from 'utils/registry'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req
  console.log('BODY', body)

  try {
    if (method === 'GET') {
      res.status(405).send(JSON.stringify({error:'Method not allowed'}))
    } else if (method === 'POST') {
      //res.status(501).send(JSON.stringify({error:'Not ready'}))
      const result = await addStory(body)
      // Calc donations linked to story based on amount
      const storyId = result?.data?.id || ''
      if(body.amount > 0 && storyId){
        const link = {
          initiativeId: body.initiativeId,
          storyId,
          amount: body.amount
        }
        const linked = await updateStoryLink(link)
        console.log('LINKED', linked)
      }
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
