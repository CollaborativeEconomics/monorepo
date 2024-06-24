"use client"
import { useEffect, useState } from 'react'
import { signOut } from "next-auth/react"
import Image from 'next/image'
import Link from 'next/link'
import { Image as Picture, Newspaper, LayoutList } from 'lucide-react'
import { ListObject } from '@/components/ui/list-object'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
//import { Input } from '@/components/ui/input'
import TableReceiptsSort from '@/components/TableReceiptsSort'
import TableDonationsSort from '@/components/TableDonationsSort'
import StoryCardCompactVert from '@/components/StoryCardCompactVert'
import FileView from '@/components/form/fileview'
import NotFound from '@/components/NotFound'
//import { getUserById, getNFTsByAccount, getDonationsByUser, getFavoriteOrganizations, getUserBadges, getRecentStories } from '@/utils/registry'
import { coinFromChain } from '@/utils/chain'
import { getExtension } from '@/utils/extension'
import { randomString } from '@/utils/random'

type Dictionary = { [key: string]: any }

export default function Profile(props: any) {
  console.log('PROPS', props)
  const userid = props?.params?.id
  const search = props?.searchParams?.tab || 'receipts'

  //const receipts:[Dictionary]  = []
  //const donations:[Dictionary] = []
  //const favorgs:[Dictionary]   = []
  //const badges:[Dictionary]    = []
  //const stories:[Dictionary]   = []
  const nopic = '/media/nopic.png'

  const [user, setUser] = useState(null)
  const [receipts, setReceipts] = useState([])
  const [donations, setDonations] = useState([])
  const [favorgs, setFavorgs] = useState([])
  const [badges, setBadges] = useState([])
  const [stories, setStories] = useState([])
  const [button, setButton] = useState('Save')

  useEffect(()=>{
    async function getData(){
      const info = await fetch('/api/profile/'+userid)
      const data = await info.json()
      if(!data || data?.error){
        //return (<NotFound />)
        console.log('Error fetching user data')
        return
      }
      console.log('PROFILE', data)
      
      setUser(data.user)
      setReceipts(data.receipts)
      setDonations(data.donations)
      setFavorgs(data.favorgs)
      setBadges(data.badges)
      setStories(data.stories)
    }
    getData()
  }, [])

  //const {register, watch} = useForm()
  //const [name,email,image] = watch(['name','email','image'],['', '', '', '']);

  function getWallet(adr){
    return adr ? adr.substr(0,10)+'...' : '?'
  }
  function $(id){ return document.getElementById(id) as HTMLInputElement }

  async function saveImage(file) {
    console.log('IMAGE', file)
    //if(file){ return {error:'no image provided'} }
    const name = randomString(10)
    const body = new FormData()
    body.append('name', name)
    body.append('folder', 'avatars')
    body.append('file', file)
    const resp = await fetch('/api/upload', { method: 'POST', body })
    const result = await resp.json()
    return result
  }

  async function onSave(){
    console.log('Saving...')
    const name  = $('name').value
    const email = $('email').value
    const file  = $('file').files[0]
    console.log('Form', name, email, file)
    const rec = {name, email}
    // save image
    let image = user.image ?? ''
    if(file){
      const ok = await saveImage(file)
      console.log('UPLOADED', ok)
      if(ok?.error){
        console.log('Error uploading image')
      } else {
        image = ok.url
      }
    }
    if(image!==user?.image){ rec['image'] = image }
    // send form to server then save
    const opt = {
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rec)
    }
    const info = await fetch('/api/profile/'+userid, opt)
    const data = await info.json()
    if(!data || data?.error){
      console.log('Error updating user data')
      return
    }
    console.log('UPDATED', data)
    setButton('Saved')
    setTimeout(()=>{setButton('Save')},3000)
  }

  function logout(){
    signOut({ callbackUrl: '/' })
  }

  return (
    <main className="container min-h-screen flex flex-col items-stretch py-24 mt-24">
      <div className="flex flex-col lg:flex-row justify-between">

        {/* Avatar */}
        <div className="border rounded-md p-8 w-full lg:w-2/4 bg-card">
          <div className="flex flex-row flex-start items-center rounded-full">
            {/*<Image className="mr-8 rounded-full" src={user?.image||nopic} width={100} height={100} alt="Avatar" />*/}
            <FileView  id="file" source={user?.image||nopic} className="mr-4" />
            <div className="flex flex-col flex-start items-start w-full rounded-full">
              {/*<h1 className="font-bold text-lg">{user?.name}</h1>*/}
              {/*<h2 className="">{user?.email}</h2>*/}
              <input type="text" className="pl-4 w-full bg-transparent" id="name" defaultValue={user?.name||''} placeholder="name" />
              <input type="text" className="pl-4 w-full bg-transparent" id="email" defaultValue={user?.email||''} placeholder="email" />
              <h2 className="mt-4">Wallet: {getWallet(user?.wallet)}</h2>
            </div>
          </div>
          <div className="mt-4 text-right">
            { user && <button className="px-8 py-2 bg-blue-700 text-white rounded-full" onClick={onSave}>{button}</button> }
          </div>
        </div>

        {/* Chains */}
        <div className="flex flex-col items-center border rounded-md mt-4 lg:mt-0 p-4 w-full lg:w-1/3 bg-card">
          {user?.wallets ? (
            <>
              <h1>Active Chains</h1>
              <div className="mt-4 pb-4 w-full border-b">
                {user?.wallets.map((item:any)=>{
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
              <button className="block w-2/3 mt-4 mx-auto py-1 px-8 bg-red-400 text-white rounded-full" onClick={logout}>
                {/*<Link href="/api/auth/signout">Log Out</Link>*/}
                Log Out
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
      <div className="mt-12 flex flex-col lg:flex-row justify-between">

        {/* Sidebar */}
        <div className="w-full lg:w-1/4 mr-12">
          
          {/* Fav Orgs */}
          <h1 className="text-2xl font-medium mb-4">Favorite Organizations</h1>
          <div className="grid grid-cols-2 gap-2 mb-8">
          { favorgs?.length>0 ?
            favorgs.map((item:any)=>{
              const org = item.organization
              return (
                <div key={org.id} className="flex flex-row justify-start items-center content-center mt-4">
                  <Image className="rounded-full mr-1" src={org.image} width={64} height={64} alt="Organization" />
                  <h1 className="text-sm text-center">{org.name}</h1>
                </div>
              )
            })
            :
            <div className="text-gray-300">None</div>
          }
          </div>
          
          {/* Badges */}
          <h1 className="text-2xl font-medium mb-4">Badges</h1>
          <div className="grid grid-cols-4 gap-2 mb-8">
          { badges?.length>0 ?
            badges.map((item:any)=>{
              const badge = item.category
              return (<Image key={badge.id} className="mr-1" src={badge.image} width={72} height={72} alt="Badge" />)
            })
            :
            <div className="text-gray-300">None</div>
          }
          </div>

          {/* Stories */}
          <h1 className="text-2xl font-medium mb-4">Recent Stories</h1>
          <div className="">
          { stories?.length>0 ?
            stories.map((story:any)=>{
              return (
                <div className="my-4" key={story.id}>
                  <StoryCardCompactVert story={story} />
                </div>
              )
            })
            :
            <div className="text-gray-300">None</div>
          }
          </div>
        </div>

        {/* Table */}
        <div className="w-full lg:w-3/4">
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
            <div className="w-full border rounded-md p-10 bg-card">
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
