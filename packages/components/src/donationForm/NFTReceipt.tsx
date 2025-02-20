"use client"
import type { InitiativeWithRelations, Prisma } from "@cfce/database"
import {
  amountCoinAtom,
  amountUSDAtom,
  chainAtom,
  donationFormAtom,
} from "@cfce/state"
import { localizedNumber } from "@cfce/utils"
import { useAtomValue } from "jotai"
import Image from "next/image"
import React from "react"
import { TimestampToDateString } from "~/ui/date-posted"
import { ReceiptStatus } from "~/ui/receipt-status"
import { NFTReceiptText } from "./NFTReceiptText"

interface ReceiptNFTProps {
  initiative: InitiativeWithRelations
}

export default function NFTReceipt({ initiative }: ReceiptNFTProps) {
  const organization = initiative.organization
  const donationForm = useAtomValue(donationFormAtom)
  const { selectedToken } = useAtomValue(chainAtom)
  const usdAmount = useAtomValue(amountUSDAtom)
  const coinAmount = useAtomValue(amountCoinAtom)
  // const [disabled, setDisabled] = useState(true);
  //console.log('Receipt:', receipt)
  //console.log('Donation', donation)

  return (
    <div
      className="flex min-h-full w-full"
      style={{
        mask: "conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg) 50%/20px 100%",
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
            // TODO: provide fallback
            src={initiative.defaultAsset ?? ""}
            alt="IMG BG"
            fill
            className="rounded-sm object-cover object-top"
          />
        </div>
        <ReceiptStatus status={donationForm.paymentStatus} />

        <div className="p-2">
          <TimestampToDateString
            className="pt-2 text-sm text-right font-bold text-gray-500 dark:text-white"
            timestamp={donationForm.date.getTime()}
          />
          <NFTReceiptText>{organization.name}</NFTReceiptText>
          <NFTReceiptText className="font-normal">
            EIN: {organization?.EIN}
          </NFTReceiptText>
          <NFTReceiptText className="font-normal whitespace-pre">
            {organization?.mailingAddress}
          </NFTReceiptText>
          <div className="flex flex-row justify-between items-center pt-6">
            <NFTReceiptText>Donation amount</NFTReceiptText>
            <div className="flex border-dotted border-t-2 border-gray-300 w-full" />
            <NFTReceiptText>
              {localizedNumber(coinAmount, 2)} {selectedToken}*
            </NFTReceiptText>
          </div>
          <NFTReceiptText className="font-normal whitespace-normal">
            *{selectedToken} is a publicly traded crypto-currency with a direct
            monetary value
          </NFTReceiptText>
          <div className="flex flex-row justify-between items-center pt-6">
            <NFTReceiptText>Monetary Value*</NFTReceiptText>
            <div className="flex border-dotted border-t-2 border-gray-300 w-full" />
            <NFTReceiptText>{localizedNumber(usdAmount, 2)} USD</NFTReceiptText>
          </div>
          <NFTReceiptText className="font-normal pt-0">
            *At the time of transaction
          </NFTReceiptText>

          <div className="border-dotted border-t-2 border-b-2 border-gray-300 mt-6 py-2">
            <div className="flex flex-row justify-between">
              <NFTReceiptText>Donated By</NFTReceiptText>
              <NFTReceiptText>{donationForm.name}</NFTReceiptText>
            </div>
          </div>
          <NFTReceiptText className="font-normal pt-2 pt-4 whitespace-normal">
            No goods or services were provided in exchange for this
            contribution. {organization.name} is a tax-exempt 501(c)(3)
            organization.
          </NFTReceiptText>
          {/* TODO: maybe add claim back in for chain-native NFTs */}
          {/* <ClaimButton status={donation.status} onClick={claimNFT} /> */}
          {/* <NFTReceiptText className="font-normal text-center pt-2 pt-4 whitespace-normal">
            {message}
          </NFTReceiptText> */}
        </div>
      </div>
    </div>
  )
}
