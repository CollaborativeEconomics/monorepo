'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import React from 'react';

export default function LoginButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()} type="button">
          Sign out
        </button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()} type="button">
        Sign in
      </button>
    </>
  );
}
