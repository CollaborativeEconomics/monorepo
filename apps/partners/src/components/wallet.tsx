'use client';

import Image from 'next/image';

interface WalletProps {
  id: string;
  chain?: string;
  address?: string;
  description?: string;
  status?: string; // 0.pending 1.approved 2.rejected
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(
    () => {
      console.log('Copytoclipboard', text);
    },
    err => {
      console.error('Error copying to clipboard:', err);
    },
  );
}

const Wallet = (item: WalletProps) => {
  return (
    <div className="flex flex-row justify-between items-center w-full">
      <h1 className="text-2xl font-bold">{item.chain}</h1>
      <p className="mr-4 grow text-sm text-right">{item.address}</p>
      <button
        type="button"
        onClick={() => {
          copyToClipboard(item.address ?? '');
        }}
      >
        <Image
          src="/media/icon-copy.png"
          width={16}
          height={16}
          alt="Copy address to clipboard"
        />
      </button>
    </div>
  );
};

export default Wallet;
