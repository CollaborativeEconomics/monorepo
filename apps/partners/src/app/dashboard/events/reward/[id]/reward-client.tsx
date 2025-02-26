'use client';

import { abiVolunteersDistributor as DistributorAbi } from '@cfce/blockchain-tools';
import type { Contract, Event, Volunteer } from '@cfce/database';
import { waitForTransactionReceipt } from '@wagmi/core';
import { useState } from 'react';
import { useAccount, useConnect, useWriteContract, useEstimateGas } from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains';
import ButtonBlue from '~/components/buttonblue';
import Dashboard from '~/components/dashboard';
import Sidebar from '~/components/sidebar';
import Title from '~/components/title';
import styles from '~/styles/dashboard.module.css';
import type { getReportedAddresses } from '~/utils/chainLogs';
import { wagmiConfig, wagmiConnect, wagmiReconnect } from '~/utils/wagmiConfig';

const defaultChain = arbitrumSepolia;

interface RewardClientProps {
  id: string;
  event: Event;
  volunteers: Awaited<ReturnType<typeof getReportedAddresses>>['data'];
  contractNFT: Contract;
  contractV2E: Contract;
}

export default function RewardClient({
  id,
  event,
  volunteers,
  contractNFT,
  contractV2E,
}: RewardClientProps) {
  const [message, setMessage] = useState('Start the disbursement process');
  const { data: hash, writeContractAsync } = useWriteContract({
    config: wagmiConfig,
  });
  const { connectors, connect } = useConnect();
  const account = useAccount();

  const payrate = event?.payrate || 1;
  const unitlabel = event?.unitlabel || '';
  let total = 0;

  async function onSubmit() {
    const connected = await wagmiConnect();
    console.log('CONNECTED', connected);

    const nft = contractNFT.contract_address as `0x${string}`;
    const distributor = contractV2E.contract_address as `0x${string}`;

    if (!account.isConnected) {
      console.error('User not connected');
      setMessage('User not connected');
      return;
    }

    const estimateGas = await useEstimateGas({
      address: distributor,
      abi: DistributorAbi,
      functionName: 'distributeTokensByUnit' as const,
      args: [registered as `0x${string}`[]],
      chain: defaultChain,
    });

    console.log('ESTIMATE GAS', estimateGas);

    try {
      const registered = volunteers?.map(it => it.address);
      console.log('REGISTERED', registered)
      console.log('TX', {
        address: distributor,
        abi: DistributorAbi,
        functionName: 'distributeTokensByUnit' as const,
        args: [registered as `0x${string}`[]],
        chain: defaultChain,
        account: account.address,
      });
      
      const hash = await writeContractAsync({
        address: distributor,
        abi: DistributorAbi,
        functionName: 'distributeTokensByUnit' as const,
        args: [registered as `0x${string}`[]],
        chain: defaultChain,
        account: account.address,
      });

      const distributionReceipt = await waitForTransactionReceipt(wagmiConfig, {
        hash,
        confirmations: 2,
      });

      setMessage('Tokens distributed successfully');
    } catch (error) {
      console.error('Reward distribution error:', error);
      setMessage('Error distributing tokens');
    }
  }

  return (
    <div>
      <div className={styles.mainBox}>
        <Title text="VOLUNTEER TO EARN" />
        <h1>{event.name}</h1>
        <div className="w-full p-4 mt-2">
          <h1 className="my-2">Volunteers</h1>
          <table className="w-full">
            <thead>
              <tr className="text-slate-400">
                <th align="left">Address</th>
                <th align="right">Payment</th>
              </tr>
            </thead>
            <tbody className="border-t-2">
              {volunteers &&
                volunteers?.length > 0 &&
                volunteers.map((v, index) => {
                  total += Number(v.value) * Number(payrate);
                  return (
                    <tr key={`volunteer-${v.address}-${index}`}>
                      <td>{v.address}</td>
                      <td align="right">
                        ${(Number(v.value) * Number(payrate)).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
            <tfoot className="border-t-2">
              <tr>
                <td colSpan={2} align="right">
                  Total ${total}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div>
          <p>Contract: {contractV2E.contract_address}</p>
          <p className="text-slate-500">
            Be sure to fund the contract with USDC before rewarding volunteers
          </p>
        </div>
        <div className="w-full mb-2 flex flex-row justify-between">
          <ButtonBlue
            id="buttonSubmit"
            text="REWARD VOLUNTEERS"
            onClick={onSubmit}
          />
        </div>
        <p id="message" className="mb-6 center">
          {message}
        </p>
      </div>
    </div>
  );
}
