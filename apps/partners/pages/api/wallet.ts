import { NextApiRequest, NextApiResponse } from 'next'
import { newOrganizationWallet } from 'utils/registry'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req
  console.log('BODY', body)

  try {
    if (method === 'GET') {
      res.status(405).send(JSON.stringify({error:'Method not allowed'}))
    } else if (method === 'POST') {
      const orgid = query?.orgid?.toString() || ''
      const result = await newOrganizationWallet(orgid, body)
      console.log('DB RESULT', result)
      res.status(200).send(JSON.stringify(result))
    } else {
      res.status(405).send(JSON.stringify({error:'Method not allowed'}))
    }
  } catch(ex) {
    console.error(ex)
    res.status(500).send(JSON.stringify({error:ex.message}))
  }
}
