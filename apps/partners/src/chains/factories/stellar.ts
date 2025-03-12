import appConfig, { chainConfig } from "@cfce/app-config"
import { FreighterWallet } from "@cfce/blockchain-tools"
import { signTransaction } from "@stellar/freighter-api"
import {
  Address,
  BASE_FEE,
  Contract,
  TransactionBuilder,
  nativeToScVal,
  rpc,
  scValToNative,
  type xdr,
} from "@stellar/stellar-sdk"
import { randomNumber } from "~/utils/random"
import { getContract } from "~/utils/registry-client"

interface CreditsData {
  chain: string
  network: string
  provider: string
  vendor: string
  bucket: string
}

interface ReceiptData {
  chain: string
  network: string
  name: string
  symbol: string
}

const stellar = chainConfig.stellar.networks[appConfig.chainDefaults.network]

// Usage
// const contractId = getContractIdFromTx(successfulTransactionResponse)
//function getContractIdFromTx(tx: rpc.Api.SendTransactionResponse) {
function getContractIdFromTx(tx: rpc.Api.GetTransactionResponse) {
  try {
    //const retval = xdr.ScVec.fromXDR(tx.returnValue, 'base64');
    //console.log('RETVAL', retval)
    if ("returnValue" in tx && tx.returnValue !== undefined) {
      //const opResult = tx.resultXdr.result().results()[0]
      //const retValue = opResult.tr().invokeHostFunctionResult().success()
      //const contractId = Address.contract(retValue).toString() // Not the recently deployed contract, don't know what that is
      //console.log('CTRID', contractId)
      //const contractId = Address.contract(tx.returnValue._value[0]._value._value).toString() // this is it, but too cumbersome
      //console.log('CTRID', contractId)
      const values = scValToNative(tx.returnValue) // This is the right way
      const contractId = values?.[0] || null // Perhaps check if it's an array?
      console.log("CTRID", contractId)
      return contractId
    }
    return null
  } catch (ex) {
    console.error(ex)
    return null
  }
}

async function deploy(
  nettype: string,
  factory: string,
  owner: string,
  deployer: string,
  wasm_hash: string,
  salt: string,
  init_fn: string,
  init_args: xdr.ScVal,
) {
  console.log(
    "DEPLOY",
    nettype,
    factory,
    owner,
    deployer,
    wasm_hash,
    salt,
    init_fn,
    init_args,
  )
  try {
    //const network = networks[nettype]
    const scDeployer = new Address(deployer).toScVal()
    const scHash = nativeToScVal(Buffer.from(wasm_hash, "hex"), {
      type: "bytes",
    })
    const scSalt = nativeToScVal(Buffer.from(salt), { type: "bytes" })
    const scInit = nativeToScVal(init_fn, { type: "symbol" })
    const scArgs = init_args
    const ctr = new Contract(factory)
    console.log("CTR", ctr)
    console.log("ARG", scArgs)
    //const op = ctr.call('deploy', ...args)
    console.log("deploy", scDeployer, scHash, scSalt, scInit)
    const op = ctr.call("deploy", scDeployer, scHash, scSalt, scInit, scArgs)
    console.log("OP", op)
    const soroban = new rpc.Server(stellar.rpcUrls.soroban, { allowHttp: true })
    console.log("X1", owner)
    const account = await soroban.getAccount(owner)
    //const account = await horizon.loadAccount(admin)
    console.log("ACT", account)
    //const base = await horizon.fetchBaseFee()
    //const fee = base.toString()
    const fee = BASE_FEE
    const trx = new TransactionBuilder(account, {
      fee,
      networkPassphrase: stellar.networkPassphrase,
    })
      .addOperation(op)
      .setTimeout(30)
      .build()
    console.log("TRX", trx)
    //window.trx = trx
    const sim = await soroban.simulateTransaction(trx)
    console.log("SIM", sim)
    //window.sim = sim
    if (rpc.Api.isSimulationSuccess(sim) && sim.result !== undefined) {
      console.log("RES", sim.result)
      let xdrData = ""
      const firstTime = false // for now
      if (firstTime) {
        // Increment tx resources to avoid first time bug
        console.log("FIRST")
        //const sorobanData = new SorobanDataBuilder()
        const sorobanData = sim.transactionData
        console.log("SDATA1", sorobanData)
        //window.sdata1 = sorobanData
        //sorobanData.readBytes += '60'
        // @ts-ignore: using internal API (https://github.com/stellar/js-stellar-base/blob/1036eabf1f20a1154297c419fc2c663040338b22/src/sorobandata_builder.js#L41)
        const sData = sorobanData._data
        const rBytes = sData.resources().readBytes() + 60
        // @ts-ignore: ibid
        const rFee = (Number.parseInt(sData.resourceFee()) + 100).toString()
        // @ts-ignore: ibid
        sData.resources().readBytes(rBytes)
        sorobanData.setResourceFee(rFee)
        const sdata = sorobanData.build()
        //window.sdata2 = sorobanData
        console.log("SDATA2", sorobanData)
        const fee2 = (Number.parseInt(sim.minResourceFee) + 100).toString()
        //const fee2 = (parseInt(BASE_FEE) + 100).toString()
        console.log("FEE2", fee2)
        //const trz = trx.setSorobanData(sdata).setTransactionFee(fee2).build()
        const account2 = await soroban.getAccount(deployer.toString())
        const trz = new TransactionBuilder(account2, {
          fee: fee2,
          networkPassphrase: stellar.networkPassphrase,
        })
          .setSorobanData(sdata)
          .addOperation(op)
          .setTimeout(30)
          .build()
        console.log("TRZ", trz)
        //window.trz = trz
        const txz = await soroban.prepareTransaction(trz)
        console.log("TXZ", txz)
        xdrData = txz.toXDR()
      } else {
        const txp = await soroban.prepareTransaction(trx)
        console.log("TXP", txp)
        xdrData = txp.toXDR()
      }
      console.log("XDR", xdrData)
      // Now sign it???
      const opx = { networkPassphrase: stellar.networkPassphrase }
      //const opx = {network:network.name, networkPassphrase: network.networkPassphrase, accountToSign: from}
      console.log("OPX", opx)
      //const res = await wallet.signAndSend(xdrData, opx)
      const sgn = await signTransaction(xdrData, opx)
      console.log("SGN", sgn)
      if (sgn?.error) {
        return {
          success: false,
          txid: null,
          contractId: null,
          block: null,
          error: sgn.error.message,
        }
      }
      if (!stellar.networkPassphrase) {
        return {
          success: false,
          txid: null,
          contractId: null,
          block: null,
          error: "Network passphrase not found",
        }
      }
      // Now send it?
      const txs = TransactionBuilder.fromXDR(
        sgn.signedTxXdr,
        stellar.networkPassphrase,
      ) // as Tx
      console.log("TXS", txs)
      //const six = await soroban.simulateTransaction(txs)
      //console.log('SIX', six)
      //const prep = await soroban.prepareTransaction(six)
      //console.log('PREP', prep)
      ////const res = await soroban.sendTransaction(sgn)
      //const res = await soroban.sendTransaction(txs)
      const res = await soroban.sendTransaction(txs)
      console.log("RES", res)
      console.log("JSN", JSON.stringify(res, null, 2))

      const txid = res?.hash || ""
      console.log("TXID", txid)
      if (res?.status.toString() === "ERROR") {
        console.log("TX ERROR")
        return {
          success: false,
          txid,
          contractId: null,
          block: null,
          error: "Error deploying contract (950)",
        } // get error
      }
      if (res?.status.toString() === "SUCCESS") {
        console.log("TX SUCCESS")
        const transactionInfo = await soroban.getTransaction(txid)
        console.log("TXINFO", transactionInfo)
        //window.xdr = xdr
        //window.transactionInfo = transactionInfo
        //const rev = v3.soroban_meta.return_value.vec.address
        const contractId = getContractIdFromTx(transactionInfo)
        console.log("Contract ID:", contractId)
        // @ts-ignore: I hate types. Ledger is part of the response, are you blind?
        return {
          success: true,
          txid,
          contractId,
          block: transactionInfo?.latestLedger.toString(),
          error: null,
        }
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
        info = await soroban.getTransaction(txid)
        console.log("INFO", info)
        if (info.status === "FAILED") {
          console.log("TX FAILED")
          return {
            success: false,
            txid,
            contractId: null,
            block: null,
            error: "Error deploying contract (951)",
            extra: info,
          } // get error
        }
        if (info.status === "NOT_FOUND") {
          continue // Not ready in blockchain?
        }
        if (info.status === "SUCCESS") {
          console.log("TX SUCCESS2")
          console.log("TXINFO", info)
          //window.transactionInfo = info
          const contractId = getContractIdFromTx(info)
          console.log("Contract ID:", contractId)
          // @ts-ignore: I hate types. Ledger is part of the response, are you blind?
          return {
            success: true,
            txid,
            contractId,
            block: info?.ledger.toString(),
            error: null,
          }
        }
        console.log("TX FAILED2")
        return {
          success: false,
          txid,
          contractId: null,
          block: null,
          error: "Error deploying contract (952)",
          extra: info,
        } // get error
      }
      return {
        success: false,
        txid,
        contractId: null,
        block: null,
        error: "Error deploying contract - timeout (953)",
      } // get error
    }
    console.log("BAD", sim)
    return {
      success: false,
      txid: "",
      contractId: null,
      block: null,
      error: "Error deploying contract - bad simulation (954)",
    } // get error
  } catch (ex) {
    console.log("ERROR", ex)
    return {
      success: false,
      txid: "",
      contractId: null,
      block: null,
      error: ex instanceof Error ? ex.message : "Unknown error",
    }
  }
}

// -- deploy --deployer GDDMYQEROCEBL75ZHJYLSEQMRTVT6BSXQHPEBITCXXQ5GGW65ETQAU5C --wasm_hash d433b471c3959a9d87702b3648a2214f2c8c8d716a000ae2c6e13be9bb68ad51 --salt 1234567890 --init_fn init --init_args '[{"u32":123}]'
// credits contract constructor: initialize(e: Env, admin: Address, initiative: u128, provider: Address, vendor: Address, bucket: i128, xlm: Address) {
// DATA {provider, vendor, bucket}
// VARS [deployer, wasm_hash, salt, init_fn, init_args]
// ARGS [admin, initiative, provider, vendor, bucket, xlm]
async function deployCredits(data: CreditsData) {
  console.log("DATA", data)
  try {
    const wallet = new FreighterWallet()
    //const wallet = new FreighterWallet(data.chain as ChainSlugs, data.network)
    await wallet.init()
    const walletInfo = await wallet.connect()
    console.log("WALLET", walletInfo)
    console.log("-- Deploying")

    // Factory contract
    const factory = await getContract(
      data.chain,
      data.network,
      "Factory",
      "ALL",
    )
    console.log("FACTORY", factory)
    if (!factory) {
      return {
        success: false,
        txid: null,
        contractId: null,
        block: null,
        error: "Factory contract not found",
      }
    }
    const contractHash = await getContract(
      data.chain,
      data.network,
      "CreditsHash",
      "ALL",
    )
    console.log("HASH", contractHash)
    if (!contractHash) {
      return {
        success: false,
        txid: null,
        contractId: null,
        block: null,
        error: "Credits Hash not found",
      }
    }
    const xlmContract = stellar.tokens.find((t) => t.isNative)?.contract
    //const orgwallet = walletInfo.account
    const orgwallet = walletInfo.walletAddress
    if (!orgwallet) {
      return {
        success: false,
        txid: null,
        contractId: null,
        block: null,
        error: "Wallet address not found",
      }
    }
    const owner = orgwallet
    const deployer = orgwallet
    const salt = randomNumber(32)
    const init_fn = "initialize"
    // Args
    const admin = new Address(owner).toScVal()
    const initiative = nativeToScVal(1, { type: "u128" }) // Not used ???
    const provider = new Address(data.provider)
    const vendor = new Address(data.vendor).toScVal()
    const bucket = nativeToScVal(Number(data.bucket) * 1000000, {
      type: "i128",
    })
    const xlm = new Address(xlmContract).toScVal()
    const init_args = nativeToScVal(
      [admin, initiative, provider, vendor, bucket, xlm],
      { type: "vector" },
    )
    //const args = [deployer, wasm_hash, salt, init_fn, init_args]
    //console.log('ARGS', args)
    const result = await deploy(
      data.network,
      factory,
      owner,
      deployer,
      contractHash,
      salt,
      init_fn,
      init_args,
    )
    return result
  } catch (ex) {
    console.log("ERROR", ex)
    return {
      success: false,
      txid: "",
      contractId: null,
      block: null,
      error: ex instanceof Error ? ex.message : "Unknown error",
    }
  }
}

async function deployNFTReceipt(data: ReceiptData) {
  console.log("DATA", data)
  try {
    const wallet = new FreighterWallet()
    //const wallet = new FreighterWallet(data.chain as ChainSlugs, data.network)
    await wallet.init()
    const walletInfo = await wallet.connect()
    console.log("WALLET", walletInfo)
    console.log("-- Deploying")

    // Factory contract
    const factory = await getContract(
      data.chain,
      data.network,
      "Factory",
      "ALL",
    )
    console.log("FACTORY", factory)
    if (!factory) {
      return {
        success: false,
        txid: null,
        contractId: null,
        block: null,
        error: "Factory contract not found",
      }
    }
    const contractHash = await getContract(
      data.chain,
      data.network,
      "NFTReceiptHash",
      "ALL",
    )
    console.log("HASH", contractHash)
    if (!contractHash || contractHash?.error) {
      return {
        success: false,
        txid: null,
        contractId: null,
        block: null,
        error: "Contract Hash not found",
      }
    }

    //const orgwallet = walletInfo.account
    const orgwallet = walletInfo.walletAddress
    if (!orgwallet) {
      return {
        success: false,
        txid: null,
        contractId: null,
        block: null,
        error: "Wallet address not found",
      }
    }
    const owner = orgwallet
    const deployer = orgwallet
    const salt = randomNumber(32)
    const init_fn = "initialize"
    // Args
    const admin = new Address(owner).toScVal()
    const name = nativeToScVal(data.name, { type: "string" })
    const symbol = nativeToScVal(data.symbol, { type: "string" })
    const init_args = nativeToScVal([admin, name, symbol], { type: "vector" })
    //const args = [deployer, wasm_hash, salt, init_fn, init_args]
    //console.log('ARGS', args)
    const result = await deploy(
      data.network,
      factory,
      owner,
      deployer,
      contractHash,
      salt,
      init_fn,
      init_args,
    )
    return result
  } catch (ex) {
    console.log("ERROR", ex)
    return {
      success: false,
      txid: "",
      contractId: null,
      block: null,
      error: ex instanceof Error ? ex.message : "Unknown error",
    }
  }
}

function isDeployCreditsData(data: unknown): data is CreditsData {
  return (
    typeof data === "object" &&
    data !== null &&
    "provider" in data &&
    "vendor" in data &&
    "bucket" in data
  )
}

function isDeployNFTReceiptData(data: unknown): data is ReceiptData {
  return (
    typeof data === "object" &&
    data !== null &&
    "name" in data &&
    "symbol" in data
  )
}

const StellarContractsDeployer = {
  Credits: {
    deploy: async (data: unknown) => {
      if (!isDeployCreditsData(data)) {
        throw new Error("Invalid data")
      }
      const res = await deployCredits(data)
      return res
    },
  },
  NFTReceipt: {
    deploy: async (data: unknown) => {
      if (!isDeployNFTReceiptData(data)) {
        throw new Error("Invalid data")
      }
      const res = await deployNFTReceipt(data)
      return res
    },
  },
}

export default StellarContractsDeployer
