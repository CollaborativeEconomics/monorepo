import { NextApiRequest, NextApiResponse } from 'next'
import { getProviders } from 'utils/registry'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = await getProviders()
  return res.json(data)
}
