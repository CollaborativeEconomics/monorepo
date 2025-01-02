import { Suspense } from 'react';
import NFTReceiptClient from './nftreceipt-client';
import { getOrganizationById } from '~/actions/database'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

interface PageProps {
  //params: Promise<{ slug: string }>
  searchParams: SearchParams
}

export default async function NFTReceiptPage({ searchParams }: PageProps) {
  const { chain, network, wallet, organizationId } = await searchParams;
  const data = await getOrganizationById(organizationId?.toString() || '')
  const organization = JSON.parse(JSON.stringify(data))

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NFTReceiptClient
        chain={chain?.toString() || 'Stellar'}
        network={network?.toString() || 'testnet'}
        wallet={wallet?.toString() || ''}
        organizationId={organizationId?.toString() || ''}
        organization={organization}
      />
    </Suspense>
  );
}
