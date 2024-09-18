import { getDonations } from '@cfce/database';
import { getServerSession } from 'next-auth';
import DonationsTable from './DonationsTable';
import Dashboard from '~/components/dashboard';
import Sidebar from '~/components/sidebar';
import styles from '~/styles/dashboard.module.css';
import { authOptions } from '@cfce/utils';

export default async function Page() {
  const session = await getServerSession(authOptions);
  const orgId = session?.orgId ?? '';
  const donations = await getDonations({ orgId: orgId });

  async function onOrgChange(id: string) {
    console.log('ORG CHANGED', orgId, 'to', id);
  }

  return (
    <Dashboard>
      <Sidebar afterChange={onOrgChange} />
      <div className={styles.content}>
        <DonationsTable data={donations} />
      </div>
    </Dashboard>
  );
}
