"use client"
import appConfig from "@cfce/app-config"
import { getNetworkByChainName } from "@cfce/blockchain-tools"
import type { Chain } from "@cfce/database"
import { useSearchParams } from "next/navigation"
import React, { Suspense, useState } from "react"

const CopyIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Copy to clipboard"
  >
    <title>Copy to clipboard</title>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

const CopyField: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="mb-4">
      <div className="text-white/60 mb-2">{label}</div>
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-2 bg-black/30 rounded-lg p-3 w-full border-none cursor-pointer transition-colors"
      >
        <input
          type="text"
          readOnly
          value={value}
          className="bg-transparent border-none text-white text-base w-full outline-none cursor-pointer"
          aria-label={`${label} value`}
        />
        <div
          className={`flex items-center transition-colors ${copied ? "text-white/60" : "text-white/40"}`}
        >
          {copied ? "Copied!" : <CopyIcon />}
        </div>
      </button>
    </div>
  )
}

const AddNFTContent: React.FC = () => {
  const searchParams = useSearchParams()
  const tokenId = searchParams.get("tokenId")
  const chain = (searchParams.get("chain") ||
    appConfig.chainDefaults.chain) as Chain
  const network = getNetworkByChainName(chain)
  const contractAddress = network.contracts?.ReceiptNFT

  return (
    <div className="flex items-center text-white bg-gradient-to-b from-slate-800 to-slate-700 flex-col flex-nowrap text-3xl font-normal tracking-tight leading-relaxed whitespace-pre-wrap p-12 min-h-screen">
      <div className="max-w-3xl w-full bg-black/20 rounded-2xl p-8 shadow-lg">
        <h1 className="text-5xl mb-8 text-center text-white">
          How to Add NFT to Your Wallet
        </h1>

        <div className="bg-white/5 rounded-lg p-6 mb-8">
          <h2 className="text-2xl mb-6 text-white/90">Important Details</h2>
          <div className="flex flex-col">
            <div className="mb-4">
              <span className="text-white/60">Network:</span>{" "}
              <span className="text-white">{network.name}</span>
              <span className="text-white/60 ml-4 text-sm">
                {network.network}
              </span>
            </div>
            <CopyField label="Contract Address" value={contractAddress || ""} />
            <CopyField label="Token ID" value={tokenId || ""} />
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6">
          <h2 className="text-2xl mb-4 text-white/90">Steps to Add Your NFT</h2>
          <ol className="m-0 p-0 list-none flex flex-col gap-4">
            {[
              `1. Open MetaMask and ensure you are connected to the ${network.name} network`,
              '2. Click on the "NFTs" tab in your wallet',
              '3. Click on "Import NFT" at the bottom of the page',
              "4. Copy and paste the contract address and token ID from above",
              '5. Click "Import" to add the NFT to your wallet',
            ].map((step) => (
              <li key={step} className="m-0 p-4 bg-black/20 rounded-lg text-xl">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

const AddNFTPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddNFTContent />
    </Suspense>
  )
}

export default AddNFTPage
