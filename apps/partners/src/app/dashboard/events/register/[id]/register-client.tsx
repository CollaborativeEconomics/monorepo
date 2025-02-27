"use client"

import { abiVolunteersDistributor as DistributorAbi } from "@cfce/blockchain-tools"
import type { Contract, Event } from "@cfce/database"
import {
  readContract,
  simulateContract,
  switchChain,
  waitForTransaction,
} from "@wagmi/core"
import { BrowserQRCodeReader } from "@zxing/library"
import clipboard from "clipboardy"
import { LucideClipboardPaste, LucideQrCode } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useAccount, useWriteContract } from "wagmi"
import { arbitrumSepolia } from "wagmi/chains"
import ButtonBlue from "~/components/buttonblue"
import TextInput from "~/components/form/textinput"
import Title from "~/components/title"
import styles from "~/styles/dashboard.module.css"
import { cleanAddress } from "~/utils/address"
import { wagmiConfig, wagmiConnect, wagmiReconnect } from "~/utils/wagmiConfig"

// We may change chains in the future
const defaultChain = arbitrumSepolia

interface RegisterClientProps {
  id: string
  event: Event
  contractNFT: Contract
}

export default function RegisterClient({
  id,
  event,
  contractNFT,
}: RegisterClientProps) {
  const qrReader = useRef<BrowserQRCodeReader | null>(null)
  const [device, setDevice] = useState<string | null | undefined>(null)
  const [message, setMessage] = useState(
    "Scan the QR-CODE to register for the event",
  )
  const [scanStatus, setScanStatus] = useState<"ready" | "scanning">("ready")
  const account = useAccount()
  const { writeContractAsync } = useWriteContract({ config: wagmiConfig })

  const { register, watch, setValue } = useForm({
    defaultValues: { address: "" },
  })
  const [address] = watch(["address"])

  // Initialize QR reader
  useEffect(() => {
    if (!qrReader.current) {
      qrReader.current = new BrowserQRCodeReader()
    }

    qrReader.current
      .getVideoInputDevices()
      .then((videoInputDevices: MediaDeviceInfo[]) => {
        console.log("VIDEO INPUT DEVICES", videoInputDevices)
        if (videoInputDevices[0]) {
          setDevice(videoInputDevices[0].deviceId)
        }
      })
      .catch((err) => {
        console.error(err)
        setMessage("Error accessing camera")
      })

    return () => {
      qrReader.current?.reset()
    }
  }, [])

  const beginDecode = useCallback(() => {
    console.log("BEGIN DECODE", qrReader.current, device)
    if (!qrReader.current) return
    qrReader.current.decodeFromInputVideoDeviceContinuously(
      // @ts-expect-error: for some reason deviceId can be undefined
      device,
      "qrcode",
      (result, error) => {
        if (error) {
          setMessage(error instanceof Error ? error.message : "Unknown error")
          return
        }
        if (!result) return

        const address = result.getText()
        const cleanedAddress =
          address.includes(":") && address.includes("@")
            ? address.split(":")[1].split("@")[0]
            : address.includes(":")
              ? address.split(":")[1]
              : address.includes("@")
                ? address.split("@")[0]
                : address

        setMessage("Wallet Scanned!")
        setValue("address", cleanedAddress)
        setScanStatus("ready")
        qrReader.current?.stopContinuousDecode()
      },
    )
  }, [device, setValue])

  async function onScan() {
    console.log("SCAN")
    setScanStatus("scanning")
    setMessage("Scanning qrcode...")
    beginDecode()
  }

  async function onStop() {
    console.log("STOP")
    setScanStatus("ready")
    setMessage("Ready to scan")
    try {
      qrReader.current?.reset()
    } catch (ex) {
      console.error(ex)
    }
  }

  async function onMint() {
    const connected = await wagmiConnect()
    console.log("CONNECTED", connected)
    console.log("ACCOUNT", account)

    const cleanedAddress = cleanAddress(address) as `0x${string}`
    const nft = contractNFT.contract_address as `0x${string}`
    const tokenId = BigInt(1)
    const tokenQty = BigInt(1)

    if (!account?.address || !nft) {
      setMessage("Please Connect Wallet in Metamask")
      return
    }

    setMessage("Minting NFT, please wait...")

    if (account.chainId !== defaultChain.id) {
      console.log("SWITCH FROM", account.chainId, "TO", defaultChain.id)
      await switchChain(wagmiConfig, { chainId: defaultChain.id })
    }

    try {
      const balance = await readContract(wagmiConfig, {
        address: nft,
        abi: DistributorAbi,
        functionName: "balanceOf",
        args: [cleanedAddress, tokenId],
      })
      console.log("BALANCE", balance)

      if (balance > BigInt(0)) {
        setMessage("User already registered for this event")
        return
      }

      const tx = {
        address: nft,
        abi: DistributorAbi,
        functionName: "mint",
        args: [cleanedAddress, tokenId, tokenQty],
        chain: defaultChain,
        account: account.address,
      }
      console.log("TX", tx)
      const hash = await writeContractAsync({
        address: nft,
        abi: DistributorAbi,
        functionName: "mint",
        args: [cleanedAddress, tokenId, tokenQty],
        chain: defaultChain,
        account: account.address,
      })
      const nftReceipt = await waitForTransaction(wagmiConfig, {
        hash,
        confirmations: 2,
      })

      setMessage("NFT minted successfully")
    } catch (error) {
      console.error("Registration error:", error)
      setMessage(
        `Registration error - ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      )
    }
  }

  return (
    <div className="mt-8">
      <div className={styles.mainBox}>
        <Title text="VOLUNTEER TO EARN" />
        <h1>{event.name}</h1>
        <div className="mt-8 border border-dashed rounded-lg aspect-square overflow-hidden w-[70%] relative">
          {scanStatus === "ready" && (
            <div className="absolute top-0 left-0 w-full h-full bg-blue-700/50 flex items-center justify-center">
              <LucideQrCode className="text-white" size={60} />
            </div>
          )}
          <video
            id="qrcode"
            className="w-full h-full object-cover"
            aria-label="QR code scanner"
            muted // ignores biome need for captions
          />
        </div>
        <div className="w-full mb-2 flex flex-row justify-between">
          <ButtonBlue
            id="buttonSubmit"
            text={scanStatus === "ready" ? "SCAN" : "CANCEL"}
            onClick={scanStatus === "ready" ? onScan : onStop}
          />
        </div>
        <div className="w-[90%] text-center">
          <TextInput
            label=""
            className="text-center"
            {...register("address")}
            renderRight={
              <LucideClipboardPaste
                onClick={async () => {
                  const pasteContent = await clipboard.read()
                  setValue("address", pasteContent)
                }}
              />
            }
            // value={address}
          />
        </div>
        <div className="w-full mb-2 flex flex-row justify-between">
          <ButtonBlue
            id="buttonSubmit"
            text="MINT ATTENDANCE NFT"
            onClick={onMint}
          />
        </div>
        <p id="message" className="mb-6 center text-center truncate w-full">
          {message}
        </p>
      </div>
    </div>
  )
}
