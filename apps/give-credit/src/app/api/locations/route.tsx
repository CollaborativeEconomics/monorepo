import { getLocations } from '@/src/utils/registry'

export async function GET(request: Request) {
  const data = await getLocations() || []
  console.log('Locations', data)
  return Response.json(data)
}
