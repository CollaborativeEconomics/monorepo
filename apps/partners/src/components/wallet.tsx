'use client';

import Image from 'next/image';

type WalletProps = {
  id: string;
  chain: string;
  network?: string|null;
  address: string;
  memo?: string|null;
  initiativeId?: string|null;
  initiatives?: {
    title?:string;
  }
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

const Wallet = (wallet:WalletProps) => {
  //console.log('INIT', item)
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-2xl font-bold">{wallet.chain}</h1>
          <p className="mr-4 grow text-sm text-right">{wallet.address}</p>
        <button
          type="button"
          onClick={() => {
            copyToClipboard(wallet.address ?? '');
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
        <div className="flex flex-row w-full">
          {wallet.initiatives &&
            <p className="text-gray-400">Initiative: {wallet.initiatives?.title}</p>
          }
          <p className="mr-8 grow text-sm text-right text-gray-400">{wallet.memo && `Memo: ${wallet.memo}`}</p>
        </div>
    </div>
  );
};

export default Wallet;
