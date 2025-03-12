//import { getNetworkForChain } from "@cfce/blockchain-tools"
import appConfig, { getChainConfig } from "@cfce/app-config"

const mintTopic =
  "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62" // keccak for event TransferSingle(address,address,address,uint256,uint256)
//const mintTopic = ['0x156e29f6982eee45771b2862c71c865cb1ed8ec5a0f2c9d0c2cf96b8a8ba8ee3'] // keccak for method mint(address,uint256,uint256)

// Get all registered addresses in 1155 contract for token #1
export async function getRegisteredAddresses(contract: string, block: string) {
  const topics = [mintTopic]
  const logs = await getLogs(contract, topics, block)
  if (logs?.error) {
    console.log({ logs })
    return {
      success: false,
      error: logs?.error?.message || "Error fetching logs",
    }
  }
  // Parse addresses
  // event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);
  const data = []
  let nftid = 1
  const value = 0
  for (const item of logs) {
    nftid = Number.parseInt(item.data.substr(0, 66))
    if (nftid !== 1) {
      continue
    }
    data.push(`0x${item.topics[3].slice(26)}`) // topic 3 is recipient address
  }
  console.log({ data })

  return { success: true, data }
}

// Get all reported addresses in 1155 contract for token #2
export async function getReportedAddresses(contract: string, block: string) {
  const topics = [mintTopic]
  const logs = await getLogs(contract, topics, block)
  if (logs?.error) {
    console.log({ logs })
    return {
      success: false,
      error: logs?.error?.message || "Error fetching logs",
    }
  }

  const isTopicLog = (
    log: unknown,
  ): log is { topics: string[]; data: string } =>
    typeof log === "object" && log !== null && "topics" in log && "data" in log

  function getDataFromTopicsLog(log: unknown) {
    if (!isTopicLog(log)) {
      return {
        success: false,
        error: "Invalid log",
      }
    }
    const from = `0x${log?.topics?.[2]?.slice(26)}` // Extract 'from' address
    const to = `0x${log?.topics?.[3]?.slice(26)}` // Extract 'to' address

    // Decode the 'data' field to extract the 'id' and 'value'
    const data = log.data.slice(2) // Remove the "0x" prefix
    const nftid = BigInt(`0x${data.slice(0, 64)}`).toString() // First 32 bytes -> id
    const value = BigInt(`0x${data.slice(64, 128)}`).toString() // Next 32 bytes -> value

    return { from, to, nftid, value }
  }

  const data = []
  for (const log of logs) {
    const { from, to, nftid, value } = getDataFromTopicsLog(log)
    if (Number(nftid) !== 2) {
      continue
    }
    if (Number(value) < 1) {
      continue
    }
    data.push({
      address: to,
      nftid,
      value,
    }) // topic 3 is recipient address
  }
  return { success: true, data }
}

// contract address, array of topics to search for, and starting block
async function getLogs(address: string, topics: string[], fromBlock: string) {
  const hexBlock = `0x${Number.parseInt(fromBlock).toString(16)}`

  try {
    //const url = getNetworkForChain("arbitrum").rpcUrls.main
    const url = getChainConfig("arbitrum").rpcUrls.default
    //console.log('PROVIDER', url)
    if (!url) {
      return { success: false, error: "No chain provider URL" }
    }

    const payload = {
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getLogs",
      params: [
        {
          address,
          topics,
          fromBlock: hexBlock,
          toBlock: "latest",
        },
      ],
    }
    //console.log('LOGS', payload)
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }

    const result = await fetch(url, options)
    const data = await result.json()
    //console.log("LOGS DATA", JSON.stringify(data))
    if (data.error) {
      return {
        success: false,
        error: data.error?.message || "Error fetching logs",
      }
    }
    //return data.result[0].topics
    return data.result
  } catch (ex) {
    console.error(ex)
    return { error: ex instanceof Error ? ex.message : "Error fetching logs" }
  }
}

/*
// RESULT EXAMPLE
// Topics start with the event kecak256 and then three indexed topics (usually addresses)
// Data field contains the remaining topics joined divisible by type length
{
  jsonrpc: '2.0',
  id: 1,
  result: [
    {
      address: '0x7209b809e591460f5442c976b6f29c6ff963b867',
      blockHash: '0xb7e1c8e9bda283ea30b39d0651a3af159d7332de863b764e1b6583c2ff6192f1',
      blockNumber: '0x43fb585',
      data: '0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001',
      logIndex: '0xc',
      removed: false,
      topics: [
        '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62',
        '0x0000000000000000000000007b94c009af223825bcc8a326cfb0ed9acbc490fc',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000007b94c009af223825bcc8a326cfb0ed9acbc490fc'
      ],
      transactionHash: '0xe8e6bddc73dd3edea8bdbad56c48f788031117f657237cf102c3738e30bd8919',
      transactionIndex: '0x1'
    }
  ]
}

// ERROR EXAMPLE
{
  jsonrpc: '2.0',
  id: 1,
  error: {
    code: -32000,
    message: 'One of the blocks specified in filter (fromBlock, toBlock or blockHash) cannot be found.'
  }
}
*/


/*
// SOROBAN
async function getEventLogs()
  // Example JavaScript code using the Soroban RPC client
  const response = await rpcClient.getEvents({
    startLedger: ledgerNumber, // Starting ledger to search from
    filters: [
      {
        contractIds: [contractId], // Optional: Filter by contract ID
        topics: [['mint']]     // Optional: Filter by event topics
      }
    ],
    pagination: {
      limit: 10
    }
  });

}
*/