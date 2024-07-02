import { NextApiRequest, NextApiResponse } from 'next'
import { getCategories } from 'utils/registry'

export default async function Categories(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  try {
    if (method === 'GET') {
      const result = await getCategories()
      res.status(200).send(JSON.stringify(result))
    } else {
      res.status(405).send(JSON.stringify({error:'Method not allowed'}))
    }
  } catch(ex) {
    console.error(ex)
    res.status(500).send(JSON.stringify({error:ex.message}))
  }
}
