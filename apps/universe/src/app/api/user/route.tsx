import { getUserByWallet } from '@/lib/utils/registry'

export async function GET(request: Request) {
  const requrl = new URL(request.url)
  const wallet = (requrl.searchParams.get('wallet') || '').toUpperCase()
  if(!wallet){ return Response.json({success:false, error:'Wallet not provided'}, {status:500}) }
  console.log('User Wallet', wallet)
  const res = await getUserByWallet(wallet)
  console.log('Response', res)
  return Response.json({success:true, result:res})
}