import { getUserById, getNFTsByAccount, getDonationsByUser, getFavoriteOrganizations, getUserBadges, getRecentStories, updateUser } from '@/utils/registry'


export async function GET(request:Request, context:any) {
  const id = context?.params?.id || ''
  try {
    const user = await getUserById(id) || null
    if(!user || user?.error){
      console.log('PROFILE NOT FOUND', id)
      return Response.json({error:'User not found'})
    }
    const receipts  = await getNFTsByAccount(id) || []
    const donations = await getDonationsByUser(id) || []
    const favorgs   = await getFavoriteOrganizations(id) || []
    const badges    = await getUserBadges(id) || []
    const stories   = await getRecentStories(5) || []
    const data = { user, receipts, donations, favorgs, badges, stories }
    //console.log('PROFILE', data)
    return Response.json(data)
  } catch(ex) {
    console.error(ex)
    return Response.json({error:ex.message})
  }
}

export async function POST(request:Request, context:any) {
  const id = context?.params?.id || ''
  try {
    const body:any = await request.json()
    console.log('USER', body)
    const res = await updateUser(id, body)
    console.log('UPDATED', res)
    return Response.json(res)
  } catch(ex:any) {
    console.error(ex)
    return Response.json({success:false, error:ex.message}, {status:500})
  }
}