'use client';
import { signOut } from 'next-auth/react';
import React from 'react';

interface SignOutButtonProps {
  className?: string;
}

export default function SignOutButton({ className }: SignOutButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={e => {
        e.preventDefault();
        signOut();
      }}
    >
      Sign out
    </button>
  );
}
