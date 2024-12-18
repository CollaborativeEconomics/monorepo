'use client';
import { googleLogin, signIn } from '@cfce/auth';
import { Button } from '@cfce/universe-components/ui';
import React from 'react';

interface SignInButtonProps {
  className?: string;
}

export default function SignInButton({ className }: SignInButtonProps) {
  return (
    <Button
      type="button"
      className={className}
      onClick={e => {
        console.log('sign in');
        e.preventDefault();
        googleLogin();
      }}
    >
      Sign in
    </Button>
  );
}
