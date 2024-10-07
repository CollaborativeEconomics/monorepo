'use client';
import type { AuthTypes, ChainSlugs } from '@cfce/types';
import { loginOrCreateUserFromWallet } from '@cfce/utils';
import { signIn } from 'next-auth/react';
import { Button } from '~/ui/button';

interface AuthButtonProps {
  method: AuthTypes;
  chain?: ChainSlugs;
  config: {
    name: string;
    icon: string;
    slug: AuthTypes;
  };
  className?: string;
}

export function AuthButton({
  method,
  chain,
  config,
  className,
  ...props
}: AuthButtonProps) {
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
    <Button
      variant="outline"
      className={`w-full flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`}
      onClick={() => onLogin(method, chain)}
      {...props}
    >
      <img src={config.icon} alt={`${config.name} icon`} className="w-5 h-5" />
      <span>Continue with {config.name}</span>
    </Button>
  );
}
