import React from 'react';

import appConfig from '@cfce/app-config';
import { AuthButton, auth } from '@cfce/auth';
import { getChainConfiguration } from '@cfce/blockchain-tools';
import type { ChainSlugs } from '@cfce/types';
import { redirect } from 'next/navigation';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from '@cfce/universe-components/ui';

export default async function Signin() {
  //console.log('SIGN IN...')
  const session = await auth();
  //console.log('SESSION', session)

  // @ts-ignore: module augmentation is hard, TODO: fix this
  const userId = session?.user?.id;

  if (userId) {
    redirect(`/profile/${userId}`);
  }

  const chains = appConfig.chains;
  console.log({ chains });
  const chainConfigs = getChainConfiguration();

  return (
    <div className="container mx-auto mt-20">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Sign in
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          {Object.entries(chains).map(([slug, { enabledWallets }], i) => {
            const chainConfig = chainConfigs[slug as ChainSlugs];
            return (
              <div key={`auth-button-${slug} w-full flex`}>
                {i > 0 && <Separator className="my-4" />}
                {enabledWallets.map(wallet => (
                  <AuthButton
                    className="w-full"
                    key={wallet}
                    method={wallet}
                    chain={slug as ChainSlugs}
                  />
                ))}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
