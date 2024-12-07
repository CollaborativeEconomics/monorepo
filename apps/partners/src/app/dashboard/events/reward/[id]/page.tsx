import { getContract, getEventById } from '@cfce/database';
import { Suspense } from 'react';
import { getReportedAddresses } from '~/utils/chainLogs';
import RewardClient from './reward-client';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function RewardPage({ params }: PageProps) {
  const { id } = params;
  const event = await getEventById(id);

  if (!event) {
    // Handle redirect in middleware or return not found
    return null;
  }

  const resNFT = await getContract(id, 'arbitrum', 'testnet', '1155');
  const contractNFT = resNFT.length > 0 ? resNFT[0] : null;

  if (!contractNFT) {
    return null;
  }

  const resV2E = await getContract(id, 'arbitrum', 'testnet', 'V2E');
  const contractV2E = resV2E.length > 0 ? resV2E[0] : null;

  if (
    !contractV2E ||
    !contractNFT.contract_address ||
    !contractNFT.start_block
  ) {
    return null;
  }

  const { data: volunteers } = await getReportedAddresses(
    contractNFT.contract_address,
    contractNFT.start_block,
  );

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
