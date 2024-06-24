import Image from 'next/image'
import Link from 'next/link'
import { Image as Picture, Newspaper, LayoutList } from 'lucide-react'
import { ListObject } from '@/components/ui/list-object'
import { coinFromChain } from '@/lib/utils/chain'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getUserById, getNFTsByAccount, getDonationsByUser, getFavoriteOrganizations, getUserBadges, getRecentStories } from '@/lib/utils/registry'
import TableReceiptsSort from '@/components/TableReceiptsSort'
import TableDonationsSort from '@/components/TableDonationsSort'
import StoryCardCompactVert from '@/components/StoryCardCompactVert'
import { NFTData, Donation, Organization, Category, Story, User } from '@/types/models'

export default async function Profile(props: {params:{userId:string}, searchParams:{tab:string}}) {
  const userid = props?.params?.userId || ''
  const search = props?.searchParams?.tab || 'receipts'
  const user:User = await getUserById(userid)
  if(!user){
    return (
      <main className="flex min-h-screen flex-col items-stretch container py-24">
        <h1 className="m-4">User not found</h1>
      </main>
    )
  }
  const receipts:NFTData[] = await getNFTsByAccount(userid) || []
  const donations:Donation[] = await getDonationsByUser(userid) || []
  const favorgs:Organization[] = await getFavoriteOrganizations(userid) || []
  const badges:Category[] = await getUserBadges(userid) || []
  const stories:Story[] = await getRecentStories(5) || []
  const nopic = '/media/nopic.png'

  return (
    <main className="flex min-h-screen flex-col items-stretch container py-24">
      <div className="flex flex-row justify-between">

        {/* Avatar */}
        <div className="border rounded-md p-8 w-1/3 bg-white">
          <div className="flex flex-row flex-start items-center rounded-full">
            <Image className="mr-8 rounded-full" src={user.image||nopic} width={100} height={100} alt="Avatar" />
            <div className="flex flex-col flex-start items-start rounded-full">
              <h1 className="font-bold text-lg">{user.name}</h1>
              <h2 className="">{user.email}</h2>
            </div>
          </div>
        </div>

        {/* Empty */}
        <div className="p-4 w-1/3">&nbsp;</div>

        {/* Chains */}
        <div className="flex flex-col items-center border rounded-md p-4 w-1/3 bg-white">
          {user.wallets ? (
            <>
              <h1>Active Chains</h1>
              <div className="mt-4 pb-4 w-full border-b">
                {user.wallets.map((item:any)=>{
                  return (
                    <span key={item.id} className="inline-block border rounded-full p-1 mx-1">
                      <Image src={'/coins/' + (coinFromChain(item.chain)||'none') + '.png'} width={48} height={48} alt="Chain" />
                    </span>
                  )
                })}
                <span key={0} className="inline-block border rounded-full p-1">
                  <Image src={'/coins/newcoin.png'} width={48} height={48} alt="New chain" />
                </span>
              </div>
              <button className="block w-2/3 mt-4 mx-auto py-1 px-8 bg-red-400 text-white rounded-full">
                <Link href="/api/auth/signout">Log Out</Link>
              </button>
            </>
          ) : (
            <>
              <p>No wallets</p>
              <button>Connect Wallet</button>
            </>
          )}
        </div>
      </div>

      {/* Mid Section */}
      <div className="mt-12 flex flex-row justify-between">

        {/* Sidebar */}
        <div className="w-1/4 mr-12">
          
          {/* Fav Orgs */}
          <h1 className="text-2xl font-medium">Favorite Organizations</h1>
          <div className="grid grid-cols-2 gap-2 mb-8">
            {favorgs.map((item:any)=>{
              const org = item.organization
              return (
                <div key={org.id} className="flex flex-row justify-start items-center content-center mt-4">
                  <Image className="rounded-full mr-1" src={org.image} width={64} height={64} alt="Organization" />
                  <h1 className="text-sm text-center">{org.name}</h1>
                </div>
              )
            })}
          </div>
          
          {/* Badges */}
          <h1 className="text-2xl font-medium mb-4">Badges</h1>
          <div className="grid grid-cols-4 gap-2 mb-8">
            {badges.map((item:any)=>{
              const badge = item.category
              return (<Image key={badge.id} className="mr-1" src={badge.image} width={72} height={72} alt="Badge" />)
            })}
          </div>

          {/* Stories */}
          <h1 className="text-2xl font-medium">Recent Stories</h1>
          <div className="">
            {stories.map((story:any)=>{
              return (
                <div className="my-4" key={story.id}>
                  <StoryCardCompactVert story={story} />
                </div>
              )
            })}
          </div>

        </div>

        {/* Table */}
        <div className="w-3/4">
          <h1 className="text-2xl font-medium mb-4">Donation Data</h1>
          <Tabs className="TabsRoot" defaultValue="tab1">
            <div className="flex flex-row justify-between items-center">
              <div className="mb-2">
                <TabsList className="TabsList" aria-label="Donations data">
                  <TabsTrigger className="TabsTrigger" value="tab1">
                    NFTs Receipts
                  </TabsTrigger>
                  <TabsTrigger className="TabsTrigger" value="tab2">
                    My Donations
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="flex flex-row">
                <Newspaper size={32} className="pr-2 cursor-pointer" />
                <LayoutList size={32} className="pr-2 cursor-pointer" />
                <Picture size={32} className="pr-2 cursor-pointer" />
              </div>
            </div>
            <div className="w-full border rounded-md p-10 bg-white">
              {/* NFTS Receipts */}
              <TabsContent className="TabsContent" value="tab1">
                <TableReceiptsSort receipts={receipts} />
              </TabsContent>
              {/* Donations */}
              <TabsContent className="TabsContent" value="tab2">
                <TableDonationsSort donations={donations} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
