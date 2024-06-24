import emailReceipt from '@/lib/utils/mailgun'

export async function POST(request: Request) {
  const data = await request.json()
  const now = new Date().toLocaleString('en-EN', { year: 'numeric', month: 'long', day: 'numeric' })
  const receipt = {
    address: data.address || '',
    coinSymbol: data.currency || '',
    coinValue: data.amount || '',
    date: now,
    donorName: data.name || '',
    ein: data.ein || '',
    organizationName: data.org || '',
    usdValue: data.usd || ''
  }
  //console.log('Sending receipt to', data.email)
  //console.log('Receipt info', receipt)
  emailReceipt(data.email, receipt)
  return Response.json({success:true})
}
