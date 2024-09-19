import { type Initiative, getOrganizationById } from '@cfce/database';
import { authOptions } from '@cfce/utils';
import { getServerSession } from 'next-auth';
import InitiativeCard from '~/components/InitiativeCard';
import Dashboard from '~/components/dashboard';
import Sidebar from '~/components/sidebar';
import Title from '~/components/title';
import styles from '~/styles/dashboard.module.css';
import InitiativeForm from './InitiativeForm';

export default async function Page() {
  const session = await getServerSession(authOptions);
  const orgId = session?.orgId || '';

  const organization = await getOrganizationById(orgId);

  const initiatives = organization?.initiative || [];

  return (
    <Dashboard>
      <Sidebar />
      <div className={styles.content}>
        <Title text="Create a Funding Initiative" />
        <p className={styles.intro}>
          Creating an initiative allows donors to contribute to a specific
          campaign. This helps get your donors excited about the impact they can
          make, and helps them visualize how they&apos;ll make the world a
          better place!
        </p>
        <div className={styles.mainBox}>
          <InitiativeForm orgId={orgId} />
        </div>
        {initiatives.length > 0 ? (
          initiatives.map((item: Initiative) => (
            <div className={styles.mainBox} key={item.id}>
              <InitiativeCard key={item.id} {...item} />
            </div>
          ))
        ) : (
          <h1 className="text-center text-2xl my-24">No initiatives found</h1>
        )}
      </div>
    </Dashboard>
  );
}
