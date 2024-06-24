import { NextResponse } from 'next/server';

// Fetch stellar rpc servers
// Returns payload result
// On error returns error:message
export default async function fetchLedger(query:string) {
  try {
    let url = (process.env.NEXT_PUBLIC_STELLAR_HORIZON||'')+query;
    console.log('FETCH', url)
    let options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    let result = await fetch(url, options);
    let data = await result.json();
    return data;
  } catch (ex:any) {
    console.error(ex);
    return { error: ex.message };
  }
}
