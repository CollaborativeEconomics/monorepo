import { NextApiRequest, NextApiResponse } from 'next'
import { getOrganizationById, newOrganization, newInitiative } from 'utils/registry'
import { randomString, randomNumber } from 'utils/random'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req

  try {
    if (method === 'GET') {
      const id = req?.query?.id?.toString()
      console.log('ORGID', id)
      const data = await getOrganizationById(id)
      return res.json({...data})
    } else if (method === 'POST') {
      //console.log('BODY', body)
      const org = await newOrganization(body)
      //console.log('ORG', org)
      if(org?.success){
        const data = {
          organizationId: org.data.id,
          slug: 'general-'+randomString(),
          title: 'General fund',
          description: 'General fund',
          defaultAsset: body.image,
          imageUri: body.image,
          tag: parseInt(randomNumber(8)),
          country: body.country
        }
        const init = await newInitiative(data)
        //console.log('INIT', init)
        return res.json({success:true, org, init})
      }
      return res.status(500).send(JSON.stringify({error:'Error saving organization'}))
    } else {
      res.status(405).send(JSON.stringify({error:'Method not allowed'}))
    }
  } catch(ex) {
    console.error(ex)
    res.status(500).send(JSON.stringify({error:ex.message}))
  }

}
