import { getCategories } from '@cfce/database';

export async function GET(request: Request) {
  const url = new URL(request?.url);
  const distinct = url.searchParams.get('distinct') || 'all';
  const data = await getCategories({ distinct });
  console.log('Categories', data);
  //console.log('Categories', data?.length)
  return Response.json(data);
}
