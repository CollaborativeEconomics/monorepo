import { http, createPublicClient, createWalletClient } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { arbitrumSepolia } from "viem/chains"
import { mintingContract } from "./erc721"
const contractAddress = process.env.MINTER_CONTRACT as `0x`

const privateKey = process.env.MINTER_PRIVATE
if (!privateKey) {
  throw new Error("MINTER_PRIVATE environment variable is required")
}

if (!privateKey.startsWith("0x")) {
  throw new Error("MINTER_PRIVATE must start with 0x")
}

const account = privateKeyToAccount(privateKey as `0x${string}`)

export const client = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(),
})

const walletClient = createWalletClient({
  account,
  chain: arbitrumSepolia,
  transport: http(),
})

export async function mintNft(toAddress: string) {
  console.log("minting nft to address", toAddress)
  try {
    const { request }: any = await client.simulateContract({
      address: mintingContract.address as `0x${string}`,
      abi: mintingContract.abi,
      account,
      functionName: "mintNFT",
      args: [toAddress as `0x${string}`, "mint"],
    })
    const txId = await walletClient.writeContract(request)
    console.log("TXID", txId)
    // Wait for confirmation and get NFT ID

    // Wait for confirmation
    const secs = 1000
    const wait = [2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6] // 60 secs / 15 loops
    let nftId = 0
    let count = 0
    let info = null
    while (count < wait.length) {
      console.log("Retry", count)
      await new Promise((res) => setTimeout(res, wait[count] * secs))
      count++
      try {
        info = await client.getTransactionReceipt({ hash: txId })
      } catch (ex) {
        console.error(ex)
        continue
      }
      console.log("TX", info)
      if (info?.status == "success") {
        console.log("TX SUCCESS")
        // get nft id
        const logs = info.logs
        if (logs.length > 1) {
          nftId = parseInt(info.logs[1].data, 16)
        }
        break
      }
      console.log("TX FAILED")
      // no nft id
      break
    }
    return { nftId, txId }
  } catch (error: any) {
    console.log(error)
    return { error: error?.message }
  }
}
