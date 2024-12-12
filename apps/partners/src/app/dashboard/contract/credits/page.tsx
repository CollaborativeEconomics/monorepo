import { Suspense } from 'react';
import ContractCreditsClient from './credits-client';


interface PageProps {
  //params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

/*
interface SearchProps {
  searchParams: {
    chain?: string;
    network?: string;
    wallet?: string;
    organizationId?: string;
  }
}
*/

export default async function ContractCreditsPage({ searchParams }: PageProps) {
  const { chain, network, wallet, organizationId } = await searchParams;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContractCreditsClient
        chain={chain?.toString()}
        network={network?.toString()}
        wallet={wallet?.toString()}
        organizationId={organizationId?.toString()}
      />
    </Suspense>
  );
}
