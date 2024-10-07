import 'server-only';
import type { AuthTypes, ChainSlugs } from '@cfce/types';
import { authConfig } from '@cfce/utils';
import { AuthButton } from '~/client/auth/AuthButton';

interface LoginButtonsProps {
  chain: ChainSlugs;
  wallets: string[];
}

export default function LoginButtons({ chain, wallets }: LoginButtonsProps) {
  return (
    <>
      {wallets.map(wallet => {
        const { name, icon, slug } = authConfig[wallet as AuthTypes];
        return (
          <AuthButton
            key={`auth-button-${chain}-${wallet}`}
            chain={chain}
            method={wallet as AuthTypes}
            config={{ name, icon, slug }}
          />
        );
      })}
    </>
  );
}
