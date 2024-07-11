'use client';
import { useContext, useState } from 'react';
import Image from 'next/image';
import { TimestampToDateString } from '@/src/components/ui/date-posted';
import { ReceiptStatus } from '@/src/components/ui/receipt-status';
import { ClaimButton } from '@/src/components/ui/button';
import { NFTReceiptText } from '@/src/components/NFTReceipt/NFTReceiptText';
import { DonationContext } from '@/src/components/DonationView';
import money from '@/src/utils/money';
//import Chains from '@/libs/chains/client/apis'

export default function NFTReceipt(props: any) {
  const receipt = props.data;
  const { donation, setDonation } = useContext(DonationContext);
  const [ message, setMessage ] = useState('Claim your NFT');
  const [ disabled, setDisabled ] = useState(true);
  //console.log('Receipt:', receipt)
  //console.log('Donation', donation)

  async function mintNFT(
    txid: string,
    initid: string,
    donor: string,
    destin: string,
    amount: number,
    rate: number,
  ) {
    console.log(
      'Minting NFT, wait...',
      txid,
      initid,
      donor,
      destin,
      amount,
      rate,
    );
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ txid, initid, donor, destin, amount, rate }),
    };
    const response = await fetch('/api/nft/mint', options);
    //console.log('Minting response', response)
    const result = await response.json();
    console.log('>Result', result);
    if (!result.success) {
      console.error('Error', result.error);
      //setMessage('Error minting NFT')
      return { success: false, error: 'Error minting NFT' };
    }
    return result;
  }

  async function claimNFT() {
    if (donation.status !== 'Claim') {
      return;
    }
    console.log('Claiming...', donation);
    //setDisabled(true)
    const state = structuredClone(donation)
    state.status = 'Minting'
    setDonation(state)
    setMessage('Minting NFT, wait a moment...');
    const minted = await mintNFT(
      donation.txid,
      donation.initiativeId,
      donation.donor.address,
      donation.receiver,
      donation.amount,
      donation.rate,
    );
    const result = structuredClone(donation);
    if (minted?.success) {
      result.status = 'Minted';
      setDonation(result);
      setMessage('NFT minted successfully!');
    } else {
      result.status = 'Failed';
      setDonation(result);
      setMessage('Minting NFT failed!');
    }
  }

  return (
    <div
      className="flex min-h-full w-full"
      style={{
        'mask':
          'conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg) 50%/20px 100%',
      }}
    >
      <div className="relative bg-card p-6 h-auto shadow-2xl border dark:border-slate-600">
        <div className="border-dotted border-t-2 border-b-2 p-2">
          <h3 className="text-3xl font-semibold uppercase text-center text-gray-500 dark:text-white">
            NFT Receipt
          </h3>
        </div>
        <div className="relative my-4 w-full h-48">
          <Image
            src={donation.image}
            alt="IMG BG"
            fill
            style={{
              objectFit: 'cover',
            }}
          />
        </div>
        <ReceiptStatus status={donation.status} />

        <div className="p-2">
          <TimestampToDateString
            className="pt-2 text-sm text-right font-bold text-gray-500 dark:text-white"
            timestamp={donation.date}
          />
          <NFTReceiptText>{donation.organization.name}</NFTReceiptText>
          <NFTReceiptText className="font-normal">
            EIN: {donation.organization.ein}
          </NFTReceiptText>
          <NFTReceiptText className="font-normal whitespace-pre">
            {donation.organization.address}
          </NFTReceiptText>
          <div className="flex flex-row justify-between items-center pt-6">
            <NFTReceiptText>Donation amount</NFTReceiptText>
            <div className="flex border-dotted border-t-2 border-gray-300 w-full"></div>
            <NFTReceiptText>
              {money(donation.amount, 2)} {donation.ticker}*
            </NFTReceiptText>
          </div>
          <NFTReceiptText className="font-normal whitespace-normal">
            *{donation.ticker} is a publicly traded crypto-currency with a
            direct monetary value
          </NFTReceiptText>
          <div className="flex flex-row justify-between items-center pt-6">
            <NFTReceiptText>Monetary Value*</NFTReceiptText>
            <div className="flex border-dotted border-t-2 border-gray-300 w-full"></div>
            <NFTReceiptText>
              {money(donation.amountFiat, 2)} {donation.fiatCurrencyCode}
            </NFTReceiptText>
          </div>
          <NFTReceiptText className="font-normal pt-0">
            *At the time of transaction
          </NFTReceiptText>

          <div className="border-dotted border-t-2 border-b-2 border-gray-300 mt-6 py-2">
            <div className="flex flex-row justify-between">
              <NFTReceiptText>Donated By</NFTReceiptText>
              <NFTReceiptText>{donation.donor.name}</NFTReceiptText>
            </div>
          </div>
          <NFTReceiptText className="font-normal pt-2 pt-4 whitespace-normal">
            No goods or services were provided in exchange for this
            contribution. {donation.organization.name} is a tax-exempt 501(c)(3)
            organization.
          </NFTReceiptText>
          <ClaimButton status={donation.status} onClick={claimNFT} />
          <NFTReceiptText className="font-normal text-center pt-2 pt-4 whitespace-normal">
            {message}
          </NFTReceiptText>
        </div>
      </div>
    </div>
  );
}
