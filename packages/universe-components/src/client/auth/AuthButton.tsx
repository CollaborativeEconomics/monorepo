import type { AuthTypes, ChainSlugs } from '@cfce/types';
import { authConfig, loginOrCreateUserFromWallet } from '@cfce/utils';
import { signIn } from 'next-auth/react';
import React from 'react';
import { Button } from '../../ui/button';

// TODO: extend with html button props, for some reason it was causing problems.
interface AuthButtonProps {
  method: AuthTypes;
  chain?: ChainSlugs;
}

export function AuthButton({ method, chain, ...props }: AuthButtonProps) {
  const config = authConfig[method];
  async function onLogin(method: AuthTypes, chain?: ChainSlugs) {
    console.log('LOGIN');
    switch (method) {
      case 'github':
        signIn('github');
        break;
      case 'google':
        signIn('google');
        break;
      default:
        if (!chain) {
          throw new Error('No chain provided');
        }
        loginOrCreateUserFromWallet({ chain });
    }
  }
  return (
    <Button {...props} onClick={() => onLogin(method, chain)}>
      <img src={config.icon} alt={`${config.name} Login Button`} />{' '}
      {config.name}
    </Button>
  );
}
