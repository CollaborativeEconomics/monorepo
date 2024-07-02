import { NextApiRequest, NextApiResponse } from 'next'
import { newCredit } from 'utils/registry'

export default async function addCredit(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req
  //console.log('BODY', body)

  try {
    if (method === 'GET') {
      res.status(405).send(JSON.stringify({error:'Method not allowed'}))
    } else if (method === 'POST') {
      const result = await newCredit(body)
      res.status(200).send(JSON.stringify(result))
    } else {
      res.status(405).send(JSON.stringify({error:'Method not allowed'}))
    }
  } catch(ex) {
    console.error(ex)
    res.status(500).send(JSON.stringify({error:ex.message}))
  }
}
