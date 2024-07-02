import { NextApiRequest, NextApiResponse } from 'next'
import { getDonations } from 'utils/registry'

type Dictionary = { [key:string]:any }

export default async function donations(req: NextApiRequest, res: NextApiResponse) {
  console.log('Donations', req.query)
  const args: Dictionary = req.query
  const params = new URLSearchParams(args)
  const search = params.toString()
  const data = await getDonations(search)
  return res.json({success:true, result:data})
}
