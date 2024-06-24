import { newOrganization } from '@/utils/registry'

export async function POST(request: Request) {
  const body = await request.json()
  const result = await newOrganization(body)
  return Response.json(result)
}
