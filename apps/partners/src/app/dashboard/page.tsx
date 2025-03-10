import Dashboard from '~/components/dashboard';
import Sidebar from '~/components/sidebar';
import Title from '~/components/title';
import styles from '~/styles/dashboard.module.css';

export default function Page() {
  return (
    <div>
      <div className={styles.intro}>
        <Title text="DASHBOARD" />
        <div className={styles.dashBox}>
          <li>Monitor your crypto donations</li>
          <li>Create funding initiatives</li>
          <li>Update donors by creating Story NFTs</li>
          <li>Add or change crypto-wallets</li>
        </div>
      </div>
    </div>
  );
}
