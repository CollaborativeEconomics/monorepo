/** @jsxImportSource frog/jsx */

import appConfig from "@cfce/app-config"
import { getNetworkByChainName } from "@cfce/blockchain-tools"
import { getCoinRate } from "@cfce/blockchain-tools/server"
import type { Chain, Prisma } from "@cfce/database"
import { getInitiativeById, getInitiatives, getWallets } from "@cfce/database"
import { type ReceiptEmailBody, sendEmailReceipt } from "@cfce/utils"
import {
  Button,
  Frog,
  TextInput,
  type TransactionParameters,
  parseEther,
} from "frog"
import { devtools } from "frog/dev"
import { type NeynarVariables, neynar } from "frog/middlewares"
import { handle } from "frog/next"
import { serveStatic } from "frog/serve-static"
import { createSystem } from "frog/ui"
import { http, createPublicClient } from "viem"
import { arbitrumSepolia } from "viem/chains"
import { ConfirmIntent, checkUser, mintNft, newDonation } from "~/utils"

const client = createPublicClient({
  chain: arbitrumSepolia,
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
      symbol: string // ETH/DEGEN/MOXIE
    } | null
  }
}>({
  assetsPath: "/",
  basePath: "/api",
  title: appConfig.siteInfo.title,
  ui: { vars },
  initialState: {
    chain: "Base" as const,
    initiative: null,
    transaction: null,
  },
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' }),
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
  background: "#334155",
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

//app.use(
//neynar({
//  apiKey: 'NEYNAR_FROG_FM',
//  features: ['interactor', 'cast'],
//})
//);

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
  const { deriveState, req } = c
  const chain = req.query("chain")
  if (chain && ["Base", "Arbitrum"].includes(chain)) {
    deriveState((prevState) => {
      prevState.chain = chain as Chain
    })
  }

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
    amount = Number.parseInt(inputText || "0") || 0
  } else {
    amount = Number.parseInt(buttonValue || "0") || 0
  }
  return amount
}

// Remove amount handling from initiative/:id frame and just route to choose-currency
app.frame("/initiative/:id?", async (c) => {
  const { buttonValue, inputText, frameData, deriveState, previousState } = c
  const id = c.req.param("id") || ""
  const chain = previousState?.chain

  // Fetch and set initiative data first
  const fullInitiative = await getInitiativeById(id)
  if (fullInitiative) {
    deriveState((prevState) => {
      prevState.initiative = {
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
    })
  }

  // Just route to the appropriate next frame
  const nextAction = chain === "Base" ? "/choose-currency" : "/confirmation"

  return c.res({
    action: nextAction,
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
  const { buttonValue, inputText, previousState, deriveState } = c
  const { chain } = previousState

  // Handle amount first
  const amount = parseAmount(inputText, buttonValue)
  if (amount <= 0) {
    return c.res({
      action: `/initiative/${previousState?.initiative?.id || ""}`,
      image: (
        <div style={warning}>
          <p style={{ fontSize: 60 }}>Please enter a valid amount</p>
        </div>
      ),
      intents: [
        <Button value="back" key="back">
          Go Back
        </Button>,
      ],
    })
  }

  // Set initial transaction state
  deriveState((prevState) => {
    prevState.transaction = {
      amount: amount.toFixed(2),
      value: "0",
      symbol: "ETH", // Will be updated when currency is selected
    }
  })

  const currencies = [
    { name: "DEGEN", icon: "/icons/degen.png" },
    { name: "MOXIE", icon: "/icons/moxie.png" },
    { name: "ETH", icon: "/icons/eth.png" },
  ] as const // Make this a const array to help with type inference

  return c.res({
    action: "/confirmation",
    image: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#334155",
          color: "white",
          padding: "32px",
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
            flex: 1,
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
  const { buttonValue, inputText, frameData, previousState, deriveState } = c
  const initiative = previousState?.initiative
  const organization = initiative?.organization
  const transaction = previousState?.transaction
  const { chain } = previousState

  // If coming from initiative frame (non-Base chain), handle amount
  if (!transaction) {
    const amount = parseAmount(inputText, buttonValue)
    if (amount <= 0) {
      return c.res({
        action: `/initiative/${initiative?.id || ""}`,
        image: (
          <div style={warning}>
            <p style={{ fontSize: 60 }}>Please enter a valid amount</p>
          </div>
        ),
        intents: [
          <Button value="back" key="back">
            Go Back
          </Button>,
        ],
      })
    }

    // Set initial transaction state
    deriveState((prevState) => {
      prevState.transaction = {
        amount: amount.toFixed(2),
        value: "0",
        symbol: "ETH",
      }
    })
  }

  // Get the current transaction state (either just set or from previous frame)
  const currentTransaction = transaction || previousState?.transaction
  if (!currentTransaction) {
    throw new Error("No transaction details found")
  }

  // Update symbol if coming from choose-currency
  const symbol = buttonValue
    ? (buttonValue as "ETH" | "DEGEN" | "MOXIE")
    : (currentTransaction.symbol as "ETH" | "DEGEN" | "MOXIE")

  // Calculate value based on selected currency
  const rate = await getCoinRate({ symbol })
  const value = Number(currentTransaction.amount) / rate

  // Update transaction state
  deriveState((prevState) => {
    if (prevState.transaction) {
      prevState.transaction.symbol = symbol
      prevState.transaction.value = value.toFixed(18)
    }
  })

  // Update DonorData
  DonorData.coinSymbol = symbol
  DonorData.organizationName = organization?.name || "Unknown"
  DonorData.usdValue = currentTransaction.amount
  DonorData.coinValue = value.toFixed(18)

  const pageContent = (
    <div style={background}>
      <p style={{ margin: 0, padding: 0 }}>Donate to</p>
      <p
        style={{
          margin: 0,
          fontSize: 60,
          fontStyle: "normal",
          letterSpacing: "-0.025em",
          lineHeight: 1.4,
          whiteSpace: "pre-wrap",
        }}
      >
        {initiative?.title}
      </p>
      <p style={{ margin: 0, padding: 0 }}>a {organization?.name} initiative</p>
      <p style={{ margin: 0, padding: 0, marginTop: 40, fontSize: 40 }}>
        You will send ${currentTransaction.amount} USD
      </p>
      <p style={{ margin: 0, padding: 0 }}>
        As {value.toFixed(4)} {symbol}
      </p>
    </div>
  )

  const targetEndpoint = symbol === "ETH" ? "/send-ether" : "/send-token"

  return c.res({
    action: targetEndpoint,
    image: pageContent,
    intents: [
      <Button.Transaction
        target={targetEndpoint}
        action={symbol.toLowerCase()}
        key="confirm"
      >
        Confirm
      </Button.Transaction>,
      <Button value="back" key="back">
        Go Back
      </Button>,
    ],
  })
})

app.frame("/mintquery", async (c) => {
  const { transactionId, previousState } = c

  const initiative = previousState?.initiative
  console.log("TX", transactionId)

  const confirmed = {
    action: "/mint-nft",
    image: (
      <div style={background}>
        <p style={{ fontSize: 60 }}>Thank you for your donation</p>
        <p style={{ fontSize: 40 }}>
          Mint an NFT receipt representing your donation?
        </p>
      </div>
    ),
    intents: [
      <Button value="yes" key="yes">
        Mint NFT
      </Button>,
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

  if (transactionId) {
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
      console.log("INFO", info)
      if (info?.status === "success") {
        console.log("TX SUCCESS")
        // TODO: create user profile from address
        const user = await checkUser(DonorData?.address || "")
        console.log("USER", user.id)
        if (user?.id && initiative?.organization) {
          const DonationData = {
            created: new Date(),
            userId: user.id,
            organizationId: initiative.organization.id,
            initiativeId: initiative.id,
            usdvalue: DonorData.usdValue,
            amount: DonorData.coinValue,
            asset: DonorData.coinSymbol,
            wallet: DonorData.address,
            chain: process.env.NEXT_PUBLIC_BLOCKCHAIN,
            network: "testnet",
            paytype: "crypto",
          }
          const DonationResponse = await newDonation(DonationData)
          console.log("Donation saved", DonationResponse)
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
  }
  return c.res(rejected)
})

app.frame("/mint-nft", async (c) => {
  const { buttonValue } = c
  console.log(recipient)
  let mintingReceipt: Record<string, unknown> = {}

  if (buttonValue === "yes") {
    if (recipient !== undefined) {
      mintingReceipt = await mintNft(recipient)
      console.log("NFT", mintingReceipt)
    }

    return c.res({
      action: "/",
      image: (
        <div style={background}>
          <p style={{ fontSize: 60 }}>NFT Minted</p>
          <p style={{ fontSize: 30 }}>
            Copy the contract Id and token Id below to import your NFT into your
            wallet
          </p>
          <p style={{ fontSize: 20 }}>
            Contract: {process.env.MINTER_CONTRACT}
          </p>
          <p style={{ fontSize: 30 }}>
            Token ID: {mintingReceipt?.nftId || "0"}
          </p>
        </div>
      ),
      intents: [
        <Button.Link
          href={`/addnft?tokenId=${mintingReceipt?.nftId}`}
          key="addnft"
        >
          Add NFT to MetaMask
        </Button.Link>,
        <Button value="Featured" key="featured">
          More initiatives
        </Button>,
      ],
    })
  }

  return c.res({
    action: "/",
    image: (
      <div style={warning}>
        <p style={{ fontSize: 60 }}>Minting not successful</p>
      </div>
    ),
    intents: [
      <Button.Link href="https://cfce.io" key="contact">
        Contact Support
      </Button.Link>,
      <Button.Reset key="home">Home Page</Button.Reset>,
    ],
  })
})

app.transaction("/send-ether", async (c) => {
  const {
    inputText = "",
    frameData,
    buttonValue,
    previousState: { chain, initiative },
  } = c

  console.log("SEND ETHER", c)
  if (!initiative) {
    throw new Error("No initiative found")
  }

  const { id } = getNetworkByChainName(chain)
  const chainId = `eip155:${id}`
  if (!chainIdIsEip155(chainId)) {
    throw new Error("Invalid chain ID")
  }
  let wallet = ""
  const initiativeWallets = await getWallets({
    initiativeId: initiative.id,
    chain,
  })
  if (initiativeWallets) {
    wallet = initiativeWallets[0]?.address
  }
  if (!wallet) {
    const orgWallets = await getWallets({
      orgId: initiative?.organization?.id,
      chain,
    })
    if (orgWallets) {
      wallet = orgWallets[0]?.address
    }
  }
  if (!wallet) {
    throw new Error("No wallet address found")
  }
  console.log("AMT", buttonValue)
  DonorData.email = inputText
  recipient = frameData?.address || ""
  DonorData.address = recipient

  return c.send({
    chainId,
    to: wallet.address as `0x${string}`,
    value: parseEther(buttonValue || "0"),
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

// Token addresses on Base
const TOKEN_ADDRESSES = {
  degen: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed" as `0x${string}`,
  moxie: "0x7EA4C29D3d787F2d52CB63D615E25B57E7559867" as `0x${string}`,
} as const

app.transaction("/send-token", async (c) => {
  const {
    inputText = "",
    frameData,
    buttonValue,
    previousState: { chain, initiative },
  } = c

  if (!initiative) {
    throw new Error("No initiative found")
  }

  if (chain !== "Base") {
    throw new Error("Token transfers only available on Base chain")
  }

  const { id } = getNetworkByChainName(chain)
  const chainId = `eip155:${id}`
  if (!chainIdIsEip155(chainId)) {
    throw new Error("Invalid chain ID")
  }

  // Get recipient wallet
  const wallets = await getWallets({ initiativeId: initiative.id, chain })
  if (!wallets || !Array.isArray(wallets) || wallets.length === 0) {
    throw new Error("No wallet address found")
  }
  const wallet = wallets[0]

  // Get token details from button value
  const tokenSymbol = buttonValue?.toLowerCase()
  if (!tokenSymbol || !["degen", "moxie"].includes(tokenSymbol)) {
    throw new Error("Invalid token selected")
  }

  // Store transaction details
  DonorData.email = inputText
  recipient = frameData?.address || ""
  DonorData.address = recipient
  DonorData.coinSymbol = tokenSymbol.toUpperCase()

  // Get token contract address
  const tokenAddress =
    TOKEN_ADDRESSES[tokenSymbol as keyof typeof TOKEN_ADDRESSES]

  return c.contract({
    chainId,
    to: tokenAddress,
    abi: erc20Abi,
    functionName: "transfer",
    args: [wallet.address as `0x${string}`, parseEther(DonorData.coinValue)],
  })
})

/*
const frameError = {
  image: (
    <div style={warning}>
      <p style={{fontSize: 60}}>Error in Transaction</p>
    </div>
  ),
  intents: [
    <Button.Reset key="reset">Home Page</Button.Reset>
  ]
}

const frameSuccess = {
  image: (
    <div style={background}>
      <p style={{fontSize: 60}}>Transaction successful</p>
    </div>
  ),
  intents: [
    <Button.Reset key="reset">Home Page</Button.Reset>
  ]
}

app.frame('/watchresult', async (c) => {
  console.log('WATCH RES', c)
  const { transactionId } = c;
  console.log('TX', transactionId)
  if(!transactionId){
    return c.res(frameError)
  }
  return c.res(frameSuccess)
});


app.transaction('/addnft', (c) => {
  console.log('WATCH...')
  const address = '0xeea9557589cfff5dd3d849da94201fa8cb782c12'
  const image = 'https://give-cast.vercel.app/givecast.jpg'
  const symbol = 'GIVE'
  const decimals = 0
  const tokenId = 1
  return c.res({
    chainId: 'eip155:421614',
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC721',
      options: {
        address,
        image,
        symbol,
        decimals,
        tokenId
      }
    }
  })
})
*/

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
