import { useState, useEffect } from 'react';
import { PropsWithChildren } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import styles from 'styles/dashboard.module.css';

interface PageProps {
  className?: string;
  afterChange?: Function;
}

const Sidebar = ({
  className,
  children,
  afterChange = id => {},
}: PropsWithChildren<PageProps>) => {
  const { data: session, status, update } = useSession();
  const loading = status === 'loading';
  console.log('SIDEBAR SESSION', session);
  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    async function loadData() {
      const data = await fetch('/api/organizations');
      const info = await data.json();
      console.log('ORGS', info);
      if (info.success) {
        setOrgs(info.result);
      }
    }
    loadData();
  }, []);

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
      {session?.isadmin && (
        <div className="w-full box-border">
          <select
            className="my-4 w-full box-border"
            value={session?.orgId}
            onChange={evt => {
              const orgId = evt.target.value;
              console.log('Changed', orgId);
              update({ orgId: orgId });
              afterChange(orgId);
            }}
          >
            {orgs ? (
              orgs.map(item => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))
            ) : (
              <option>No organizations...</option>
            )}
          </select>
        </div>
      )}
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
          <p
            className={`nojs-show ${!session && loading ? styles.loading : styles.loaded}`}
          >
            {!session && (
              <>
                <span className={styles.notSignedInText}>
                  You are not signed in
                </span>
                <a
                  href={`/api/auth/signin`}
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
                  <strong>{session.orgname ?? ''}</strong>
                  <br />
                  <small>{session.user.email ?? session.user.name}</small>
                </span>
                <a
                  href={`/api/auth/signout`}
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
