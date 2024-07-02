import { NextApiRequest, NextApiResponse } from 'next'
import { getStoriesByOrganization } from 'utils/registry'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req?.query?.id?.toString()
  const data = await getStoriesByOrganization(id)
  //console.log('ID', id)
  //console.log('EV', data)
  return res.json(data)
}
