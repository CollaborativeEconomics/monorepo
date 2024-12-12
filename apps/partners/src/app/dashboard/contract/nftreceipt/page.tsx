import { Suspense } from 'react';
import NFTReceiptClient from './nftreceipt-client';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function NFTReceiptPage({ searchParams }: PageProps) {
  const { chain, network, wallet, organizationId } = await searchParams;

  // Fetch organization data server-side if needed
  const organization = organizationId
    ? await fetch(`/api/organization?id=${organizationId}`).then(res =>
        res.json(),
      )
    : null;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NFTReceiptClient
        chain={chain?.toString()}
        network={network?.toString()}
        wallet={wallet?.toString()}
        organizationId={organizationId?.toString()}
        organization={organization}
      />
    </Suspense>
  );
}
