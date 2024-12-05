import React from 'react';
import { signIn } from '@cfce/auth';

interface SignInButtonProps {
  className?: string;
}

export default function SignInButton({ className }: SignInButtonProps) {
  async function onSignIn(evt){
    console.log('SIGNIN')
    evt.preventDefault();
    await signIn('google');
  }

  return (
    <>
      <a
        href={'/api/auth/signin'}
        className=""
        onClick={(e) => {
          e.preventDefault()
          signIn()
        }}>Sign in</a>

      {/*
      <button
        type="button"
        className={className}
        onClick={e => {onSignIn(e)}}
      >
        Sign in
      </button>
      */}
    </>
  );
}
