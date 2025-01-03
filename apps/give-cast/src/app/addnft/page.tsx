"use client"
import { useSearchParams } from "next/navigation"
import React, { Suspense } from "react"

const AddNFTContent: React.FC = () => {
  const searchParams = useSearchParams()
  const tokenId = searchParams.get("tokenId")

  return (
    <div
      style={{
        alignItems: "center",
        color: "white",
        background: "#334155",
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        fontSize: 30,
        fontStyle: "normal",
        letterSpacing: "-0.025em",
        lineHeight: 1.4,
        whiteSpace: "pre-wrap",
      }}
    >
      <h1 style={{ fontSize: 60 }}>Add NFT to Your MetaMask</h1>
      <p style={{ margin: 0, padding: 0 }}>
        Follow these steps to add your NFT to MetaMask:
      </p>
      <ol style={{ margin: 0, padding: 0 }}>
        <li style={{ margin: 0, padding: 0 }}>
          Open MetaMask and ensure you are connected to the correct network.
        </li>
        <li style={{ margin: 0, padding: 0 }}>Click on the "NFTs" tab.</li>
        <li style={{ margin: 0, padding: 0 }}>
          Click on "Import NFT" at the bottom of the page.
        </li>
        <li style={{ margin: 0, padding: 0 }}>
          Enter the contract address:{" "}
          <code style={{ fontSize: 20 }}>{process.env.MINTER_CONTRACT}</code>
        </li>
        <li style={{ margin: 0, padding: 0 }}>
          Enter the token ID: <code style={{ fontSize: 20 }}>{tokenId}</code>
        </li>
        <li style={{ margin: 0, padding: 0 }}>
          Click "Import" to add the NFT to your MetaMask.
        </li>
      </ol>
      <p style={{ margin: 0, padding: 0, marginTop: 40, fontSize: 40 }}>
        Once added, you should be able to view your NFT in the MetaMask
        interface.
      </p>
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
