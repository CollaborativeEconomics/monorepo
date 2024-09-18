import Dashboard from '~/components/dashboard';
import Sidebar from '~/components/sidebar';
import styles from '~/styles/dashboard.module.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Dashboard>
      <Sidebar />
      <div className={styles.content}>{children}</div>
    </Dashboard>
  );
}
