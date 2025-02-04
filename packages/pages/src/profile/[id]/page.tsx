import React from 'react';
import { ProfileForm } from '@cfce/components/client/profile';
import { UserDonationsTable, UserWallets } from '@cfce/components/profile';
import {
  DonationsTableSkeleton,
  ProfileFormSkeleton,
  WalletsSkeleton,
  WidgetsSkeleton,
} from '@cfce/components/profile';
import {
  Badges,
  FavoriteOrganizations,
  RecentStories,
} from '@cfce/components/widgets';
import { getUserById } from '@cfce/database';
import { Suspense } from 'react';
import NotFound from '../../not-found';

export default async function Profile({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id: userId } = await params;
  if (!userId) return <NotFound />;

  const user = await getUserById(userId);
  if (!user) return <NotFound />;

  return (
    <main className="container min-h-screen flex flex-col items-stretch py-24 mt-24">
      <div className="flex flex-col lg:flex-row justify-between">
        <Suspense fallback={<ProfileFormSkeleton />}>
          <ProfileForm user={JSON.parse(JSON.stringify(user))} />
        </Suspense>
        <Suspense fallback={<WalletsSkeleton />}>
          <UserWallets wallets={JSON.parse(JSON.stringify(user.wallets))} />
        </Suspense>
      </div>

      <div className="mt-12 flex flex-col lg:flex-row justify-between">
        <div className="w-full lg:w-1/4 mr-12">
          <Suspense fallback={<WidgetsSkeleton />}>
            <FavoriteOrganizations userId={userId} />
            <Badges userId={userId} />
            <RecentStories userId={userId} />
          </Suspense>
        </div>

        <Suspense fallback={<DonationsTableSkeleton />}>
          <UserDonationsTable userId={userId} />
        </Suspense>
      </div>
    </main>
  );
}
