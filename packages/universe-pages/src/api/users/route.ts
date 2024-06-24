import { getUserByWallet, newUser } from '@/utils/registry'

export async function GET(request: Request) {
  try {
    const requrl = new URL(request.url)
    const wallet = (requrl.searchParams.get('wallet') || '').toUpperCase()
    if(!wallet){ return Response.json({success:false, error:'Wallet not provided'}, {status:500}) }
    console.log('User Wallet', wallet)
    const res = await getUserByWallet(wallet)
    //console.log('Response', res)
    return Response.json({success:true, result:res})
  } catch(ex:any) {
    console.error(ex)
    return Response.json({success:false, error:ex.message}, {status:500})
  }
}

export async function POST(request: Request) {
  try {
    const body:any = await request.json()
    console.log('BODY', body)
    const res = await newUser(body)
    //console.log('Response', res)
    return Response.json(res)
  } catch(ex:any) {
    console.error(ex)
    return Response.json({success:false, error:ex.message}, {status:500})
  }
}