/** @jsxImportSource frog/jsx */

import appConfig from "@cfce/app-config"
import { getUserByCredentials } from "@cfce/auth"
import { getNetworkByChainName } from "@cfce/blockchain-tools"
import { getCoinRate } from "@cfce/blockchain-tools/server"
import type { Chain } from "@cfce/database"
import {
  getInitiativeById,
  getInitiatives,
  getWallets,
  newDonation,
} from "@cfce/database"
import {
  type ReceiptEmailBody,
  ipfsCIDToUrl,
  mintAndSaveReceiptNFT,
  sendEmailReceipt,
} from "@cfce/utils"
import {
  Button,
  Frog,
  TextInput,
  type TransactionParameters,
  parseEther,
} from "frog"
import { devtools } from "frog/dev"
import { handle } from "frog/next"
import { serveStatic } from "frog/serve-static"
import { createSystem } from "frog/ui"
import { v7 as uuidv7 } from "uuid"
import { http, createPublicClient } from "viem"
import { arbitrum, arbitrumSepolia, base, baseSepolia } from "viem/chains"

const arbitrumClient = createPublicClient({
  chain:
    appConfig.chainDefaults.network === "mainnet" ? arbitrum : arbitrumSepolia,
  transport: http(),
})

const baseClient = createPublicClient({
  chain: appConfig.chainDefaults.network === "mainnet" ? base : baseSepolia,
  transport: http(),
})

const { vars } = createSystem()

const app = new Frog<{
  State: {
    chain: Chain
    initiative: {
      id: string
      title: string
      defaultAsset: string | null
      created: Date
      organization: {
        id: string
        name: string
      } | null
    } | null
    transaction: {
      amount: string // USD amount
      value: string // Crypto value
      symbol: "ETH" | "DEGEN" | "MOXIE" | "ARB"
      rate: number
    }
  }
}>({
  assetsPath: "/",
  basePath: "/api",
  title: appConfig.siteInfo.title,
  ui: { vars },
  imageOptions: {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Inter",
        weight: 400,
        source: "google",
      },
      {
        name: "Inter",
        weight: 700,
        source: "google",
      },
    ],
  },
  initialState: {
    chain: "Base" as const,
    initiative: null,
    transaction: {
      amount: "0",
      value: "0",
      symbol: "ETH",
      rate: 0,
    },
  },
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'
let rate: number
let recipient: string

interface ExtendedEmailBody extends ReceiptEmailBody {
  email: string
}
const DonorData: ExtendedEmailBody = {
  address: "",
  coinSymbol: "",
  coinValue: "",
  date: "",
  donorName: "",
  ein: "",
  organizationName: "",
  usdValue: "",
  email: "",
}

//  background: 'linear-gradient(to right, #432889, #17101F)'
const background = {
  alignItems: "center",
  color: "white",
  background: "hsl(215, 25%, 27%)",
  backgroundSize: "100% 100%",
  display: "flex",
  flexDirection: "column",
  flexWrap: "nowrap",
  fontSize: 30,
  fontStyle: "normal",
  height: "100%",
  padding: "20px",
  justifyContent: "center",
  textAlign: "center",
  width: "100%",
}

const warning = {
  alignItems: "center",
  color: "white",
  background: "linear-gradient(to right, #991b1b, #171717)",
  backgroundSize: "100% 100%",
  display: "flex",
  flexDirection: "column",
  flexWrap: "nowrap",
  fontSize: 30,
  fontStyle: "normal",
  height: "100%",
  padding: "20px",
  justifyContent: "center",
  textAlign: "center",
  width: "100%",
}

const chainIdIsEip155 = (
  id: string,
): id is TransactionParameters["chainId"] => {
  return [
    1, 10, 100, 137, 8453, 42161, 42170, 84532, 421614, 7777777, 11155111,
    11155420, 666666666,
  ]
    .map((id) => `eip155:${id}`)
    .includes(id)
}

app.frame("/", async (c) => {
  const featuredInitiatives = await getInitiatives(
    {},
    { where: { id: { in: appConfig.siteInfo.featuredInitiatives } } },
  )

  return c.res({
    // action: "/initiative",
    image: (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "10px",
          padding: "10px",
          width: "100%",
          height: "100%",
        }}
      >
        {featuredInitiatives.slice(0, 4).map((initiative) => (
          <div
            key={initiative.id}
            style={{
              display: "flex",
              flex: "1 1 45%",
              minWidth: "45%",
              height: "45%",
            }}
          >
            <img
              key={initiative.id}
              src={initiative.defaultAsset || "/givecast.jpg"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px",
              }}
              alt={initiative.title}
            />
          </div>
        ))}
      </div>
    ),
    intents: featuredInitiatives.map((initiative) => (
      <Button
        value={initiative.id}
        key={initiative.id}
        action={`/initiative/${initiative.id}`}
      >
        {initiative.title}
      </Button>
    )),
  })
})

// Add this helper function at the top level
const parseAmount = (inputText?: string, buttonValue?: string) => {
  let amount = 0
  if (inputText !== undefined) {
    amount = Number(inputText || 0)
  } else {
    amount = Number(buttonValue || 0)
  }
  return amount
}

// Remove amount handling from initiative/:id frame and just route to choose-currency
app.frame("/initiative/:id", async (c) => {
  const { buttonValue, inputText, frameData, deriveState, previousState, req } =
    c
  const id = c.req.param("id")
  const chain = c.req.query("chain")

  // Set chain state if different
  // Note: We're mutating previousState directly as a workaround for https://github.com/wevm/frog/issues/182
  if (previousState.chain !== chain) {
    previousState.chain = chain as Chain
  }

  // Fetch and set initiative data first
  const fullInitiative = await getInitiativeById(id)
  if (!fullInitiative) {
    return c.error({
      message: "Initiative not found",
    })
  }

  // Set initiative state
  previousState.initiative = {
    id: fullInitiative.id,
    title: fullInitiative.title,
    defaultAsset: fullInitiative.defaultAsset,
    created: fullInitiative.created,
    organization: fullInitiative.organization
      ? {
          id: fullInitiative.organization.id,
          name: fullInitiative.organization.name,
        }
      : null,
  }

  return c.res({
    action: "/choose-currency",
    image: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          width: "100%",
          height: "100%",
          justifyContent: "flex-end",
          overflow: "hidden",
          backgroundColor: "#000000", // Fallback background color
        }}
      >
        <img
          src={fullInitiative?.defaultAsset || "/givecast.jpg"} // Use fallback image
          alt={fullInitiative?.title || "Initiative"}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 10%",
            zIndex: 0,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            padding: "16px",
            background: "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))",
            color: "white",
            zIndex: 1,
            width: "100%",
            gap: "8px",
            paddingTop: "50px",
          }}
        >
          <h2
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              margin: 0,
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {fullInitiative?.title || "Initiative"}
          </h2>
          <p
            style={{
              fontSize: "24px",
              margin: 0,
              opacity: 0.9,
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
            }}
          >
            {fullInitiative?.created
              ? new Date(fullInitiative.created).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Date unavailable"}
          </p>
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter amount to donate in USD" key="input" />,
      <Button value="5" key="5">
        $5
      </Button>,
      <Button value="10" key="10">
        $10
      </Button>,
      <Button value="20" key="20">
        $20
      </Button>,
      <Button value="input" key="next">
        Next
      </Button>,
      <Button value="back" key="back">
        Go Back
      </Button>,
    ],
  })
})

// Update choose-currency to handle amount for Base chain
app.frame("/choose-currency", async (c) => {
  const { buttonValue, inputText, deriveState, previousState } = c
  const { chain } = previousState

  // Handle amount first
  const amount = parseAmount(inputText, buttonValue)
  console.log("AMOUNT", amount, inputText, buttonValue)
  if (amount <= 0) {
    return c.error({
      message: "Please enter a valid amount",
    })
  }

  // Set initial transaction state
  deriveState((prevState) => {
    prevState.transaction.amount = amount.toFixed(2)
  })

  const currencies = CHAIN_CURRENCIES[chain]

  if (!currencies) {
    return c.error({
      message: `No currencies found for this chain: ${chain}`,
    })
  }

  return c.res({
    action: "/confirmation",
    // imageOptions: {
    //   debug: true,
    // },
    image: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          color: "white",
          padding: "32px",
          justifyContent: "space-between",
        }}
      >
        <h2
          style={{
            fontSize: "36px",
            fontWeight: "bold",
            margin: 0,
            marginBottom: "32px",
            textAlign: "center",
          }}
        >
          Choose Currency
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
          }}
        >
          {currencies.map((currency) => (
            <img
              key={currency.name}
              src={currency.icon}
              alt={`${currency.name} icon`}
              style={{
                width: "140px",
                height: "140px",
                objectFit: "contain",
              }}
            />
          ))}
        </div>
      </div>
    ),
    intents: currencies.map((currency) => (
      <Button value={currency.name} key={currency.name.toLowerCase()}>
        {currency.name}
      </Button>
    )),
  })
})

// Update confirmation to handle amount for non-Base chain
app.frame("/confirmation", async (c) => {
  const {
    buttonValue,
    inputText,
    frameData,
    previousState,
    deriveState,
    transactionId,
  } = c
  const initiative = previousState?.initiative
  const organization = initiative?.organization
  const transaction = previousState?.transaction

  console.log("TRANSACTION ID", transactionId)

  if (!initiative) {
    return c.error({
      message: "Initiative not found",
    })
  }

  // If coming from initiative frame (non-Base chain), handle amount
  if (!transaction.amount) {
    const amount = parseAmount(inputText, buttonValue)
    if (amount <= 0) {
      return c.error({
        message: "Please enter a valid amount",
      })
    }
    deriveState((prevState) => {
      prevState.transaction.amount = amount.toFixed(2)
    })
  }

  // Get the current transaction state (either just set or from previous frame)
  const currentTransaction = transaction || previousState?.transaction
  if (!currentTransaction) {
    throw new Error("No transaction details found")
  }

  // Update symbol if coming from choose-currency
  const symbol = buttonValue
    ? (buttonValue as "ETH" | "DEGEN" | "MOXIE" | "ARB")
    : (currentTransaction.symbol as "ETH" | "DEGEN" | "MOXIE" | "ARB")

  // Calculate value based on selected currency
  const rate = await getCoinRate({ symbol })
  const value = Number(currentTransaction.amount) / rate

  // Update transaction state
  deriveState((prevState) => {
    if (prevState.transaction) {
      prevState.transaction.symbol = symbol
      prevState.transaction.value = value.toFixed(18)
      prevState.transaction.rate = rate
    }
  })

  // Update DonorData
  DonorData.coinSymbol = symbol as "ETH" | "DEGEN" | "MOXIE" | "ARB"
  DonorData.organizationName = organization?.name || "Unknown"
  DonorData.usdValue = currentTransaction.amount
  DonorData.coinValue = value.toFixed(18)

  const pageContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "linear-gradient(to bottom, #1a1a1a, #2d2d2d)",
        color: "white",
        padding: "48px",
        fontFamily: "Inter",
      }}
    >
      {/* Main Content Card */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          flex: 1,
          justifyContent: "space-between",
          boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.25)",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            margin: 0,
            fontWeight: "bold",
            padding: "32px",
          }}
        >
          Donation Summary
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "16px",
            padding: "32px",
            paddingLeft: "64px",
            flexGrow: 1,
            borderBottom: "1px solid #e2e8f0",
            borderTop: "1px solid #e2e8f0",
            alignItems: "center",
          }}
        >
          {initiative?.defaultAsset && (
            <img
              src={ipfsCIDToUrl(initiative?.defaultAsset)}
              alt="Logo"
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
              }}
            />
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <h2 style={{ fontSize: "32px", margin: 0, color: "#e2e8f0" }}>
              {initiative?.title}
            </h2>
            <p style={{ fontSize: "24px", margin: 0, color: "#94a3b8" }}>
              {organization?.name || "Independent Initiative"}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "32px",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={{ fontSize: "36px", margin: 0, fontWeight: "bold" }}>
              ${currentTransaction.amount} USD
            </p>
            <p style={{ fontSize: "24px", margin: 0, color: "#94a3b8" }}>
              {value.toFixed(4)} {symbol}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const targetEndpoint = symbol === "ETH" ? "/send-ether" : "/send-token"

  return c.res({
    image: pageContent,
    intents: [
      <Button.Transaction
        target={targetEndpoint}
        action="/mintquery"
        key="confirm"
      >
        Confirm
      </Button.Transaction>,
      <Button.Reset key="reset">Start Over</Button.Reset>,
    ],
  })
})

app.frame("/mintquery", async (c) => {
  const { transactionId, previousState, initialPath } = c

  const initiative = previousState?.initiative
  const chain = previousState?.chain
  console.log("TX", transactionId)

  const client = chain === "Base" ? baseClient : arbitrumClient

  const confirmed = {
    image: (
      <div style={background}>
        <p style={{ fontSize: 60 }}>Thank you for your donation</p>
        <p style={{ fontSize: 40 }}>
          Minting an NFT receipt representing your donation...
        </p>
      </div>
    ),
    intents: [
      <Button.Link href="/addnft" key="addnft">
        Add NFT to MetaMask
      </Button.Link>,
      <Button.Reset key="done">Done</Button.Reset>,
    ],
  }

  const rejected = {
    action: initiative ? `/initiative/${initiative.id}` : "/",
    image: (
      <div style={warning}>
        <p style={{ fontSize: 60 }}>Transaction not successful</p>
      </div>
    ),
    intents: [
      <Button value="Retry" key="retry">
        Retry
      </Button>,
      <Button.Reset key="home">Home Page</Button.Reset>,
    ],
  }

  if (!transactionId) {
    return c.res(rejected)
  }

  // Wait for confirmation
  const secs = 1000
  const wait = [2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6] // 60 secs / 15 loops
  let count = 0
  let info = null
  while (count < wait.length) {
    console.log("Retry", count)
    await new Promise((res) => setTimeout(res, wait[count] * secs))
    count++
    try {
      info = await client.getTransactionReceipt({ hash: transactionId })
    } catch (ex) {
      console.error(ex)
      continue
    }
    const network = getNetworkByChainName(chain)
    console.log("INFO", info)
    if (info?.status === "success") {
      console.log("TX SUCCESS")
      // TODO: create user profile from address
      // const user = await checkUser(DonorData?.address || "")
      const user = await getUserByCredentials({
        address: DonorData?.address || "",
        chain,
        network: appConfig.chainDefaults.network,
        currency: "USD",
        chainId: `${network.id}`,
        id: uuidv7(),
      })
      console.log("USER", user?.id)
      if (user?.id && initiative?.organization) {
        const DonationData = {
          userId: user.id,
          organization: {
            connect: {
              id: initiative.organization.id,
            },
          },
          initiative: {
            connect: {
              id: initiative.id,
            },
          },
          usdvalue: Number(DonorData.usdValue),
          amount: Number(DonorData.coinValue),
          asset: DonorData.coinSymbol,
          wallet: DonorData.address,
          chain: chain as Chain,
          network: "testnet",
          paytype: "crypto",
          status: 1,
        }
        const DonationResponse = await newDonation(DonationData)
        console.log("Donation saved", DonationResponse)
        const nftResponse = await mintAndSaveReceiptNFT({
          transaction: {
            txId: transactionId,
            chain: network.slug,
            token: DonorData.coinSymbol as "ETH" | "DEGEN" | "MOXIE" | "ARB",
            donorWalletAddress: DonorData.address,
            destinationWalletAddress: DonorData.address,
            amount: Number(DonorData.coinValue),
            usdValue: Number(DonorData.usdValue),
            rate: previousState.transaction.rate,
            date: new Date().toISOString(),
          },
          initiativeId: initiative.id,
          organizationId: initiative.organization.id,
          donorName: user.name,
          email: DonorData.email,
        })
        // Update the confirmed response with the NFT ID
        if (nftResponse?.success && "tokenId" in nftResponse) {
          confirmed.intents = [
            <Button.Link
              href={`/addnft?tokenId=${nftResponse.tokenId}&chain=${chain}`}
              key="addnft"
            >
              Add NFT to MetaMask
            </Button.Link>,
            <Button.Reset key="done">Done</Button.Reset>,
          ]
        }
      }
      if (DonorData.email !== "") {
        console.log(DonorData.email)
        const receiptResp = await sendEmailReceipt(DonorData.email, DonorData)
        console.log("Receipt sent", receiptResp)
      }
      return c.res(confirmed)
    }
    console.log("TX FAILED")
    return c.res(rejected)
  }
  console.log("TX TIMED OUT")
  return c.res(rejected)
})

app.transaction("/send-ether", async (c) => {
  const {
    inputText = "",
    frameData,
    previousState: { initiative, transaction },
    initialPath,
  } = c
  const chain = initialPath.match(/Arbitrum/) ? "Arbitrum" : "Base"

  if (!initiative) {
    return c.error({
      message: "Initiative not found",
    })
  }

  const { id } = getNetworkByChainName(chain)
  const chainId = `eip155:${id}`
  if (!chainIdIsEip155(chainId)) {
    return c.error({
      message: "Invalid chain selected",
    })
  }

  let wallet = ""
  const initiativeWallets = await getWallets({
    initiativeId: initiative.id,
    chain,
  })
  if (initiativeWallets) {
    wallet = initiativeWallets[0]?.address || ""
  }
  if (!wallet && initiative.organization) {
    const orgWallets = await getWallets({
      orgId: initiative.organization.id,
      chain,
    })
    if (orgWallets) {
      wallet = orgWallets[0]?.address || ""
    }
  }
  if (!wallet) {
    return c.error({
      message: "No wallet found for this initiative",
    })
  }

  DonorData.email = inputText
  recipient = frameData?.address || ""
  DonorData.address = recipient

  console.log("SEND ETHER", transaction?.value)

  return c.send({
    chainId,
    to: wallet as `0x${string}`,
    value: parseEther(transaction?.value || "0"),
  })
})

// Add ERC20 ABI for the transfer function
const erc20Abi = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const

app.transaction("/send-token", async (c) => {
  const {
    inputText = "",
    frameData,
    buttonValue,
    previousState: {
      initiative,
      transaction: { symbol, value },
      chain,
    },
  } = c

  if (!initiative) {
    return c.error({
      message: "Initiative not found",
    })
  }

  if (chain !== "Base") {
    return c.error({
      message: "Token transfers only available on Base chain",
    })
  }

  const network = getNetworkByChainName(chain)
  const chainId = `eip155:${network.id}`
  if (!chainIdIsEip155(chainId)) {
    return c.error({
      message: "Invalid chain selected",
    })
  }

  // Get recipient wallet
  let wallet = ""
  const initiativeWallets = await getWallets({
    initiativeId: initiative.id,
    chain,
  })
  if (initiativeWallets) {
    wallet = initiativeWallets[0]?.address || ""
  }
  if (!wallet && initiative.organization) {
    const orgWallets = await getWallets({
      orgId: initiative.organization.id,
      chain,
    })
    if (orgWallets) {
      wallet = orgWallets[0]?.address || ""
    }
  }
  if (!wallet) {
    return c.error({
      message: "No wallet found for this initiative",
    })
  }

  // Get token details from button value
  if (!symbol || !["DEGEN", "MOXIE", "ARB"].includes(symbol)) {
    console.log("INVALID TOKEN", symbol)
    return c.error({
      message: "Invalid token selected (allowed: DEGEN, MOXIE, ARB)",
    })
  }
  const token = network.tokens.find((token) => token.symbol === symbol)
  if (!token) {
    return c.error({
      message: "Token not found",
    })
  }

  // Store transaction details
  DonorData.email = inputText
  recipient = frameData?.address || ""
  DonorData.address = recipient
  DonorData.coinSymbol = symbol.toUpperCase()

  // Get token contract address
  const tokenAddress = getNetworkByChainName(chain).tokens.find(
    (token) => token.symbol === symbol,
  )?.contract

  if (!tokenAddress) {
    return c.error({
      message: "Token contract not found",
    })
  }

  console.log(
    "SEND TOKEN",
    value,
    token.decimals,
    BigInt(Number(value) * 10 ** token.decimals),
  )

  return c.contract({
    chainId,
    to: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "transfer",
    args: [
      wallet as `0x${string}`,
      BigInt(Number(value) * 10 ** token.decimals),
    ],
  })
})

app.transaction("/add-nft", (c) => {
  const { initialPath } = c
  const chain = initialPath.match(/Arbitrum/) ? "Arbitrum" : "Base"
  const network = getNetworkByChainName(chain)
  const address = network.contracts?.ReceiptNFT
  const image = "https://give-cast.vercel.app/givecast.jpg"
  const symbol = "GIVE"
  const decimals = 0
  const tokenId = 1
  const chainId = `eip155:${network.id}`
  if (!chainIdIsEip155(chainId)) {
    return c.error({
      message: "Invalid chain selected",
    })
  }
  console.log("WATCH...", chainId, address)
  return c.res({
    chainId,
    // @ts-ignore this is a valid method
    method: "wallet_watchAsset",
    params: {
      // @ts-ignore this is a valid parameter
      type: "ERC721",
      options: {
        address,
        decimals,
        image,
        symbol,
        tokenId,
      },
    },
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
const CHAIN_CURRENCIES: Partial<
  Record<Chain, { name: string; icon: string }[]>
> = {
  Base: [
    { name: "DEGEN", icon: "/icons/degen.png" },
    { name: "MOXIE", icon: "/icons/moxie.png" },
    { name: "ETH", icon: "/icons/eth.png" },
  ],
  Arbitrum: [
    // { name: "ARB", icon: "/icons/arb.png" },
    { name: "ETH", icon: "/icons/eth.png" },
  ],
} as const
