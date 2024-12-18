'use client';
import { useSession } from 'next-auth/react';
import React from 'react';
import styles from '~/styles/header.module.css';
import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';

export default function AuthHeader() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  return (
    <header className={styles.loginBox}>
      <noscript>
        <style>{'.nojs-show { opacity: 1; top: 0; }'}</style>
      </noscript>
      <div className={styles.signedInStatus}>
        <p
          className={`nojs-show ${
            !session && loading ? styles.loading : styles.loaded
          }`}
        >
          {!session && (
            <div className="flex justify-between">
              <div className={styles.notSignedInText}>
                You are not signed in
              </div>
              <SignInButton />
            </div>
          )}
          {session?.user && (
            <>
              {session.user.image && (
                <span
                  className={styles.avatar}
                  style={{ backgroundImage: `url('${session.user.image}')` }}
                />
              )}
              <span className={styles.signedInText}>
                <small>Signed in as</small>
                <br />
                <strong>{session.user.email ?? session.user.name}</strong>
              </span>
              <SignOutButton />
            </>
          )}
        </p>
      </div>
    </header>
  );
}
