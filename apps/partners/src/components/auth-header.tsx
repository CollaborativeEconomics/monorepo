'use client';
import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import styles from '~/styles/header.module.css';
//import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';

export default function AuthHeader() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  //const userImage = session?.user?.image ? `url('${session.user.image}')` : 'url(nopic.png)'

  return (
    <header className={styles.loginBox}>
      <noscript>
        <style>{'.nojs-show { opacity: 1; top: 0; }'}</style>
      </noscript>
      <div className={styles.signedInStatus}>
        <div
          className={`nojs-show ${!session && loading ? styles.loading : styles.loaded}`}
        >
          {!session && (
            <div className="flex flex-row justify-between" >
              <span className={styles.notSignedInText}>
                You are not signed in
              </span>
              {/* For some reason this doesn't work */}
              {/* Error: `headers` was called outside a request scope */}
              {/*<SignInButton /> */}
              <a
                href={'/api/auth/signin'}
                className=""
                onClick={(e) => {
                  e.preventDefault()
                  signIn()
                }}>Sign in</a>
            </div>
          )}
          {session?.user && (
            <div className="flex flex-row justify-between" >
              <div className="flex flex-row" >
                {session.user.image ? (
                  <span
                    className={styles.avatar}
                    style={{ backgroundImage: `url("${session.user.image}")` }}
                  />
                ) : (
                  <span
                    className={styles.avatar}
                    style={{ backgroundImage: "url(/nopic.png)" }}
                  />
                )
              }
                <div className="ml-3">
                  <p className="text-xs m-0 p-0">Signed in as</p>
                  <p className="font-bold m-0 p-0">{session.user.email ?? session.user.name}</p>
                </div>
              </div>
              <SignOutButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
