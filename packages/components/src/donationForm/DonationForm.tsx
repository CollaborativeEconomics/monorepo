"use client"
import { usePostHog } from "@cfce/analytics"
import appConfig, { chainConfig } from "@cfce/app-config"
import { createAnonymousUser, fetchUserByWallet } from "@cfce/auth"
import {
  BlockchainClientInterfaces,
  getChainConfigurationByName,
} from "@cfce/blockchain-tools"
import type {
  Chain,
  Contract,
  InitiativeWithRelations,
  Prisma,
  User,
  Wallet,
} from "@cfce/database"
import {
  PAYMENT_STATUS,
  amountCoinAtom,
  amountUSDAtom,
  chainAtom,
  donationFormAtom,
} from "@cfce/state"
import type { ChainSlugs, TokenTickerSymbol } from "@cfce/types"
import { mintAndSaveReceiptNFT } from "@cfce/utils"
import { registryApi } from "@cfce/utils"
import { useAtom, useAtomValue } from "jotai"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useToast } from "~/hooks/use-toast"
import { Button } from "~/ui/button"
import { Card } from "~/ui/card"
import { CheckboxWithText } from "~/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/ui/dialog"
import { Input } from "~/ui/input"
import { Label } from "~/ui/label"
import { Separator } from "~/ui/separator"
import createDonation from "../actions/createDonation"
import getContractByChain from "../actions/getContractByChain"
import getRate from "../actions/getRate"
import { CarbonCreditDisplay } from "./CarbonCreditDisplay"
import { ChainSelect } from "./ChainSelect"
import { DonationAmountInput } from "./DonationAmountInput"
import { MintButton } from "./MintButton"
import { RateMessage } from "./RateMessage"
import { WalletSelect } from "./WalletSelect"

interface DonationFormProps {
  initiative: InitiativeWithRelations
  rate: number
}

interface DonationData {
  organizationId: string
  initiativeId?: string
  categoryId?: string
  userId?: string
  sender: string
  chainName: Chain
  network: string
  coinValue: number
  usdValue: number
  currency: string
}

type UserRecord = Prisma.UserGetPayload<{ include: { wallets: true } }>

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default function DonationForm({ initiative, rate }: DonationFormProps) {
  //console.log("INITIATIVE", initiative)
  const posthog = usePostHog()
  const organization = initiative.organization
  const [coinRate, setCoinRate] = useState(rate)
  const [loading, setLoading] = useState(false)
  const [balanceDialogOpen, setBalanceDialogOpen] = useState(false)
  const [chainState, setChainState] = useAtom(chainAtom)
  useEffect(() => {
    setChainState((draft) => {
      console.log("INIT RATE", coinRate)
      draft.exchangeRate = coinRate
    })
  }, [coinRate, setChainState])
  //console.log('INIT STATE', chainState)

  const { selectedToken, selectedChain, selectedWallet, exchangeRate } =
    chainState
  const [donationForm, setDonationForm] = useAtom(donationFormAtom)
  const { emailReceipt, name, email, amount } = donationForm
  const coinAmount = useAtomValue(amountCoinAtom)
  const usdAmount = useAtomValue(amountUSDAtom)
  const chain = chainConfig[selectedChain]
  const network = chain.networks[appConfig.chainDefaults.network]
  const chainInterface = useRef(BlockchainClientInterfaces[selectedWallet])
  const [buttonMessage, setButtonMessage] = useState(
    "One wallet confirmation required",
  )
  const [errorDialogState, setErrorDialogState] = useState(false)
  const { toast } = useToast()

  const handleError = useCallback(
    (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred"

      // const canRetryWithGas =
      //   errorMessage.includes("gasless") ||
      //   errorMessage.includes("insufficient funds") ||
      //   errorMessage.includes("rejected") ||
      //   errorMessage.includes("No API keys found")

      if (errorMessage.includes("gasless")) {
        setErrorDialogState(true)
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })

      setButtonMessage(errorMessage)
      throw new Error(errorMessage)
    },
    [toast],
  )

  useEffect(() => {
    chainInterface.current = BlockchainClientInterfaces[selectedWallet]
  }, [selectedWallet])

  // Disable chains that don't have wallets
  useEffect(() => {
    async function updateView() {
      console.log("SELECTED CHAIN", selectedChain)
      const nameToSlug = (name: Chain): ChainSlugs =>
        getChainConfigurationByName(name).slug
      const orgWallets = organization?.wallets.map((w) => nameToSlug(w.chain))
      const initiativeWallets = initiative?.wallets.map((w) =>
        nameToSlug(w.chain),
      )
      const symbol = selectedToken
      const rate = await getRate(symbol)
      setCoinRate(rate)
      console.log("COIN", symbol)
      console.log("RATE", rate)
      console.log("ORGWALLETS", organization?.wallets)
      console.log("INIWALLETS", initiative?.wallets)
      setChainState((draft) => {
        draft.enabledChains = [...orgWallets, ...initiativeWallets]
        //draft.exchangeRate = rate
      })
      console.log("UPDATED")
    }
    updateView()
  }, [initiative, organization, selectedChain, selectedToken, setChainState])

  //const destinationWalletAddress = 'raHkr5qJNYez8bQQDMVLwvaRvxMripVznT' // hardcoded for testing
  const destinationWallet = useMemo(() => {
    console.log("DESTINATIONWALLET")
    console.log("CHAIN", chain)
    const chainName = chain?.name
    console.log("NAME", chainName)
    const initiativeWallet = initiative?.wallets?.find(
      (w) => w.chain === chainName,
    )
    console.log("INITIATIVE WALLET", initiativeWallet)
    if (initiativeWallet) {
      return {
        address: initiativeWallet.address,
        memo: initiativeWallet.memo || "",
      }
    }

    const organizationWallet = organization?.wallets.find(
      (w) => w.chain === chainName,
    )

    console.log("ORGANIZATION", organizationWallet)
    if (organizationWallet) {
      return {
        address: organizationWallet.address,
        memo: organizationWallet.memo || "",
      }
    }

    // Use fallback address if both initiative and organization wallets are not found
    const fallbackAddress = appConfig.chainDefaults?.defaultAddress
    console.log("FALLBACK", fallbackAddress)
    if (fallbackAddress) {
      return { address: fallbackAddress, memo: "" }
    }
    return { address: "", memo: "" }
  }, [organization, initiative, chain])

  const checkBalance = useCallback(async () => {
    //if (!chainInterface?.connect) {
    //  const error = new Error("No connect method on chain interface")
    //  throw error
    //}
    //await chainInterface?.connect(selectedChain)
    console.log("BALANCE")
    const balanceCheck = await chainInterface.current.getBalance?.()
    console.log("BALANCED", balanceCheck)
    if (!balanceCheck || "error" in balanceCheck) {
      const error = new Error(balanceCheck?.error ?? "Failed to check balance")
      throw error
    }
    console.log("BALANCE CHECK", { balanceCheck, coinAmount })
    return balanceCheck.balance >= coinAmount
  }, [coinAmount])

  const sendPayment = useCallback(
    async (address: string, amount: number, memo: string) => {
      //if (!chainInterface?.connect) {
      //  const error = new Error("No connect method on chain interface")
      //  throw error
      //}
      //await chainInterface?.connect(selectedChain)
      console.log("SEND", address, amount, memo)
      if (!chainInterface.current.sendPayment) {
        const error = new Error("No sendPayment method on chain interface")
        toast({
          variant: "destructive",
          title: "Payment Error",
          description: error.message,
        })
        throw error
      }

      const data = {
        address,
        amount,
        memo,
        //amount: chainInterface.toBaseUnit(amount),
        //memo: appConfig.chains[selectedChain]?.destinationTag || "",
      }
      console.log("SENDING PAYMENT", data)
      const result = await chainInterface.current.sendPayment(data)
      console.log("PAYMENT RESULT", result)
      if (!result.success) {
        const error = new Error(result.error || "Payment failed")
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: error.message,
        })
        throw error
      }
      return result
    },
    [toast],
  )

  const sendGaslessPayment = useCallback(
    async (address: string, amount: number, memo: string) => {
      //if (!chainInterface?.connect) {
      //  const error = new Error("No connect method on chain interface")
      //  throw error
      //}
      //await chainInterface.connect(selectedChain)
      if (!chainInterface.current.sendGaslessPayment) {
        const error = new Error("Gas payments not supported")
        toast({
          variant: "destructive",
          title: "Gas Payment Error",
          description: error.message,
        })
        throw error
      }
      //if (!chainInterface.isConnected()) {
      //  await chainInterface?.connect?.()
      //}

      const result = await chainInterface.current.sendGaslessPayment({
        address,
        amount,
        memo,
        //memo: appConfig.chains[selectedChain]?.destinationTag,
      })
      console.log("GAS PAYMENT RESULT", result)
      return result
    },
    [toast],
  )

  const handleMinting = useCallback(
    async (paymentResult: {
      success: boolean
      walletAddress?: string
      txid?: string
    }) => {
      try {
        // FIX: if coin switcher is selecting USD amounts are right, if set to coin, values get changed back to USD
        console.log("SWITCHUSD", donationForm)
        setButtonMessage("Minting NFT receipt, please wait...")
        const data = {
          donorName: name || "Anonymous",
          email: emailReceipt ? email : undefined,
          organizationId: organization.id,
          initiativeId: initiative.id,
          transaction: {
            date: new Date().toISOString(),
            donorWalletAddress: paymentResult.walletAddress ?? "",
            destinationWalletAddress: destinationWallet.address,
            memo: destinationWallet.memo,
            amount: coinAmount,
            usdValue: usdAmount,
            rate,
            txId: paymentResult.txid ?? "",
            chain: selectedChain,
            token: selectedToken,
          },
        }
        console.log("NFT>", data)
        // TODO: increase sleep time? some chains take longer <<<<
        //await sleep(5000) // Wait for tx to confirm
        console.log("MINT>")
        const receiptResult = await mintAndSaveReceiptNFT(data) // <<<<<<
        console.log("RESULT>", receiptResult)

        if ("error" in receiptResult) {
          throw new Error(receiptResult.error ?? "Failed to process receipt")
        }

        toast({
          title: "Success",
          description: "NFT receipt minted successfully!",
        })

        setButtonMessage("Thank you for your donation!")
        setDonationForm((draft) => {
          draft.paymentStatus = PAYMENT_STATUS.minted
          draft.date = new Date()
        })
        setTimeout(() => {
          setDonationForm((draft) => {
            draft.paymentStatus = PAYMENT_STATUS.ready
            draft.date = new Date()
          })
          setButtonMessage("Donate Again to same Initiative!")
        }, 10000)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Minting Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to mint NFT receipt",
        })
        throw error
      }
    },
    [
      name,
      emailReceipt,
      email,
      organization.id,
      initiative.id,
      destinationWallet,
      selectedChain,
      selectedToken,
      setDonationForm,
      toast,
      coinAmount,
      usdAmount,
      donationForm,
      rate,
    ],
  )

  const onSubmit = useCallback(async () => {
    try {
      console.log("SUBMITTING...")
      validateForm({ email })

      if (!chainInterface.current.connect) {
        throw new Error("No connect method on chain interface")
      }

      if (!chainInterface.current.isConnected()) {
        console.log("CONNECTING...")
        await chainInterface.current.connect(selectedChain)
      }

      if (appConfig.siteInfo.options.enableFetchBalance) {
        console.log("CHECKING BALANCE")
        const hasBalance = await checkBalance()
        if (!hasBalance) {
          setBalanceDialogOpen(true)
          return
        }
      }

      setLoading(true)
      setButtonMessage("Approving payment...")

      let paymentResult: {
        success: boolean
        walletAddress?: string
        txid?: string
        error?: string
      }

      let contract: Contract | null = null
      // Check for contract
      if (selectedChain === "stellar") {
        const network = appConfig.chains[selectedChain]?.network || "testnet"
        // First get contract for initiative
        contract = await getContractByChain(
          initiative.id,
          "Credits",
          selectedChain,
          network,
        )
        console.log("CTR1", contract)
        if (!contract) {
          // If not found, get contract for organization
          contract = await getContractByChain(
            organization.id,
            "Credits",
            selectedChain,
            network,
          )
          console.log("CTR2", contract)
        }
      }

      if (contract && chainInterface.current.sendToContract) {
        console.log("USING CONTRACT", contract?.contract_address)
        const result = await chainInterface.current.sendToContract({
          contractId: contract.contract_address ?? "",
          amount: coinAmount,
        })
        console.log("RESULT", result)
        if (!result) {
          console.log("ERROR1")
          throw new Error("Contract donations not supported")
        }
        if (!result?.success) {
          console.log("ERROR2")
          throw new Error(result?.error || "Contract donation failed")
        }
        paymentResult = result
      } else if (appConfig.siteInfo.options.enableGaslessTransactions) {
        // currently starknet only
        console.log(
          "SENDING GASLESS PAYMENT TO",
          destinationWallet.address,
          coinAmount,
          destinationWallet.memo,
        )
        paymentResult = await sendGaslessPayment(
          destinationWallet.address,
          coinAmount,
          destinationWallet.memo,
        )
      } else {
        console.log(
          "SENDING GAS PAYMENT TO",
          destinationWallet.address,
          coinAmount,
          destinationWallet.memo,
        )
        paymentResult = await sendPayment(
          destinationWallet.address,
          coinAmount,
          destinationWallet.memo,
        )
      }
      console.log("PAYRES", paymentResult)

      if (!paymentResult?.success) {
        console.log("ERROR", paymentResult.error)
        const errorMessage = paymentResult.error ?? "Payment failed"
        const error = new Error(errorMessage)
        handleError(error)
        return
      }

      if (posthog.__loaded) {
        posthog.capture("user_donated", {
          amount,
          organization: organization.slug,
          initiative: initiative.slug,
          token: selectedToken,
          chain: selectedChain,
        })
      }

      if (!paymentResult?.walletAddress) {
        handleError(new Error("No wallet address found"))
        return
      }

      let user = await fetchUserByWallet(paymentResult?.walletAddress || "")

      if (!user) {
        user = await createAnonymousUser({
          walletAddress: paymentResult?.walletAddress ?? "",
          chain: chain.name,
          network: appConfig.chainDefaults.network,
        })
      }
      console.log("USER", user)
      // Save donation first
      const donationData = {
        organizationId: organization.id,
        initiativeId: initiative.id,
        categoryId: undefined,
        userId: user?.id ?? "",
        sender: paymentResult.walletAddress ?? "",
        chainName: chain.name,
        network: appConfig.chains[selectedChain]?.network ?? "",
        coinValue: coinAmount,
        usdValue: usdAmount,
        currency: selectedToken,
      }
      console.log("DONATION DATA", donationData)
      const donationId = await saveDonation(donationData)
      if (!donationId) {
        throw new Error("Error saving donation")
      }
      await handleMinting(paymentResult)
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }, [
    amount,
    checkBalance,
    coinAmount,
    destinationWallet,
    email,
    handleError,
    handleMinting,
    initiative.id,
    initiative.slug,
    network.id,
    organization.id,
    organization.slug,
    posthog.__loaded,
    posthog.capture,
    selectedChain,
    selectedToken,
    sendGaslessPayment,
    sendPayment,
    usdAmount,
    chain.name,
  ])

  function validateForm({ email }: { email: string }) {
    if (email && !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
      const error = new Error("Invalid email")
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: error.message,
      })
      throw error
    }
  }

  //async function saveDonation({organizationId, initiativeId, categoryId, userId, sender, chainName, network, coinValue, usdValue, currency}:DonationData){
  const saveDonation = useCallback(
    async ({
      organizationId,
      initiativeId,
      categoryId,
      userId,
      sender,
      chainName,
      network,
      coinValue,
      usdValue,
      currency,
    }: DonationData) => {
      if (chainName !== "XDC" && chainName !== "XRPL") {
        chainName = chainName.charAt(0).toUpperCase() + chainName.slice(1)
      }
      const donation = {
        organization: {
          connect: { id: organizationId },
        },
        initiative: {
          connect: { id: initiativeId },
        },
        ...(categoryId && {
          category: {
            connect: { id: categoryId },
          },
        }),
        userId,
        network,
        chain: chain.name,
        wallet: sender,
        amount: coinValue,
        usdvalue: usdValue,
        asset: currency,
        paytype: "crypto",
        status: 1,
      }

      console.log("DONATION", donation)
      //const ApiKey = process.env.CFCE_REGISTRY_API_KEY || ''
      //const donationResp = await fetch('/api/donations', {method:'post', headers: {'x-api-key': ApiKey }, body:JSON.stringify(donation)})
      //const donationJson = await donationResp.json()
      //console.log('SAVED DONATION', donationJson)
      //if(!donationJson.success){
      //  //setButtonText('ERROR')
      //  //setDisabled(true)
      //  setButtonMessage('Error saving donation')
      //  return false
      //}
      try {
        const donationResp = await createDonation(
          JSON.parse(JSON.stringify(donation)),
        )
        console.log("SAVED DONATION", donationResp)
        if (!donationResp) {
          const error = new Error("Error saving donation")
          toast({
            variant: "destructive",
            title: "Donation Error",
            description: error.message,
          })
          setButtonMessage("Error saving donation")
          return false
        }
        return donationResp.id
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Donation Error",
          description:
            error instanceof Error ? error.message : "Failed to save donation",
        })
        return false
      }
    },
    [toast, chain.name],
  )

  return (
    <div className="flex min-h-full w-full">
      <Card className="py-6 w-full">
        <div className="px-6">
          <Label htmlFor="currency-select" className="mb-2">
            Currency
          </Label>
          <ChainSelect className="mb-6" />
          <Label htmlFor="wallet-select" className="mb-2">
            Wallet
          </Label>
          <WalletSelect className="mb-2" />
          {destinationWallet.memo && (
            <p className="text-xs mb-6">
              This chain requires a memo field that will be included in the
              transaction {destinationWallet.memo}
            </p>
          )}
        </div>
        <Separator />
        <div className="px-6">
          {appConfig.siteInfo.options.showCarbonCreditDisplay &&
            initiative.contractcredit && (
              <CarbonCreditDisplay initiative={initiative} />
            )}
          <div className="w-full mt-6 mb-2">
            <DonationAmountInput label="Amount" />
            <RateMessage />
          </div>
          <Label htmlFor="name-input" className="mb-2">
            Name (optional)
          </Label>
          <Input
            type="text"
            className="pl-4 mb-6"
            id="name-input"
            autoComplete="name"
            onChange={({ target: { value: name } }) => {
              setDonationForm((draft) => {
                draft.name = name
                draft.date = new Date()
              })
            }}
          />
          <Label htmlFor="email-input" className="mb-2">
            Email address (optional)
          </Label>
          <Input
            type="text"
            className="pl-4 mb-6"
            id="email-input"
            autoComplete="email"
          />
          <CheckboxWithText
            id="receipt-check"
            text="I'd like to receive an emailed receipt"
            className="mb-2"
          />
        </div>
        <Separator />
        <div className="flex flex-col items-center justify-center">
          <MintButton onClick={onSubmit} />
          <p className="mt-2 text-sm px-4">{buttonMessage}</p>
        </div>
      </Card>
      <Dialog open={balanceDialogOpen} onOpenChange={setBalanceDialogOpen}>
        <DialogContent className="p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Insufficient Funds
            </DialogTitle>
            <DialogDescription className="text-white-600">
              You do not have enough funds in your wallet to complete this
              transaction. Click on the button below to add funds to your
              wallet.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button
              variant={"link"}
              onClick={() => {
                window.open("https://changelly.com/buy", "_blank")
              }}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Buy {selectedToken} on Changelly
            </Button>
            <DialogClose className="text-white-500 hover:underline">
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={errorDialogState} onOpenChange={setErrorDialogState}>
        <DialogContent className="p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Gasless Transaction Failed
            </DialogTitle>
            <DialogDescription className="text-white-600">
              Would you like to try again with a regular gas transaction?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button
              className="bg-lime-600 text-white text-lg hover:bg-green-600 hover:shadow-inner"
              onClick={() => {
                setErrorDialogState(false)
                setTimeout(() => {
                  setLoading(true)
                  setButtonMessage("Approving payment...")
                  console.log(
                    "SENDING PAYMENT TO",
                    destinationWallet.address,
                    coinAmount,
                    destinationWallet.memo,
                  )
                  sendPayment(
                    destinationWallet.address,
                    coinAmount,
                    destinationWallet.memo,
                  )
                    .then((gasResult) => handleMinting(gasResult))
                    .catch(handleError)
                    .finally(() => setLoading(false))
                }, 0)
              }}
            >
              Try With Gas
            </Button>
            <Button variant="ghost" onClick={() => setErrorDialogState(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
