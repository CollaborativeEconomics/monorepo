import React from 'react';

import { LogoutButton } from '@cfce/auth';
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
import { ProfileForm } from '@cfce/universe-components/profile';
import NotFound from '../../not-found';

type UserRecord = Prisma.UserGetPayload<{ include: { wallets: true } }>
type UserBadges = Prisma.DonationGetPayload<{ include: { category: true } }>
type Receipts = Prisma.NFTDataGetPayload<{ include: { organization: true; initiative: true; user: true } }>
type DonationsByUser = Prisma.DonationGetPayload<{include: { organization: true; initiative: true }}>
type FavoriteOrganizations = Prisma.DonationGetPayload<{ include: { organization: true } }>

// Server Action to fetch data
async function fetchUserData(userId: string) {
  // const response = await fetch(`/api/profile/${userId}`);
  // const data = await response.json();
  try {
    const user = (await getUserById(userId)) || ({} as UserRecord);
    const receipts = (await getNftData({ userId: userId })) || ([] as Receipts[]);
    const donations = (await getDonations({ userId: userId })) || ([] as DonationsByUser[]);
    const favoriteOrganizations = (await getDonations({ favs: userId })) || ([] as FavoriteOrganizations[]);
    const badges = (await getDonations({ badges: userId })) || ([] as UserBadges[]);
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
      `Error fetching user data: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
}


export default async function Profile({
  params,
  searchParams,
}: {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const userId:string = (await params).id || '';
  if (!userId) {
    return <NotFound />;
  }
  const userData = await fetchUserData(userId);
  const nopic = '/media/nopic.png';

  return (
    <main className="container min-h-screen flex flex-col items-stretch py-24 mt-24">
      <ProfileForm userId={userId} userData={userData} />
    </main>
  )
}
