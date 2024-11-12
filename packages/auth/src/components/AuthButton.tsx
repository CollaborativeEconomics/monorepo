'use client';
import type { AuthTypes, ChainSlugs } from '@cfce/types';
import { GithubLoginButton } from './GithubLoginButton';
import { GoogleLoginButton } from './GoogleLoginButton';
import { WalletLoginButton } from './WalletLoginButton';

interface AuthButtonProps {
  method: AuthTypes;
  chain?: ChainSlugs;
  className?: string;
}

export function AuthButton({ method, chain, className }: AuthButtonProps) {
  switch (method) {
    case 'github':
      return <GithubLoginButton className={className} />;
    case 'google':
      return <GoogleLoginButton className={className} />;
    default: {
      if (typeof chain === 'undefined') {
        throw new Error('Chain is required for wallet login');
      }
      return (
        <WalletLoginButton
          chain={chain}
          method={method}
          className={className}
        />
      );
    }
  }
}
