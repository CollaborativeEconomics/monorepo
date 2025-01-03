"use client"

import type { Contract, Event } from "@cfce/database"
import { newContract } from "~/actions/database"
import { readContract, switchChain, waitForTransaction } from "@wagmi/core"
import { useState } from "react"
import styles from "~/styles/dashboard.module.css"
import { parseEther } from "viem"
import { useAccount, useConnect, useWriteContract } from "wagmi"
import * as wagmiChains from "wagmi/chains"
import ButtonBlue from "~/components/buttonblue"
import Dashboard from "~/components/dashboard"
import LinkButton from "~/components/linkbutton"
import Sidebar from "~/components/sidebar"
import Title from "~/components/title"
import { DateDisplay } from "~/components/ui/date-posted"
import Gallery from "~/components/ui/gallery"
import { FactoryAbi } from "~/utils/FactoryAbi"
import { config } from "~/utils/wagmiConfig"

const arbitrumSepolia = wagmiChains.arbitrumSepolia

interface EventClientProps {
  id: string
  event: Event
  media: string[] | null
  contractNFT: Contract | null
  contractV2E: Contract | null
}

export default function EventClient({
  id,
  event,
  media,
  contractNFT,
  contractV2E,
}: EventClientProps) {
  const { connectors, connect } = useConnect({ config })
  const { chainId, address } = useAccount()
  const { writeContractAsync } = useWriteContract({ config })

  // State Variables
  const started = Boolean(contractNFT && contractV2E)
  const [eventStarted, setEventStarted] = useState(started)
  const [ready, setReady] = useState(false)
  const [message, setMessage] = useState(
    "You will sign two transactions with your wallet",
  )

  // Constants
  const FactoryAddress = "0xD4E47912a12f506843F522Ea58eA31Fd313eB2Ee"
  const usdcAddressTestnet = "0x80C2f901ABA1F95e5ddb2A5024E7Df6a366a3AB0" // CFCE-controlled contract
  let NFTBlockNumber: number
  let distributorBlockNumber: number

  async function deployNFT() {
    try {
      setMessage("Initiating NFT deployment, please wait...")
      const uri =
        "https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/1.json"

      const hash = await writeContractAsync({
        address: FactoryAddress,
        abi: FactoryAbi,
        functionName: "deployVolunteerNFT",
        args: [uri as `0x${string}`, address as `0x${string}`],
        chain: arbitrumSepolia,
        account: address,
      })

      const nftReceipt = await waitForTransaction(config, {
        hash,
        confirmations: 2,
      })

      setMessage("NFT deployment confirmed")
      NFTBlockNumber = Number(nftReceipt.blockNumber)

      const NFTAddress = await readContract(config, {
        address: FactoryAddress,
        abi: FactoryAbi,
        functionName: "getDeployedVolunteerNFT",
        args: [address as `0x${string}`],
      })

      return NFTAddress
    } catch (error) {
      console.error("NFT deployment error:", error)
      throw error
    }
  }

  async function deployTokenDistributor(NFTAddress: string) {
    try {
      setMessage("Initiating Distributor deployment, please wait...")

      const hash = await writeContractAsync({
        address: FactoryAddress,
        abi: FactoryAbi,
        functionName: "deployTokenDistributor",
        args: [
          usdcAddressTestnet,
          NFTAddress as `0x${string}`,
          parseEther(event.unitvalue?.toString() || "0"),
        ],
        chain: arbitrumSepolia,
        account: address,
      })

      const distributorReceipt = await waitForTransaction(config, {
        hash,
        confirmations: 2,
      })

      setMessage("Distributor deployment confirmed")
      distributorBlockNumber = Number(distributorReceipt.blockNumber)

      const distributorAddress = await readContract(config, {
        address: FactoryAddress,
        abi: FactoryAbi,
        functionName: "getDeployedTokenDistributor",
        args: [address as `0x${string}`],
      })

      return distributorAddress
    } catch (error) {
      console.error("TokenDistributor deployment error:", error)
      throw error
    }
  }

  async function deploy() {
    try {
      if (chainId !== arbitrumSepolia.id) {
        await switchChain(config, { chainId: arbitrumSepolia.id })
      }

      const NFTAddress = await deployNFT()
      const distributorAddress = await deployTokenDistributor(NFTAddress)

      const erc1155 = {
        chain: "arbitrum",
        contract_address: NFTAddress,
        entity_id: id,
        admin_wallet_address: address,
        contract_type: "1155",
        network: "testnet",
        start_block: NFTBlockNumber.toString(),
      }

      await newContract(erc1155)

      const v2e = {
        chain: "arbitrum",
        contract_address: distributorAddress,
        entity_id: id,
        admin_wallet_address: address,
        contract_type: "V2E",
        network: "testnet",
        start_block: distributorBlockNumber.toString(),
      }

      await newContract(v2e)

      setReady(true)
      setEventStarted(true)
    } catch (error) {
      console.error("Deployment process failed:", error)
      setMessage(
        `Deployment failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      )
    }
  }

  return (
    <Dashboard>
      <div className={styles.content}>
        <Title text="Volunteer To Earn Event" />
        <div className={styles.viewBox}>
          {event.created && (
            <DateDisplay timestamp={event.created} className="p-4" />
          )}
          <div className="p-4 mt-2">
            <Gallery images={media} />
          </div>
          <div className="flex flex-col pb-8 pt-3 gap-3 px-4">
            <h1 className="mt-4 text-4xl">{event.name}</h1>
            <p>{event.description}</p>
          </div>

          {!eventStarted && (
            <div className="w-full flex flex-col justify-center align-center items-center mb-8">
              <ButtonBlue text="START EVENT" onClick={deploy} />
              <p>{message}</p>
            </div>
          )}

          {eventStarted && (
            <div className="w-full flex flex-row justify-between mb-8">
              <LinkButton
                href={`/dashboard/events/register/${id}`}
                text="REGISTER"
              />
              <LinkButton
                href={`/dashboard/events/report/${id}`}
                text="REPORT"
              />
              <LinkButton
                href={`/dashboard/events/reward/${id}`}
                text="REWARD"
              />
            </div>
          )}
        </div>
      </div>
    </Dashboard>
  )
}
