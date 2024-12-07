import { Suspense } from 'react';
import NFTReceiptClient from './nftreceipt-client';

export default async function NFTReceiptPage({
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

  // Fetch organization data server-side if needed
  const organization = organizationId
    ? await fetch(`/api/organization?id=${organizationId}`).then(res =>
        res.json(),
      )
    : null;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NFTReceiptClient
        chain={chain}
        network={network}
        wallet={wallet}
        organizationId={organizationId}
        organization={organization}
      />
    </Suspense>
  );
}
