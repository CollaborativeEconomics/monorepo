import { getUserWallets, newUserWallet } from '@/src/utils/registry'

export async function GET(request: Request) {
  try {
    const requrl = new URL(request.url)
    const userId = requrl.searchParams.get('userid') || ''
    const result = await getUserWallets(userId)
    return Response.json({ success: true, result })
  } catch (ex: any) {
    console.error(ex)
    return Response.json({ success: false, error: ex.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body: any = await request.json()
    console.log('BODY', body)
    const result = await newUserWallet(body)
    console.log('RESULT', result)
    console.log('Response', result)
    return Response.json({ success: true, result })
  } catch (ex: any) {
    console.error(ex)
    return Response.json({ success: false, error: ex.message }, { status: 500 })
  }
}
