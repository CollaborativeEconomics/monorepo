'use client'
import { useContext, useState } from 'react'
import Image from 'next/image'
import { DonationContext } from '@/components/DonationView'
import { TimestampToDateString } from '@/components/ui/date-posted'
import { ClaimButton } from '@/components/ui/claim-button'
import { ReceiptStatus } from '@/components/ui/receipt-status'
import { NFTReceiptText } from '@/components/NFTReceipt/NFTReceiptText'
import Chains from '@/lib/chains/client/apis'
import decimalString from '@/lib/utils/decimalString'
import Receipt from '@/types/receipt'

export default function NFTReceipt(props: { receipt: Receipt }) {
  const receipt = props.receipt
  const { donation, setDonation } = useContext(DonationContext)
  const [message, setMessage] = useState('Claim your NFT')
  //console.log('Donation', donation)
  //console.log('Receipt:', receipt)

  // Offer only for XRPL
  async function createOffer(tokenid: string, address: string) {
    setMessage('Generating NFT offer, wait a moment...')
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chain: 'XRPL', tokenid, address }),
    }
    const response = await fetch('/api/nft/offer', options)
    //console.log('Offer response', response)
    if (!response) {
      console.log('No offer response')
      return { success: false, error: 'Error creating sell offer' }
    }
    const result = await response.json()
    console.log('Offer result', result)
    return result
  }

  // Offer only for XRPL
  async function acceptOffer(
    offerid: string,
    address: string,
    txid: string,
    tokenId: string,
    image: string,
    metadata: string
  ) {
    setMessage('Check your Xaman wallet events for NFT offer')
    Chains['XRPL'].acceptSellOffer(offerid, address, (result: any) => {
      console.log('RESULT', result)
      if (result?.error) {
        console.log('Error accepting offer', result.error)
        setMessage('Error accepting offer')
        return { success: false, error: 'Error accepting offer' }
      }
      if (result?.success == false) {
        console.log('Offer rejected')
        setMessage('Offer rejected by user')
        return { success: false, error: 'Offer rejected by user' }
      }
      //setMessage('NFT minted successfully')
      //setMessage(`NFT minted successfully • <a href="${result.image}" target="_blank">Image</a> • <a href="${result.metadata}" target="_blank">Meta</a>`)
      //router.push(`/donation_confirmation?ok=true&chain=${chain}&txid=${txid}&nft=true&nftid=${encodeURIComponent(tokenId)}&urinft=${encodeURIComponent(image)}&urimeta=${encodeURIComponent(metadata)}`)
      return { success: true, error: 'Offer rejected by user' }
    })
  }

  async function mintNFT(
    chain: string,
    txid: string,
    address: string,
    itag: string,
    rate: number
  ) {
    console.log('Minting NFT in', chain, txid, address, itag, rate)
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chain, txid, itag, rate }),
    }
    const response = await fetch('/api/nft/mint', options)
    //console.log('Minting response', response)
    const result = await response.json()
    console.log('>Result', result)
    if (!result.success) {
      console.error('Error', result.error)
      //setMessage('Error minting NFT')
      return { success: false, error: 'Error minting NFT' }
    }

    // Offer only for XRPL
    if (chain == 'XRPL') {
      const offer = await createOffer(result.tokenId, address)
      console.log('Offer', offer)
      if (offer.success) {
        const accept = await acceptOffer(
          offer.offerId,
          address,
          txid,
          result.tokenId,
          result.image,
          result.metadata
        )
        console.log('Accept', accept)
      }
    } else {
      //setMessage(`NFT minted successfully • <a href="${result.image}" target="_blank">Image</a> • <a href="${result.metadata}" target="_blank">Meta</a>`)
    }
    return result
  }

  async function claimNFT() {
    console.log('Claiming...', donation)
    //NFTData.status = 'Minting'
    setMessage('Minting NFT, wait a moment...')
    const minted = await mintNFT(
      donation.chainName,
      donation.txid,
      donation.donor.address,
      donation.tag,
      donation.rate
    )
    const result = structuredClone(donation)
    if (minted?.success) {
      result.status = 'Minted'
      setDonation(result)
      //setButtonText('DONE')
      //setDisabled(true)
      setMessage('NFT minted successfully!')
    } else {
      result.status = 'Failed'
      setDonation(result)
      //setButtonText('ERROR')
      //setDisabled(true)
      setMessage('Minting NFT failed!')
    }
  }

  return (
    <div className="flex min-h-full w-full">
      <div className="relative bg-white dark:bg-slate-500 p-6 my-4 h-auto border shadow-xl rounded-lg">
        <div className="border-dotted border-t-2 border-b-2 border-gray-300 p-2">
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
              {decimalString(donation.amount, 2)} {donation.ticker}*
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
              {decimalString(donation.amountFiat, 2)} {donation.fiatCurrencyCode}
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
          <NFTReceiptText className="font-normal pt-4 whitespace-normal">
            No goods or services were provided in exchange for this
            contribution. {donation.organization.name} is a tax-exempt 501(c)(3)
            organization.
          </NFTReceiptText>
          <ClaimButton status={donation.status} onClick={claimNFT} />
          <NFTReceiptText className="font-normal text-center pt-4 whitespace-normal">
            {message}
          </NFTReceiptText>
        </div>
      </div>
    </div>
  )
}
