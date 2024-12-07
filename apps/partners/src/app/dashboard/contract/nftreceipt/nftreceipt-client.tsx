'use client';

import type { Contract, Organization } from '@cfce/database';
import { registryApi } from '@cfce/utils';
import { useEffect, useState } from 'react';
import ButtonBlue from '~/components/buttonblue';
import Dashboard from '~/components/dashboard';
import Title from '~/components/title';
import styles from '~/styles/dashboard.module.css';

interface NFTReceiptClientProps {
  chain?: string;
  network?: string;
  wallet?: string;
  organizationId?: string;
  organization?: Organization | null;
}

export default function NFTReceiptClient({
  chain,
  network,
  wallet,
  organizationId,
  organization,
}: NFTReceiptClientProps) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContracts() {
      try {
        setLoading(true);
        const query = [
          chain && `chain=${chain}`,
          network && `network=${network}`,
          wallet && `wallet=${wallet}`,
          organizationId && `organizationId=${organizationId}`,
        ]
          .filter(Boolean)
          .join('&');

        const response = await registryApi.get<Contract[]>(
          `contracts?${query}`,
        );
        if (response.error) {
          throw new Error(response.error);
        }
        setContracts(response);
      } catch (err) {
        console.error('Failed to fetch contracts:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch contracts',
        );
      } finally {
        setLoading(false);
      }
    }

    void fetchContracts();
  }, [chain, network, wallet, organizationId]);

  function onExport() {
    // TODO: implement export functionality
    console.log('Export clicked');
  }

  if (loading) {
    return <div>Loading NFT receipts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Dashboard>
      <div className={styles.content}>
        <div className={styles.mainBox}>
          <Title text="NFT RECEIPTS" />
          <div className="w-full p-4 mt-2">
            {organization && (
              <div className="mb-4">
                <h2 className="text-xl font-bold">{organization.name}</h2>
                <p className="text-gray-600">{organization.description}</p>
              </div>
            )}
            <table className="w-full">
              <thead>
                <tr className="text-slate-400">
                  <th align="left">Chain</th>
                  <th align="left">Network</th>
                  <th align="left">Contract</th>
                  <th align="left">Type</th>
                  <th align="left">Admin</th>
                  <th align="left">Token ID</th>
                </tr>
              </thead>
              <tbody className="border-t-2">
                {contracts.map(contract => (
                  <tr key={contract.id}>
                    <td>{contract.chain}</td>
                    <td>{contract.network}</td>
                    <td>{contract.contract_address}</td>
                    <td>{contract.contract_type}</td>
                    <td>{contract.admin_wallet_address}</td>
                    <td>{contract.token_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-full mb-2 flex flex-row justify-between">
            <ButtonBlue id="buttonExport" text="EXPORT" onClick={onExport} />
          </div>
        </div>
      </div>
    </Dashboard>
  );
}
