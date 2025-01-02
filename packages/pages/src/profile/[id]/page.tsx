import { ProfileForm } from '@cfce/components/client/profile';
import { UserDonationsTable, UserWallets } from '@cfce/components/profile';
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
        <Suspense fallback={<div>Loading profile...</div>}>
          <ProfileForm user={JSON.parse(JSON.stringify(user))} />
        </Suspense>
        <Suspense fallback={<div>Loading wallets...</div>}>
          <UserWallets wallets={JSON.parse(JSON.stringify(user.wallets))} />
        </Suspense>
      </div>

      <div className="mt-12 flex flex-col lg:flex-row justify-between">
        <div className="w-full lg:w-1/4 mr-12">
          <Suspense fallback={<div>Loading favorites...</div>}>
            <FavoriteOrganizations userId={userId} />
          </Suspense>
          <Suspense fallback={<div>Loading badges...</div>}>
            <Badges userId={userId} />
          </Suspense>
          <Suspense fallback={<div>Loading stories...</div>}>
            <RecentStories userId={userId} />
          </Suspense>
        </div>

        <UserDonationsTable userId={userId} />
      </div>
    </main>
  );
}
