'use client';

import { auth, signIn, signOut } from '@cfce/utils';
import React from 'react';

export default async function LoginButton() {
  const session = await auth();
  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
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
