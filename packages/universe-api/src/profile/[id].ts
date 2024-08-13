import {
  getDonations,
  getNftData,
  getStories,
  getUserById,
  setUser,
} from '@cfce/database';

export async function GET(
  request: Request,
  context: { params: { id: string } },
) {
  const id = context?.params?.id || '';
  try {
    const user = (await getUserById(id)) || null;
    if (!user) {
      console.log('PROFILE NOT FOUND', id);
      return Response.json({ error: 'User not found' });
    }
    const receipts = (await getNftData({ userId: id })) || [];
    const donations = (await getDonations({ userId: id })) || [];
    const favorgs = (await getDonations({ favs: id })) || [];
    const badges = (await getDonations({ badges: id })) || [];
    const stories = (await getStories({ recent: '5' })) || [];
    const data = { user, receipts, donations, favorgs, badges, stories };
    //console.log('PROFILE', data)
    return Response.json(data);
  } catch (ex) {
    console.error(ex);
    return Response.json({
      error: ex instanceof Error ? ex.message : 'Unknown error',
    });
  }
}

export async function POST(
  request: Request,
  context: { params: { id: string } },
) {
  const id = context?.params?.id || '';
  try {
    const body = await request.json();
    console.log('USER', body);
    const res = await setUser(id, body);
    console.log('UPDATED', res);
    return Response.json(res);
  } catch (ex) {
    console.error(ex);
    return Response.json(
      {
        success: false,
        error: ex instanceof Error ? ex.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
