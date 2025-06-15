import { auth } from '@cfce/auth';
import { getDonations } from '@cfce/database';
import { verifyOrgAccess } from '~/utils/verifyOrgAccess';
import styles from '~/styles/dashboard.module.css';
import DonationsTable from './DonationsTable';

interface PageProps {
  params: Promise<{ orgId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { orgId } = await params;
  const session = await auth();
  if (!session || !session.user || !orgId || typeof session.user.id !== 'string') {
    // Defensive: redirect or throw if missing
    return null;
  }
  await verifyOrgAccess(session.user.id as string, orgId, !!session.isAdmin);
  const donations = await getDonations({ orgId });
  const donationsPlain = JSON.parse(JSON.stringify(donations));

  return (
    <div>
      <DonationsTable data={donationsPlain} />
    </div>
  );
}
