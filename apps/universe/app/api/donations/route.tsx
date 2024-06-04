import { newDonation } from '@/lib/utils/registry'

export async function POST(request: Request) {
  const data = await request.json()
  console.log('Donation', data)
  const res = await newDonation(data)
  console.log('Saved', res)
  return Response.json(res)
}