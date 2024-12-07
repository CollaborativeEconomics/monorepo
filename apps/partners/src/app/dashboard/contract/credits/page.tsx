import { Suspense } from 'react';
import ContractCreditsClient from './credits-client';

export default async function ContractCreditsPage({
  searchParams,
}: {
  searchParams: {
    chain?: string;
    network?: string;
    wallet?: string;
    organizationId?: string;
  };
}) {
  const { chain, network, wallet, organizationId } = searchParams;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContractCreditsClient
        chain={chain}
        network={network}
        wallet={wallet}
        organizationId={organizationId}
      />
    </Suspense>
  );
}
