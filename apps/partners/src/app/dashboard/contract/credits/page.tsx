import { Suspense } from 'react';
import type { ChainSlugs, Network } from '@cfce/types';
import ContractCreditsClient from './credits-client';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface PageProps {
  //params: Promise<{ slug: string }>
  searchParams: SearchParams;
}

export default async function ContractCreditsPage({ searchParams }: PageProps) {
  const { chain, network, wallet, organizationId } = await searchParams;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContractCreditsClient
        chain={(chain as ChainSlugs) ?? 'stellar'}
        network={(network as Network) ?? 'testnet'}
        wallet={(wallet as string) ?? ''}
        organizationId={organizationId as string}
      />
    </Suspense>
  );
}
