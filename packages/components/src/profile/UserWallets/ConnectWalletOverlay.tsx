"use client"

import appConfig, { chainConfig } from "@cfce/app-config"
import {
  BlockchainClientInterfaces,
  getWalletConfiguration,
} from "@cfce/blockchain-tools"
import { chainAtom } from "@cfce/state"
import type { AuthTypes, ChainSlugs, ClientInterfaces } from "@cfce/types"
import { useAtom } from "jotai"
import { Plus } from "lucide-react"
import { useCallback, useState } from "react"
import { useToast } from "../../hooks/use-toast"
import { Button } from "../../ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog"
import { Separator } from "../../ui/separator"
import { connectWallet } from "./actions"

type ConnectWalletOverlayProps = {
  userId: string
  onSuccess?: () => void
}

export function ConnectWalletOverlay({
  userId,
  onSuccess,
}: ConnectWalletOverlayProps) {
  const [chainState, setChainState] = useAtom(chainAtom)
  const { toast } = useToast()
  const enabledWallets = appConfig.auth.filter(
    (w) => !["github", "google"].includes(w),
  ) as ClientInterfaces[]
  // ClientInterfaces is a subset of AuthTypes

  const [open, setOpen] = useState(false)

  const handleWalletConnect = useCallback(
    async (wallet: ClientInterfaces) => {
      setOpen(false)
      const { selectedChain } = chainState
      const chain = chainConfig[selectedChain]
      const chainNetwork = chain.networks[appConfig.chainDefaults.network]

      try {
        const walletInterface = BlockchainClientInterfaces[wallet]
        if (!walletInterface?.connect) {
          throw new Error("Wallet interface not found")
        }

        const walletResponse = await walletInterface.connect(chainNetwork.id)
        if ("error" in walletResponse) {
          throw new Error(walletResponse.error)
        }

        const { walletAddress, chain } = walletResponse

        try {
          await connectWallet(walletAddress, chain)
        } catch (error) {
          console.log("toasting error", error)
          toast({
            title: "Error",
            description:
              error instanceof Error
                ? error.message
                : "Failed to connect wallet",
            variant: "destructive",
          })
          return
        }

        toast({
          title: "Wallet connected",
          description: "Your wallet has been successfully connected.",
        })

        onSuccess?.()
      } catch (error) {
        console.log("toasting error", error)
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to connect wallet",
          variant: "destructive",
        })
      }
    },
    [onSuccess, toast, chainState],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus size={20} />
          <span>Add Wallet</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-80vh overflow-y-scroll">
        <DialogTitle>Connect Wallet</DialogTitle>
        <div className="w-full flex flex-col gap-4">
          <Separator className="my-4" />
          {enabledWallets.map((wallet) => {
            const walletConfig = getWalletConfiguration([wallet])[0]
            return (
              <Button
                key={wallet}
                className="w-full flex items-between gap-2"
                onClick={() => handleWalletConnect(wallet)}
              >
                <img src={walletConfig.icon} alt={wallet} className="w-6 h-6" />
                <span>Connect {walletConfig.name}</span>
              </Button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
