//"use client"
//import { googleLogin, signIn } from '@cfce/auth';
//import { Button } from '@cfce/components/ui';
import React from 'react';
import { signIn } from '@cfce/auth';

interface SignInButtonProps {
  className?: string;
}

export default function SignInButton({ className }: SignInButtonProps) {
  async function onSignIn(evt:Event){
    console.log('SIGNIN')
    evt.preventDefault();
    await signIn();
    //await signIn('google');
  }

  return (
    <>
      <a href={'/api/auth/signin'} className="" >Sign in</a>
    </>
  );
}
