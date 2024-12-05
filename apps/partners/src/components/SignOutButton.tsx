import { signOutAction } from '@cfce/auth';
import React from 'react';

interface SignOutButtonProps {
  className?: string;
}

export default function SignOutButton({ className }: SignOutButtonProps) {
  async function onSignout(){
    console.log('SIGNOUT')
    await signOutAction()
    window.location.href='/'
  }

  return (
    <form action={onSignout}>
      <button type="submit" className={className}>
        Sign out
      </button>
    </form>
  );
}
