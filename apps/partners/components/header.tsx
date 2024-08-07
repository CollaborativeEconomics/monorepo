import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import styles from 'styles/header.module.css'

export default function Header() {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  //console.log('SESSION', session)

  return (
    <header className={styles.loginBox}>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <div className={styles.signedInStatus}>
        <p className={`nojs-show ${!session && loading ? styles.loading : styles.loaded}`}>
          {!session && (
            <>
              <span className={styles.notSignedInText}>
                You are not signed in
              </span>
              <a
                href={`/api/auth/signin`}
                className={styles.buttonPrimary}
                onClick={(e) => {
                  e.preventDefault()
                  signIn()
                }}>Sign in</a>
            </>
          )}
          {session?.user && (
            <>
              {session.user.image && (
                <span className={styles.avatar} style={{ backgroundImage: `url('${session.user.image}')` }} />
              )}
              <span className={styles.signedInText}>
                <small>Signed in as</small>
                <br />
                <strong>{session.user.email ?? session.user.name}</strong>
              </span>
              <a
                href={`/api/auth/signout`}
                className={styles.button}
                onClick={(e) => {
                  e.preventDefault()
                  signOut()
                }}>Sign out</a>
            </>
          )}
        </p>
      </div>
    </header>
  )
}
