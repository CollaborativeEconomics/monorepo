import { getDonations, newDonation } from '@cfce/database';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const user = url.searchParams.get('userId') || '';
    let res = null;
    if (user) {
      res = await getDonations({ userId: user });
      console.log('Response', res);
      return Response.json({ success: true, result: res });
    }
    res = await getDonations({});
    console.log('Response', res);
    return Response.json({ success: true, result: res });
  } catch (ex: any) {
    console.error(ex);
    return Response.json(
      { success: false, error: ex.message },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Donation', data);
    const res = await newDonation(data);
    console.log('Saved', res);
    return Response.json(res);
  } catch (ex) {
    console.error(ex);
    return Response.json(
      { success: false, error: ex.message },
      { status: 500 },
    );
  }
}
