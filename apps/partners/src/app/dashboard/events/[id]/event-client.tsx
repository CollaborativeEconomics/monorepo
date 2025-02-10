"use client"

import appConfig, { chainConfig } from "@cfce/app-config"
import { abiVolunteersFactory as FactoryAbi } from "@cfce/blockchain-tools"
import type { Contract, Event } from "@cfce/database"
import { readContract, switchChain, waitForTransaction } from "@wagmi/core"
import { useState } from "react"
import { parseEther } from "viem"
import { useAccount, useWriteContract } from "wagmi"
import * as wagmiChains from "wagmi/chains"
import { newContract } from "~/actions/database"
import ButtonBlue from "~/components/buttonblue"
import Dashboard from "~/components/dashboard"
import LinkButton from "~/components/linkbutton"
import Sidebar from "~/components/sidebar"
import Title from "~/components/title"
import { DateDisplay } from "~/components/ui/date-posted"
import Gallery from "~/components/ui/gallery"
import styles from "~/styles/dashboard.module.css"
import { wagmiConfig, wagmiConnect, wagmiReconnect } from "~/utils/wagmiConfig"

// We may change chains in the future
const defaultChain = wagmiChains.arbitrumSepolia

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
  console.log("EVENT", { id, event, media, contractNFT, contractV2E })
  const { chainId, address } = useAccount()
  const { writeContractAsync } = useWriteContract({ config: wagmiConfig })

  // State Variables
  const started = Boolean(contractNFT && contractV2E)
  const [eventStarted, setEventStarted] = useState(started)
  const [ready, setReady] = useState(false)
  const [message, setMessage] = useState(
    "You will sign two transactions with your wallet",
  )

  // Constants
  // TODO: move to app config
  const FactoryAddress = "0xD4E47912a12f506843F522Ea58eA31Fd313eB2Ee"
  const usdcAddress =
    chainConfig.arbitrum.networks[appConfig.chainDefaults.network].tokens?.USDC
      ?.contract
  let NFTBlockNumber: number
  let distributorBlockNumber: number

  async function deployNFT() {
    try {
      setMessage("Initiating NFT deployment, please wait...")
      // TODO: FIX constant uri?
      //const uri = 'https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/1.json'; // not found - empty bucket
      const uri = "ipfs:testEvent"

      // ConnectorNotConnected error when Metamask is not active
      // Enable Metamask first then retry
      const hash = await writeContractAsync({
        address: FactoryAddress,
        abi: FactoryAbi,
        functionName: "deployVolunteerNFT",
        args: [uri as `0x${string}`, address as `0x${string}`],
        chain: defaultChain,
        account: address,
      })

      const nftReceipt = await waitForTransaction(wagmiConfig, {
        hash,
        confirmations: 2,
      })

      setMessage("NFT deployment confirmed")
      NFTBlockNumber = Number(nftReceipt.blockNumber)

      const NFTAddress = await readContract(wagmiConfig, {
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
      if (!usdcAddress) {
        setMessage(`USDC address not found: ${usdcAddress}`)
        throw new Error("USDC address not found")
      }

      const args = {
        address: FactoryAddress,
        abi: FactoryAbi,
        functionName: "deployTokenDistributor" as const,
        args: [
          usdcAddress as `0x${string}`,
          NFTAddress as `0x${string}`,
          parseEther(event.unitvalue?.toString() || "0"),
        ],
        chain: defaultChain,
        account: address,
      }

      console.log("ARGS", args)

      const hash = await writeContractAsync({
        address: FactoryAddress,
        abi: FactoryAbi,
        functionName: "deployTokenDistributor",
        args: [
          usdcAddress as `0x${string}`,
          NFTAddress as `0x${string}`,
          // parseEther(event.unitvalue?.toString() || '0'),
          BigInt(0),
        ],
        chain: defaultChain,
        account: address,
      })

      const distributorReceipt = await waitForTransaction(wagmiConfig, {
        hash,
        confirmations: 2,
      })

      setMessage("Distributor deployment confirmed")
      distributorBlockNumber = Number(distributorReceipt.blockNumber)

      const distributorAddress = await readContract(wagmiConfig, {
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
    console.log("DEPLOYING...")
    try {
      await wagmiConnect()
      if (chainId !== defaultChain.id) {
        await switchChain(wagmiConfig, { chainId: defaultChain.id })
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
        <div className={styles.mainBox}>
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
