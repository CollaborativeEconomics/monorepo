import { updateCredit } from '@/utils/registry'

export async function POST(request: Request) {
  try {
    const body:any = await request.json()
    console.log('BODY', body)
    const res = await updateCredit(body.id, body.data)
    console.log('RES', res)
    return Response.json(res)
  } catch(ex:any) {
    console.error(ex)
    return Response.json({success:false, error:ex.message}, {status:500})
  }
}