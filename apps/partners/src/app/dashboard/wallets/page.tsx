import { chainConfig } from '@cfce/blockchain-tools';
import { getOrganizationById } from '@cfce/database';
import type { ChainSlugs } from '@cfce/types';
import { auth } from '@cfce/utils';
import Title from '~/components/title';
import Wallet from '~/components/wallet';
import styles from '~/styles/dashboard.module.css';
import WalletForm from './WalletForm';

async function getWalletData(orgId: string) {
  const organization = await getOrganizationById(orgId);
  if (!organization) throw new Error('Organization not found');
  const wallets = organization.wallets || [];
  return { organization, wallets };
}

export default async function WalletsPage() {
  const session = await auth();
  const orgId = session?.orgId as string;
  if (!orgId) throw new Error('Not authorized');

  const { organization, wallets } = await getWalletData(orgId);
  const chainsList = (Object.keys(chainConfig) as ChainSlugs[]).map(chain => ({
    id: chainConfig[chain].slug,
    name: chainConfig[chain].name,
  }));

  return (
    <div className={styles.content}>
      <Title text="Wallets" />
      <p className={styles.intro}>
        Enter crypto wallets you&apos;d like to accept donations through.
        Wallets connected to your account will be verified for approval
      </p>
      <div className={styles.mainBox}>
        <WalletForm orgId={orgId} chains={chainsList} />
      </div>
      {wallets.length > 0 ? (
        wallets.map(item => (
          <div className={styles.mainBox} key={item.id}>
            <Wallet {...item} />
          </div>
        ))
      ) : (
        <h1 className="text-center text-2xl my-24">No wallets found</h1>
      )}
    </div>
  );
}
