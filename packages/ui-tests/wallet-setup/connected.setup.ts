import { defineWalletSetup } from "@synthetixio/synpress"
import { MetaMask, getExtensionId } from "@synthetixio/synpress/playwright"
import { PASSWORD, SEED_PHRASE } from "./basic.setup"
import { initialSetup } from "@synthetixio/synpress/commands/metamask";

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const extensionId = await getExtensionId(context, "MetaMask")
  // Create a new MetaMask instance
  const metamask = new MetaMask(context, walletPage, PASSWORD)
})

