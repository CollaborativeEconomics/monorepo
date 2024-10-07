'use client';
import { signIn } from 'next-auth/react';
import React from 'react';

interface SignInButtonProps {
  className?: string;
}

export default function SignInButton({ className }: SignInButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={e => {
        e.preventDefault();
        signIn();
      }}
    >
      Sign in
    </button>
  );
}