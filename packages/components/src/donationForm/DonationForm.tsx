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
  InitiativeWithRelations,
  Prisma,
  User,
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
import { useCallback, useEffect, useMemo, useState } from "react"
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
  // TODO: get contract id from contracts table not initiative record
  const posthog = usePostHog()
  const contractId = initiative.contractcredit // needed for CC contract
  const organization = initiative.organization
  const [coinRate, setCoinRate] = useState(rate)
  const [loading, setLoading] = useState(false)
  const [balanceDialogOpen, setBalanceDialogOpen] = useState(false)
  const [chainState, setChainState] = useAtom(chainAtom)
  setChainState((draft) => {
    console.log("INIT RATE", coinRate)
    draft.exchangeRate = coinRate
  })
  //console.log('INIT STATE', chainState)

  const { selectedToken, selectedChain, selectedWallet, exchangeRate } =
    chainState
  const [donationForm, setDonationForm] = useAtom(donationFormAtom)
  const { emailReceipt, name, email, amount } = donationForm
  const coinAmount = useAtomValue(amountCoinAtom)
  const usdAmount = useAtomValue(amountUSDAtom)
  console.log("Coin amount", coinAmount, usdAmount)
  const chain = chainConfig[selectedChain]
  const network = chain.networks[appConfig.chainDefaults.network]

  const chainInterface = BlockchainClientInterfaces[selectedWallet]

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

  // Disable chains that don't have wallets
  useEffect(() => {
    async function updateView() {
      console.log("CHAIN STATE", chainState)
      console.log("SELECTED CHAIN", selectedChain)
      const nameToSlug = (name: Chain): ChainSlugs =>
        getChainConfigurationByName(name).slug
      const orgWallets = organization?.wallets.map((w) => nameToSlug(w.chain))
      const initiativeWallets = initiative?.wallets.map((w) =>
        nameToSlug(w.chain),
      )
      const symbol = chain.symbol as TokenTickerSymbol
      const rate = await getRate(symbol)
      setCoinRate(rate)
      console.log("COIN", symbol)
      console.log("RATE", rate)
      setChainState((draft) => {
        draft.enabledChains = [...orgWallets, ...initiativeWallets]
        //draft.exchangeRate = rate
      })
      console.log("UPDATED")
    }
    updateView()
  }, [initiative, organization, selectedChain]) // setChainState, chainState,

  //const destinationWalletAddress = 'raHkr5qJNYez8bQQDMVLwvaRvxMripVznT' // hardcoded for testing
  const destinationWalletAddress = useMemo(() => {
    console.log("CHAIN", chain)
    const chainName = chain?.name
    console.log("NAME", chainName)
    const initiativeWallet = initiative?.wallets?.find(
      (w) => w.chain === chainName,
    )
    console.log("INITIATIVE WALLET", initiativeWallet)
    if (initiativeWallet) {
      return initiativeWallet.address
    }

    const organizationWallet = organization?.wallets.find(
      (w) => w.chain === chainName,
    )?.address

    console.log("ORGANIZATION", organizationWallet)
    if (organizationWallet) {
      return organizationWallet
    }

    // Use fallback address if both initiative and organization wallets are not found
    // There will be no fallback address for production, hence the error will be thrown
    const fallbackAddress = appConfig.chainDefaults?.defaultAddress
    console.log("FALLBACK", fallbackAddress)
    if (fallbackAddress) {
      return fallbackAddress
    }
    return ""
  }, [organization, initiative, chain])

  const checkBalance = useCallback(async () => {
    //if (!chainInterface?.connect) {
    //  const error = new Error("No connect method on chain interface")
    //  throw error
    //}
    //await chainInterface?.connect(network.id)
    console.log("BALANCE")
    const balanceCheck = await chainInterface?.getBalance?.()
    console.log("BALANCED", balanceCheck)
    if (!balanceCheck || "error" in balanceCheck) {
      const error = new Error(balanceCheck?.error ?? "Failed to check balance")
      throw error
    }
    console.log("BALANCE CHECK", { balanceCheck, coinAmount })
    return balanceCheck.balance >= coinAmount
  }, [chainInterface, coinAmount])

  const sendPayment = useCallback(
    async (address: string, amount: number) => {
      //if (!chainInterface?.connect) {
      //  const error = new Error("No connect method on chain interface")
      //  throw error
      //}
      //await chainInterface?.connect(network.id)
      console.log("SEND", address, amount)
      if (!chainInterface?.sendPayment) {
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
        //amount: chainInterface.toBaseUnit(amount),
        memo: appConfig.chains[selectedChain]?.destinationTag || "",
      }
      console.log("SENDING PAYMENT", data)
      const result = await chainInterface.sendPayment(data)
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
    [chainInterface, selectedChain, toast],
  )

  const sendGaslessPayment = useCallback(
    async (address: string, amount: number) => {
      //if (!chainInterface?.connect) {
      //  const error = new Error("No connect method on chain interface")
      //  throw error
      //}
      //await chainInterface.connect(network.id)
      if (!chainInterface?.sendGaslessPayment) {
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

      const result = await chainInterface.sendGaslessPayment({
        address,
        amount,
        memo: appConfig.chains[selectedChain]?.destinationTag,
      })
      console.log("GAS PAYMENT RESULT", result)
      return result
    },
    [chainInterface, toast, selectedChain],
  )

  const handleMinting = useCallback(
    async (paymentResult: {
      success: boolean
      walletAddress?: string
      txid?: string
      error?: string
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
            destinationWalletAddress,
            amount: coinAmount,
            usdValue: usdAmount,
            rate,
            txId: paymentResult.txid ?? "",
            chain: selectedChain,
            token: selectedToken,
          },
        }
        console.log("NFT", data)
        // TODO: increase sleep time? some chains take longer <<<<
        await sleep(2000) // Wait for tx to confirm
        console.log("SLEEP")
        const receiptResult = await mintAndSaveReceiptNFT(data)
        console.log("RESULT", receiptResult)

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
        }, 1800)
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
      destinationWalletAddress,
      amount,
      selectedChain,
      selectedToken,
      setDonationForm,
      toast,
      coinAmount,
      usdAmount,
    ],
  )

  const onSubmit = useCallback(async () => {
    try {
      console.log("SUBMITTING...")
      validateForm({ email })

      if (!chainInterface?.connect) {
        const error = new Error("No connect method on chain interface")
        throw error
      }
      if (!chainInterface?.isConnected()) {
        console.log("CONNECTING...")
        await chainInterface.connect(network.id) // Connect once
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

      console.log("AMOUNTS", coinAmount, usdAmount)

      if (appConfig.siteInfo.options.enableGaslessTransactions) {
        console.log(
          "SENDING GASLESS PAYMENT TO",
          destinationWalletAddress,
          coinAmount,
        )
        paymentResult = await sendGaslessPayment(
          destinationWalletAddress,
          coinAmount,
        )
      } else {
        console.log(
          "SENDING GAS PAYMENT TO",
          destinationWalletAddress,
          coinAmount,
        )
        paymentResult = await sendPayment(destinationWalletAddress, coinAmount)
      }

      if (!paymentResult.success) {
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

      if (!paymentResult.walletAddress) {
        handleError(new Error("No wallet address found"))
        return
      }

      let user = await fetchUserByWallet(paymentResult?.walletAddress || "")

      if (!user) {
        user = await createAnonymousUser({
          walletAddress: paymentResult.walletAddress ?? "",
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
    coinAmount,
    amount,
    email,
    destinationWalletAddress,
    sendPayment,
    checkBalance,
    handleMinting,
    handleError,
    posthog,
    selectedToken,
    selectedChain,
    organization,
    initiative,
    exchangeRate,
    sendGaslessPayment,
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
          <ChainSelect />
          <Label htmlFor="wallet-select" className="mb-2">
            Wallet
          </Label>
          <WalletSelect />
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
                    destinationWalletAddress,
                    coinAmount,
                  )
                  sendPayment(destinationWalletAddress, coinAmount)
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
