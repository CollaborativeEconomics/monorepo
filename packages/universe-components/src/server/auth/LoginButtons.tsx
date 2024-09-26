import 'server-only';
import type { AuthTypes, ChainSlugs } from '@cfce/types';
import { loginOrCreateUserFromWallet } from '@cfce/utils';
import { signIn } from 'next-auth/react';
import { AuthButton } from '../../client/auth/AuthButton';

interface LoginButtonsProps {
  chain: ChainSlugs;
  wallets: string[];
}

export default function LoginButtons({ chain, wallets }: LoginButtonsProps) {
  return (
    <>
      {wallets.map(wallet => (
        <AuthButton
          key={`auth-button-${chain}-${wallet}`}
          chain={chain}
          method={wallet as AuthTypes}
        />
      ))}
    </>
  );
}
