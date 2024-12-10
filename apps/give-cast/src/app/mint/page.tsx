'use client';
import React from 'react';

const MintPage: React.FC = () => {
  return (
    <div>
      <h1>Mint Your NFT</h1>
      <p>Welcome to the NFT minting page!</p>
      <button type="button" onClick={addNFT}>
        Mint NFT
      </button>
      <div id="status" />
    </div>
  );
};

declare global {
  interface Window {
    ethereum: any; // or a more specific type if known
  }
}

async function addNFT() {
  const address = process.env.MINTER_CONTRACT;
  const image = 'https://give-cast.vercel.app/givecast.jpg';
  const symbol = 'GIVE';
  const decimals = 0;
  const tokenId = '1';

  if (typeof window.ethereum !== 'undefined') {
    try {
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC721',
          options: {
            address,
            image,
            symbol,
            decimals,
            tokenId,
          },
        },
      });
      if (wasAdded) {
        console.log('Thanks for your interest!');
      } else {
        console.log('Your loss!');
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default MintPage;
