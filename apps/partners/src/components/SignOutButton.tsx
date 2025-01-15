'use client';
import { signOutAction } from '@cfce/auth';
import { redirect } from 'next/navigation';
import React from 'react';

interface SignOutButtonProps {
  className?: string;
}

export default function SignOutButton({ className }: SignOutButtonProps) {
  async function onSignout() {
    console.log('SIGNOUT');
    await signOutAction();
    window.location.href = '/';
    redirect('/');
  }

  return (
    <>
      <button type="button" onClick={onSignout} className={className}>
        Sign out
      </button>
    </>
  );
}
