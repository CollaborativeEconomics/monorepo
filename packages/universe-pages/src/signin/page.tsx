'use client';
import appConfig from '@cfce/app-config';
import { getChainConfiguration } from '@cfce/blockchain-tools';
import type { AuthTypes, ChainSlugs } from '@cfce/types';
import { AuthButton, Divider } from '@cfce/universe-components/ui';
import { appSettingsAtom, loginOrCreateUserFromWallet } from '@cfce/utils';
import { useAtomValue } from 'jotai';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Signin() {
  const router = useRouter();
  const { userId, walletAddress } = useAtomValue(appSettingsAtom);
  const authConfig = appConfig.auth;
  const chains = appConfig.chains;
  const chainConfigs = getChainConfiguration(chains.map(c => c.slug));

  useEffect(() => {
    if (userId) {
      router.push(`/profile/${userId}`);
    }
  }, [userId, router]);

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
    <div className="w-[500px] mt-48 p-12 mx-auto rounded-xl border">
      <div className="mt-5">
        <div className="text-center flex flex-col justify-center items-center">
          <h2>Sign in:</h2>
          {chains.map(({ name, slug, wallets }, i) => {
            // const walletConfig = getWalletConfiguration(wallets);
            const chainConfig = chainConfigs[i];
            return (
              <div key={`auth-button-${slug}`}>
                <Divider />
                <img src={'chainConfig.icon'} alt={`${name} Login Button`} />
                <h3>{name}</h3>
                {wallets.map(wallet => {
                  return (
                    <AuthButton
                      onClick={onLogin}
                      key={`auth-button-${slug}-${wallet}`}
                      chain={slug}
                      method={wallet}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
