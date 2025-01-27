import { getContract, getEventById } from '@cfce/database';
import { Suspense } from 'react';
import { getReportedAddresses } from '~/utils/chainLogs';
import RewardClient from './reward-client';

interface PageProps {
  params: Promise<{ id: string }>
  //searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function RewardPage({ params }: PageProps) {
  const { id } = await params;
  const eventData = await getEventById(id);
  const event = JSON.parse(JSON.stringify(eventData))
  //console.log('EVENT', event)
  if (!event) {
    // TODO: Handle redirect in middleware or return not found
    return null;
  }

  const resNFT = await getContract(id, 'arbitrum', 'testnet', '1155');
  const contractNFT = resNFT.length > 0 ? resNFT[0] : null;
  //console.log('NFT-CTR', contractNFT)

  if (!contractNFT) {
    return null;
  }

  const resV2E = await getContract(id, 'arbitrum', 'testnet', 'V2E');
  const contractV2E = resV2E.length > 0 ? resV2E[0] : null;
  //console.log('V2E-CTR', contractV2E)

  if (!contractV2E ||!contractNFT.contract_address ||!contractNFT.start_block) {
    return null;
  }

  const { data: volunteers } = await getReportedAddresses(
    contractNFT.contract_address,
    contractNFT.start_block,
  );
  //console.log('VOLUNTEERS', volunteers)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RewardClient
        id={id}
        event={event}
        volunteers={volunteers}
        contractNFT={contractNFT}
        contractV2E={contractV2E}
      />
    </Suspense>
  );
}
