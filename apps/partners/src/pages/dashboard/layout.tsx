import { Inter } from 'next/font/google';
import Dashboard from '~/components/dashboard';
import Session from '~/components/session';
import Sidebar from '~/components/sidebar';
import styles from '~/styles/dashboard.module.css';

const inter = Inter({ subsets: ['latin'] });

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Dashboard>
      <Sidebar />
      <div className={styles.content}>{children}</div>
    </Dashboard>
  );
}
