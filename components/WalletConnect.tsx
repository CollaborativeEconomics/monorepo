'use client';

import { useAccount, useConnectors } from '@starknet-react/core';
import { useState } from 'react';

export default function WalletConnect() {
  const { address } = useAccount();
  const { connect, connectors } = useConnectors();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async (connector: any) => {
    setIsConnecting(true);
    try {
      await connect(connector);
    } catch (error) {
      console.error(error);
    }
    setIsConnecting(false);
  };

  if (address) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 backdrop-blur-lg border border-gray-700">
        <p className="text-sm text-gray-400">Connected Wallet</p>
        <p className="font-mono text-green-400">{address}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold text-center">Connect Wallet</h2>
      <div className="flex gap-4">
        {connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => handleConnect(connector)}
            disabled={isConnecting}
            className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Connect {connector.id}
          </button>
        ))}
      </div>
    </div>
  );
} 