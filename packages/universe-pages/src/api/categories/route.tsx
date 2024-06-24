import { getCategoriesDistinct } from '@/utils/registry'

export async function GET(request: Request) {
  const url = new URL(request?.url)
  const q = url.searchParams.get('distinct') || 'all'
  const data = await getCategoriesDistinct(q)
  console.log('Categories', data)
  //console.log('Categories', data?.length)
  return Response.json(data)
}
