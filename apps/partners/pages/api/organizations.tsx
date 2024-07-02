import { NextApiRequest, NextApiResponse } from 'next'
import { getOrganizations } from 'utils/registry'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = await getOrganizations()
  return res.json({success:true, result:data})
}
