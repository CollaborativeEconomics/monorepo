import type { AppConfig, AuthTypes } from "@cfce/types"
import chainConfig from "../../chainConfig"
import appConfigBase from "../appConfigBase"
const appConfig: AppConfig = {
  ...appConfigBase,
}

// Override siteInfo
appConfig.siteInfo = {
  ...appConfig.siteInfo,
  title: "Give Credit",
  description: "Make tax-deductible donations of carbon credits",
  // TODO: add featuredInitiative
  featuredInitiatives: [],
  options: {
    ...appConfig.siteInfo.options,
    showCarbonCreditDisplay: true,
  },
}

// Override chains
appConfig.chains = {
  stellar: {
    ...chainConfig.stellar.networks.mainnet,
    contracts: {
      ...chainConfig.stellar.networks.mainnet.contracts,
      Credits: "CAIRWEYKTLVRQBXQGYNLDUAKWIUV4NO6WPTCMVHH2BOMUUUBTXRJF43R",
      Receipt_NFT: "CCUOIXOK4BIV2O7ANQ2JKUCMQS7JUQW3XISWNZTEQUIUGPHX7I5KV5UD",
      //Receipt_NFT: "CCYC5GDX24OYLYE26NGCBHRCBJESATEYJBANOOBVJZLSCZVFTS6GQ77T",
      //Receipt_NFT: "CDCTS77MPY6GXTGMFFIOWINMPBX4G7DELFEV34KTX5N2DZH43TGHMNU3",
    },
    enabledWallets: ["freighter"],
  },
}

// Override auth
appConfig.auth = ["freighter" as AuthTypes]

// Override chainDefaults
appConfig.chainDefaults = {
  network: "mainnet",
  wallet: "freighter",
  chain: "stellar",
  coin: "XLM",
}

export default appConfig
