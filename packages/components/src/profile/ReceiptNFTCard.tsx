"use client"
import appConfig from "@cfce/app-config"
import {
  chainConfig,
  getChainConfigurationByName,
  getNftPath,
} from "@cfce/blockchain-tools"
import type { NFTDataWithRelations } from "@cfce/database"
import { type Chain, ChainNames } from "@cfce/types"
import { format } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import { Badge } from "~/ui/badge"
import { Button } from "~/ui/button"
import { Card, CardContent, CardFooter } from "~/ui/card"
import { Separator } from "../ui"

export const ReceiptNFTCard: React.FC<NFTDataWithRelations> = (nftData) => {
  const {
    created,
    donorAddress,
    network,
    chainName,
    coinSymbol,
    coinValue,
    usdValue,
    tokenId,
    contractId,
    transactionId,
    initiative,
    organization,
  } = nftData
  const [isFlipped, setIsFlipped] = useState(false)

  if (!chainName) return <div>No chain</div>
  const isChain = (chain: string): chain is Chain => {
    return ChainNames.some((c) => c === chain)
  }
  if (!isChain(chainName)) {
    return null
  }
  const chainDetails = getChainConfigurationByName(chainName)
  return (
    <div>
      <span className="text-sm text-muted-foreground">
        {format(created, "MMM d, yyyy")}
      </span>
      {/* Flip card container */}
      <div className="relative">
        {/* Inner container that does the flipping */}
        <div
          className={`transition-transform duration-800 [transform-style:preserve-3d] ${
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Front of card */}
          <Card className="w-fullborder-1 bg-background shadow-xl [backface-visibility:hidden]">
            <CardContent className="p-4 space-y-4">
              {/* Initiative Image */}
              {initiative?.defaultAsset && (
                <div className="relative w-full h-[200px]">
                  <Image
                    src={initiative?.defaultAsset}
                    alt={initiative?.title ?? "Initiative Image"}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
              )}
              {/* Header */}
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-md">{initiative?.title}</h3>
              </div>

              {/* Organization Info */}
              <div className="flex items-center gap-2">
                {organization?.image && (
                  <div className="relative w-8 h-8">
                    <Image
                      src={organization?.image}
                      alt={organization?.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col items-start">
                  <span className="text-sm">{organization?.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    501(c)(3)
                  </Badge>
                </div>
              </div>

              {/* Donation Details */}
              <div className="flex flex-row justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6">
                    <Image
                      src={chainDetails.icon}
                      alt={chainDetails.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm">{chainDetails.name}</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {Number(usdValue).toFixed(2)} USD
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {Number(coinValue)} {coinSymbol}
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 gap-2 shrink-0">
              <Button variant="default" className="flex-1">
                <Link
                  target="_blank"
                  href={getNftPath({
                    chainName,
                    network,
                    contractId,
                    tokenId,
                    transactionId,
                  })}
                >
                  View NFT
                </Link>
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsFlipped(true)}
              >
                Receipt Details
              </Button>
            </CardFooter>
          </Card>

          {/* Back of card */}
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] l-0 r-0 t-0 b-0">
            <Card className="w-full h-full border-1 bg-background shadow-xl flex flex-col">
              <CardContent className="p-4 flex-1 overflow-y-auto">
                <div className="space-y-4">
                  <h3 className="font-semibold text-md">Donation Receipt</h3>

                  <div className="space-y-3">
                    {/* Organization Details */}
                    <div className="space-y-2">
                      <h4 className="text-md font-medium">Organization</h4>
                      <Separator />
                      <div className="space-y-1">
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">
                            Name
                          </span>
                          <span className="text-sm">{organization.name}</span>
                        </div>
                        {organization?.EIN && (
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">
                              EIN
                            </span>
                            <span className="text-sm">{organization.EIN}</span>
                          </div>
                        )}
                        {organization?.mailingAddress && (
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">
                              Address
                            </span>
                            <span className="text-sm">
                              {organization.mailingAddress}
                            </span>
                          </div>
                        )}
                      </div>
                      {initiative?.title && (
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">
                            Initiative
                          </span>
                          <span className="text-sm">{initiative?.title}</span>
                        </div>
                      )}
                    </div>

                    {/* Donation Details */}
                    <div className="space-y-2">
                      <h4 className="text-md font-medium">Donation</h4>
                      <Separator />
                      <div className="space-y-1">
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">
                            Date
                          </span>
                          <span className="text-sm">
                            {format(created, "MMMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">
                            Chain
                          </span>
                          <span className="text-sm">{chainDetails.name}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">
                            Network
                          </span>
                          <span className="text-sm">{network}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">
                            Amount
                          </span>
                          <span className="text-sm">
                            {Number(coinValue)} {coinSymbol}
                            <span className="text-muted-foreground">
                              (${Number(usdValue).toFixed(2)} USD)
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="space-y-2">
                      <h4 className="text-md font-medium">Transaction</h4>
                      <Separator />
                      <div className="space-y-1">
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">
                            Token ID
                          </span>
                          <span className="text-sm font-mono break-all">
                            {tokenId}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">
                            Donor Wallet
                          </span>
                          <span className="text-sm font-mono break-all">
                            {donorAddress}
                          </span>
                        </div>
                        {initiative?.wallet && (
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">
                              Initiative Wallet
                            </span>
                            <span className="text-sm font-mono break-all">
                              {initiative.wallet}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 gap-2 shrink-0">
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => {
                    const url = `${
                      chainConfig.xdc.networks[appConfig.chainDefaults.network]
                        .explorer
                    }/token/${tokenId}`
                    window.open(url, "_blank")
                  }}
                >
                  View NFT
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsFlipped(false)}
                >
                  Back
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
