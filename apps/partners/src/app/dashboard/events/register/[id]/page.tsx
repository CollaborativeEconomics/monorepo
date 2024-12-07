import { getContract, getEventById } from '@cfce/database';
import { Suspense } from 'react';
import RegisterClient from './register-client';

export default async function RegisterPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { id } = params;
  const event = await getEventById(id);

  if (!event) {
    // TODO: Implement proper error handling or redirect
    return null;
  }

  const resNFT = await getContract(id, 'arbitrum', 'testnet', '1155');
  const contractNFT = resNFT.length > 0 ? resNFT[0] : null;

  if (!contractNFT) {
    return null;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterClient id={id} event={event} contractNFT={contractNFT} />
    </Suspense>
  );
}
