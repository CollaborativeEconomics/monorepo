import React from 'react';

import appConfig from '@cfce/app-config';
import { getChainConfiguration } from '@cfce/blockchain-tools';
import { AuthButton } from '@cfce/universe-components/client/auth';
import { authOptions } from '@cfce/utils';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from '@cfce/universe-components/ui';

export default async function Signin() {
  const session = await getServerSession(authOptions);
  console.log('session', session)
  // @ts-ignore: module augmentation is hard, TODO: fix this
  const userId = session?.user?.id;

  if (userId) {
    redirect(`/profile/${userId}`);
  }

  const chains = appConfig.chains;
  const chainConfigs = getChainConfiguration();

  return (
    <div className="container mx-auto mt-20">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Sign in
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(chains).map(([slug, { enabledWallets }], i) => {
            const chainConfig = chainConfigs[slug as keyof typeof chainConfigs];
            return (
              <div key={`auth-button-${slug}`}>
                {i > 0 && <Separator className="my-4" />}
                {enabledWallets.map(wallet => (
                  <AuthButton
                    key={wallet}
                    method={wallet}
                    chain={slug as keyof typeof chainConfigs}
                    config={{
                      name: wallet,
                      icon: chainConfig.icon,
                      slug: wallet,
                    }}
                    className="mb-2"
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
