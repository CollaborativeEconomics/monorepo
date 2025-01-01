import { Suspense } from 'react';
import ContractCreditsClient from './credits-client';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

interface PageProps {
  //params: Promise<{ slug: string }>
  searchParams: SearchParams
}

export default async function ContractCreditsPage({ searchParams }: PageProps) {
  const { chain, network, wallet, organizationId } = await searchParams;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContractCreditsClient
        chain={chain?.toString() || 'Stellar'}
        network={network?.toString() || 'testnet'}
        wallet={wallet?.toString() || ''}
        organizationId={organizationId?.toString() || ''}
      />
    </Suspense>
  );
}
