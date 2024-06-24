// @deprecated
// Possibly unused, consider removing
export async function GET(request: Request) {
  const requrl = new URL(request.url)
  const url = requrl.searchParams.get('url') || ''
  if(!url){
    return Response.json({ error: 'Metadata url not provided' }, {status:400});
  }
  try {
    const result = await fetch(url);
    const metadata = await result.json();
    //console.log('Metadata', metadata)
    return Response.json(metadata);
  } catch (ex:any) {
    console.error(ex);
    return Response.json({ error: 'Error fetching metadata' }, {status:500});
  }
}
