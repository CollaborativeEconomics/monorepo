import { getDonations } from '@cfce/database';
import { auth } from '@cfce/utils';
import styles from '~/styles/dashboard.module.css';
import DonationsTable from './DonationsTable';

export default async function Page() {
  const session = await auth();
  const orgId = session?.orgId ?? '';
  const donations = await getDonations({ orgId: orgId });

  return (
    <div className={styles.content}>
      <DonationsTable data={donations} />
    </div>
  );
}
