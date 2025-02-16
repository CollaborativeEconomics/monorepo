import { auth } from '@cfce/auth';
import { getDonations } from '@cfce/database';
import styles from '~/styles/dashboard.module.css';
import DonationsTable from './DonationsTable';

export default async function Page() {
  const session = await auth();
  const orgId = session?.orgId ?? '';
  const donations = await getDonations({ orgId: orgId });
  const donationsPlain = JSON.parse(JSON.stringify(donations))

  return (
    <div>
      <DonationsTable data={donationsPlain} />
    </div>
  );
}
