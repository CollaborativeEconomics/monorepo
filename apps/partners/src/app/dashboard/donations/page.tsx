import { getDonations } from '@cfce/database';
import { authOptions } from '@cfce/utils';
import { getServerSession } from 'next-auth';
import Dashboard from '~/components/dashboard';
import Sidebar from '~/components/sidebar';
import styles from '~/styles/dashboard.module.css';
import DonationsTable from './DonationsTable';

export default async function Page() {
  const session = await getServerSession(authOptions);
  const orgId = session?.orgId ?? '';
  const donations = await getDonations({ orgId: orgId });

  return (
    <div className={styles.content}>
      <DonationsTable data={donations} />
    </div>
  );
}
