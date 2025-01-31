import { auth } from '@cfce/auth';
import { redirect } from 'next/navigation'
import Dashboard from '~/components/dashboard';
import Sidebar from '~/components/sidebar';
import styles from '~/styles/dashboard.module.css';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <Dashboard>
      <Sidebar />
      <div className={styles.content}>{children}</div>
    </Dashboard>
  );
}
