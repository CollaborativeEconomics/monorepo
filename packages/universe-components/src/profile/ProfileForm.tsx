'use client';
import { LogoutButton } from '@cfce/auth';
import type {
  Prisma,
  DonationWithRelations as Donations,
  NFTDataWithRelations as Receipts,
  StoryWithRelations as Stories,
} from '@cfce/database';
import { StoryCardCompactVert } from '@cfce/universe-components/story';
import {
  DonationsTableSortable,
  ReceiptTableSortable,
} from '@cfce/universe-components/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@cfce/universe-components/ui';
import { chainConfig } from "@cfce/blockchain-tools";
import type { ChainSlugs } from '@cfce/types';
import { uploadFile } from '@cfce/utils';
import { v7 as uuidv7 } from "uuid";
import { imageUrl } from '@cfce/utils';
import { ImageIcon, LayoutList, Newspaper, Plus } from 'lucide-react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
//import { setUser } from '@cfce/database';

// TODO: move to database package?
type UserRecord = Prisma.UserGetPayload<{ include: { wallets: true } }>;
type UserBadges = Prisma.DonationGetPayload<{ include: { category: true } }>;
//type Receipts = Prisma.NFTDataGetPayload<{ include: { organization: true; initiative: true; user: true } }>
type DonationsByUser = Prisma.DonationGetPayload<{ include: { organization: true; initiative: true } }>;
type FavoriteOrganizations = Prisma.DonationGetPayload<{ include: { organization: true } }>;
//type Stories = Prisma.StoryGetPayload<{ include: { organization: true } }>

interface UserData {
  user: UserRecord;
  receipts: Receipts[];
  donations: Donations[];
  favoriteOrganizations: FavoriteOrganizations[];
  badges: UserBadges[];
  stories: Stories[];
}

export default function Profile({
  userId,
  userData,
}: {
  userId: string;
  userData: UserData;
}) {
  console.log('User ID', userId)
  //console.log('User DATA', userData)
  const user = userData.user;
  const receipts = userData.receipts;
  const donations = userData.donations;
  const favoriteOrganizations = userData.favoriteOrganizations;
  const badges = userData.badges;
  const stories = userData.stories;
  const nopic = '/media/nopic.png';

  async function saveImage(file: File) {
    console.log('IMAGE', file)
    //if(file){ return {error:'no image provided'} }
    const name = uuidv7()
    const body = new FormData()
    body.append('name', name)
    body.append('folder', 'avatars')
    body.append('file', file)
    const resp = await fetch('/api/upload', { method: 'POST', body })
    const result = await resp.json()
    return result
  }

  // Action to handle form submission
  async function handleSaveProfile(formData: FormData, userId: string) {
    const file = formData.get('file') as File | null;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    console.log(name, email);
    console.log({ file });
    let image = (formData.get('currentImage') as string) ?? '';
    if (file) {
      //const fileUploadResponse = await uploadFile({ file, name, folder: 'avatars' });
      const fileUploadResponse = await saveImage(file);
      if (fileUploadResponse.success) {
        image = fileUploadResponse.url ?? '';
      }
    }
    //const updatePayload = { name, email, image };
    //const updateData = await setUser(userId, updatePayload);

    //if (!updateData) {
    //  throw new Error('Error updating user data');
    //}

    const data = { name, email, image }
    console.log('USER', data)
    const res = await fetch(`/api/profile/${userId}`,{method:'post', body:JSON.stringify(data)})
    const inf = await res.json()
    console.log('INF', inf)
    //redirect(`/profile/${userId}`);
  }


  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between">
        {/* Avatar */}
        <div className="border rounded-md p-8 w-full lg:w-2/4 bg-card">
          <form action={formData => handleSaveProfile(formData, userId)}>
            <div className="flex flex-row flex-start items-center rounded-full">
              <div className="flex flex-col flex-start items-center rounded-full">
                <Image
                  className="mr-8 rounded-full"
                  src={imageUrl(user?.image) || nopic}
                  width={100}
                  height={100}
                  alt="Avatar"
                />
                <input type="file" name="file" className="mt-4 mr-4 w-[130px] text-wrap"/>
              </div>
              <div className="flex flex-col flex-start items-start w-full rounded-full">
                <input
                  type="text"
                  className="pl-4 w-full bg-transparent"
                  name="name"
                  defaultValue={user?.name || ''}
                  placeholder="name"
                />
                <input
                  type="text"
                  className="pl-4 w-full bg-transparent"
                  name="email"
                  defaultValue={user?.email || ''}
                  placeholder="email"
                />
                <input
                  type="hidden"
                  name="currentImage"
                  value={user?.image || ''}
                />
                <h2 className="mt-4">
                  Wallet:{' '}
                  {user?.wallet ? `${user.wallet.substr(0, 10)}...` : '?'}
                </h2>
              </div>
            </div>
            <div className="mt-4 text-right">
              {user && (
                <button
                  className="px-8 py-2 bg-blue-700 text-white rounded-full"
                  type="submit"
                >
                  Save
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Chains */}
        <div className="flex flex-col items-center border rounded-md mt-4 lg:mt-0 p-4 w-full lg:w-1/3 bg-card">
          {user?.wallets ? (
            <>
              <h1>Active Chains</h1>
              <div className="mt-4 pb-4 w-full border-b">
                {user?.wallets.map(item => {
                  return (
                    <span
                      key={item.id}
                      className="inline-block border rounded-full p-1 mx-1"
                    >
                      <Image
                        src={chainConfig[item.chain.toLowerCase() as ChainSlugs]?.icon}
                        width={48}
                        height={48}
                        alt="Chain"
                      />
                    </span>
                  );
                })}
                <span key={0} className="inline-block border rounded-full p-1">
                  <Plus size={48} className="text-gray-400" />
                </span>
              </div>
              <LogoutButton />
            </>
          ) : (
            <>
              <p>No wallets</p>
              <button type="button">Connect Wallet</button>
              <LogoutButton />
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
            {favoriteOrganizations?.length > 0 ? (
              favoriteOrganizations.map(donation => {
                const org = donation.organization;
                if (!org) {
                  return null;
                }
                return (
                  <div
                    key={org.id}
                    className="flex flex-row justify-start items-center content-center mt-4"
                  >
                    {org?.image && (
                      <Image
                        className="rounded-full mr-1"
                        src={imageUrl(org.image)}
                        width={64}
                        height={64}
                        alt="Organization"
                      />
                    )}
                    <h1 className="text-sm text-center">{org.name}</h1>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-300">None</div>
            )}
          </div>

          {/* Badges */}
          <h1 className="text-2xl font-medium mb-4">Badges</h1>
          <div className="grid grid-cols-4 gap-2 mb-8">
            {badges?.length > 0 ? (
              badges.map(donation => {
                const badge = donation.category;
                if (!badge || !badge?.image) {
                  return null;
                }
                return (
                  <Image
                    key={badge.id}
                    className="mr-1"
                    src={imageUrl(badge.image)}
                    width={72}
                    height={72}
                    alt="Badge"
                  />
                );
              })
            ) : (
              <div className="text-gray-300">None</div>
            )}
          </div>

          {/* Stories */}
          <h1 className="text-2xl font-medium mb-4">Recent Stories</h1>
          <div className="">
            {stories?.length > 0 ? (
              stories.map(story => {
                return (
                  <div className="my-4" key={story.id}>
                    <StoryCardCompactVert story={story} />
                  </div>
                );
              })
            ) : (
              <div className="text-gray-300">None</div>
            )}
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
                <ImageIcon size={32} className="pr-2 cursor-pointer" />
              </div>
            </div>
            <div className="w-full border rounded-md p-10 bg-card">
              {/* NFT Receipts */}
              <TabsContent className="TabsContent" value="tab1">
                <ReceiptTableSortable receipts={receipts} />
              </TabsContent>
              {/* Donations */}
              <TabsContent className="TabsContent" value="tab2">
                <DonationsTableSortable donations={donations} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </>
  );
}
