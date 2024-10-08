import React from 'react';

import {
  type NFTData,
  type Prisma,
  type Story,
  getDonations,
  getNftData,
  getStories,
  getUserById,
  setUser,
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
import { uploadFile } from '@cfce/utils';
import { ImageIcon, LayoutList, Newspaper, Plus } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import NotFound from '../../not-found';

// Server Action to fetch data
async function fetchUserData(userId: string) {
  // const response = await fetch(`/api/profile/${userId}`);
  // const data = await response.json();
  try {
    const user =
      (await getUserById(userId)) ||
      ({} as Prisma.UserGetPayload<{ include: { wallets: true } }>);
    const receipts =
      (await getNftData({ userId: userId })) || ([] as NFTData[]);
    const donations =
      (await getDonations({ userId: userId })) ||
      ([] as Prisma.DonationGetPayload<{
        include: { organization: true; initiative: true };
      }>[]);
    const favoriteOrganizations =
      (await getDonations({ favs: userId })) ||
      ([] as Prisma.DonationGetPayload<{ include: { organization: true } }>[]);
    const badges =
      (await getDonations({ badges: userId })) ||
      ([] as Prisma.DonationGetPayload<{ include: { category: true } }>[]);
    const stories = (await getStories({ recent: 5 })) || ([] as Story[]);
    return {
      user,
      receipts,
      donations,
      favoriteOrganizations,
      badges,
      stories,
    };
  } catch (error) {
    throw new Error(
      `Error fetching user data: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

// Server Action to handle form submission
async function handleSaveProfile(formData: FormData, userId: string) {
  const file = formData.get('file') as File | null;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  let image = (formData.get('currentImage') as string) ?? '';

  if (file) {
    const fileUploadResponse = await uploadFile({
      file,
      name,
      folder: 'avatars',
    });
    if (fileUploadResponse.success) {
      image = fileUploadResponse.result?.url ?? '';
    }
  }

  const updatePayload = { name, email, image };
  const updateData = await setUser(userId, updatePayload);

  if (!updateData) {
    throw new Error('Error updating user data');
  }

  redirect('/profile');
}

export default async function Profile({
  params: { id: userId },
  searchParams: { tab = 'receipts' },
}: {
  params: { id?: string };
  searchParams: { tab?: string };
}) {
  if (!userId) {
    return <NotFound />;
  }
  const { user, receipts, donations, favoriteOrganizations, badges, stories } =
    await fetchUserData(userId);

  const nopic = '/media/nopic.png';

  return (
    <main className="container min-h-screen flex flex-col items-stretch py-24 mt-24">
      <div className="flex flex-col lg:flex-row justify-between">
        {/* Avatar */}
        <div className="border rounded-md p-8 w-full lg:w-2/4 bg-card">
          <form
            action={formData => handleSaveProfile(formData, userId)}
            method="post"
            encType="multipart/form-data"
          >
            <div className="flex flex-row flex-start items-center rounded-full">
              <Image
                className="mr-8 rounded-full"
                src={user?.image || nopic}
                width={100}
                height={100}
                alt="Avatar"
              />
              <input type="file" name="file" className="mr-4" />
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
                        src={
                          // chainConfig[item.chain.toLowerCase() as ChainSlugs]
                          //   ?.icon
                          ''
                        }
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
              <button
                type="button"
                className="block w-2/3 mt-4 mx-auto py-1 px-8 bg-red-400 text-white rounded-full"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <p>No wallets</p>
              <button type="button">Connect Wallet</button>
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
                        src={org.image}
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
                    src={badge.image}
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
    </main>
  );
}
