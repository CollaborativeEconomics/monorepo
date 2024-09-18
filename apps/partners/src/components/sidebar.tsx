import { getOrganizations } from '@cfce/database';
import { getServerSession } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';
import styles from '~/styles/dashboard.module.css';
import OrganizationSelect from './OrganizationSelect';
import { authOptions } from '@cfce/utils';

interface PageProps {
  className?: string;
  afterChange?: (orgId: string) => void;
}

const Sidebar = async ({
  className,
  children,
  afterChange = id => {},
}: PropsWithChildren<PageProps>) => {
  const session = await getServerSession(authOptions);
  console.log('SIDEBAR SESSION', session);
  const organizations = await getOrganizations({});

  return (
    <div className={styles.sidebar}>
      <div className={styles.logoBox}>
        <Link href="/dashboard" className={styles.logoLink}>
          <Image
            src="/give-logo.svg"
            alt="Give Logo"
            className={styles.logoImage}
            width={200}
            height={60}
          />
        </Link>
      </div>
      {session?.isAdmin && organizations?.length ? (
        <OrganizationSelect
          organizations={organizations}
          afterChange={afterChange}
        />
      ) : null}
      <nav className={styles.menu}>
        <li className={styles.menuItem}>
          <Link href="/dashboard/organization">New Organization</Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/dashboard/donations">Donations</Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/dashboard/initiatives">Initiatives</Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/dashboard/stories">Stories</Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/dashboard/wallets">Wallets</Link>
        </li>
      </nav>
      <div className={styles.loginBox}>
        <div className={styles.signedInStatus}>
          <p className={`nojs-show ${!session}`}>
            {!session && (
              <>
                <span className={styles.notSignedInText}>
                  You are not signed in
                </span>
                <a
                  href={'/api/auth/signin'}
                  className={styles.buttonPrimary}
                  onClick={e => {
                    e.preventDefault();
                    signIn();
                  }}
                >
                  Sign in
                </a>
              </>
            )}
            {session?.user && (
              <>
                {session.user.image && (
                  <span
                    style={{ backgroundImage: `url('${session.user.image}')` }}
                    className={styles.avatar}
                  />
                )}
                <span className={styles.signedInText}>
                  <strong>{session.orgName ?? ''}</strong>
                  <br />
                  <small>{session.user.email ?? session.user.name}</small>
                </span>
                <a
                  href={'/api/auth/signout'}
                  className={styles.button}
                  onClick={e => {
                    e.preventDefault();
                    signOut();
                  }}
                >
                  Sign out
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
