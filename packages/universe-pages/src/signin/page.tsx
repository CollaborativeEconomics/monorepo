import React from 'react';

import appConfig from '@cfce/app-config';
import { getChainConfiguration } from '@cfce/blockchain-tools';
import type { ChainSlugs } from '@cfce/types';
import { LoginButtons } from '@cfce/universe-components/server/auth';
import { Divider } from '@cfce/universe-components/ui';
import { authOptions } from '@cfce/utils';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Signin() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (userId) {
    redirect(`/profile/${userId}`);
  }

  const chains = appConfig.chains;
  const chainConfigs = getChainConfiguration(chains.map(c => c.slug));

  return (
    <div className="w-[500px] mt-48 p-12 mx-auto rounded-xl border">
      <div className="mt-5">
        <div className="text-center flex flex-col justify-center items-center">
          <h2>Sign in:</h2>
          {chains.map(({ name, slug, wallets }, i) => {
            const chainConfig = chainConfigs[i];
            return (
              <div key={`auth-button-${slug}`}>
                <Divider />
                <img src={chainConfig.icon} alt={`${name} Login Button`} />
                <h3>{name}</h3>
                <LoginButtons chain={slug as ChainSlugs} wallets={wallets} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
