import { chainConfig } from "@cfce/blockchain-tools"
import { WatchWalletChanges, signTransaction } from "@stellar/freighter-api"
import {
  Account,
  Address,
  Asset,
  BASE_FEE,
  Contract,
  Horizon,
  Keypair,
  Networks,
  Operation,
  SorobanDataBuilder,
  SorobanRpc,
  Transaction,
  TransactionBuilder,
  nativeToScVal,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk"
import Wallet from "~/chains/wallets/freighter"
import { randomNumber } from "~/utils/random"
import { getContract } from "~/utils/registry-client"

// mainnet, testnet and futurenet
export const networks = chainConfig.stellar.networks

// Usage
// const contractId = getContractIdFromTx(successfulTransactionResponse)
function getContractIdFromTx(tx) {
  try {
    const opResult = tx.resultXdr.result().results()[0]
    const retValue = opResult.tr().invokeHostFunctionResult().success()
    const contractId = Address.contract(retValue).toString()
    return contractId
  } catch (ex) {
    console.error(ex)
    return null
  }
}

async function deploy(
  nettype,
  factory,
  owner,
  deployer,
  wasm_hash,
  salt,
  init_fn,
  init_args,
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
    const network = networks[nettype]
    const ctr = new Contract(factory)
    console.log("CTR", ctr)
    //const op = ctr.call('deploy', ...args)
    const op = ctr.call("deploy", deployer, wasm_hash, salt, init_fn, init_args)
    console.log("OP", op)
    const soroban = new SorobanRpc.Server(network.rpcUrls.soroban, {
      allowHttp: true,
    })
    console.log("X1", owner)
    const account = await soroban.getAccount(owner)
    console.log("X2")
    //const account = await horizon.loadAccount(admin)
    console.log("ACT", account)
    //const base = await horizon.fetchBaseFee()
    //const fee = base.toString()
    const fee = BASE_FEE
    const trx = new TransactionBuilder(account, {
      fee,
      networkPassphrase: network.networkPassphrase,
    })
      .addOperation(op)
      .setTimeout(30)
      .build()
    console.log("TRX", trx)
    //window.trx = trx
    const sim = await soroban.simulateTransaction(trx)
    console.log("SIM", sim)
    //window.sim = sim
    if (SorobanRpc.Api.isSimulationSuccess(sim) && sim.result !== undefined) {
      console.log("RES", sim.result)
      let xdr = ""
      let firstTime = false // for now
      if (firstTime) {
        // Increment tx resources to avoid first time bug
        console.log("FIRST")
        //const sorobanData = new SorobanDataBuilder()
        const sorobanData = sim.transactionData
        console.log("SDATA1", sorobanData)
        //window.sdata1 = sorobanData
        //sorobanData.readBytes += '60'
        const rBytes = sorobanData["_data"].resources().readBytes() + 60
        const rFee = (
          parseInt(sorobanData["_data"].resourceFee()) + 100
        ).toString()
        sorobanData["_data"].resources().readBytes(rBytes)
        sorobanData.setResourceFee(rFee)
        const sdata = sorobanData.build()
        //window.sdata2 = sorobanData
        console.log("SDATA2", sorobanData)
        const fee2 = (parseInt(sim.minResourceFee) + 100).toString()
        //const fee2 = (parseInt(BASE_FEE) + 100).toString()
        console.log("FEE2", fee2)
        //const trz = trx.setSorobanData(sdata).setTransactionFee(fee2).build()
        const account2 = await soroban.getAccount(deployer)
        const trz = new TransactionBuilder(account2, {
          fee: fee2,
          networkPassphrase: network.networkPassphrase,
        })
          .setSorobanData(sdata)
          .addOperation(op)
          .setTimeout(30)
          .build()
        console.log("TRZ", trz)
        //window.trz = trz
        const txz = await soroban.prepareTransaction(trz)
        console.log("TXZ", txz)
        xdr = txz.toXDR()
      } else {
        const txp = await soroban.prepareTransaction(trx)
        console.log("TXP", txp)
        xdr = txp.toXDR()
      }
      console.log("XDR", xdr)
      // Now sign it???
      const opx = { networkPassphrase: network.networkPassphrase }
      //const opx = {network:network.name, networkPassphrase: network.networkPassphrase, accountToSign: from}
      console.log("OPX", opx)
      //const res = await wallet.signAndSend(xdr, opx)
      const sgn = await signTransaction(xdr, opx)
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
      // Now send it?
      const txs = TransactionBuilder.fromXDR(
        sgn.signedTxXdr,
        network.networkPassphrase,
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
      if (res?.status.toString() == "ERROR") {
        console.log("TX ERROR")
        return {
          success: false,
          txid,
          contractId: null,
          block: null,
          error: "Error deploying contract (950)",
        } // get error
      }
      if (res?.status.toString() == "SUCCESS") {
        console.log("TX SUCCESS")
        const contractId = getContractIdFromTx(res)
        console.log("Contract ID:", contractId)
        // @ts-ignore: I hate types. Ledger is part of the response, are you blind?
        return {
          success: true,
          txid,
          contractId,
          block: res?.ledger.toString(),
          error: null,
        }
      } else {
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
          if (info.status == "ERROR") {
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
          if (info.status == "NOT_FOUND" || info.status == "PENDING") {
            continue // Not ready in blockchain?
          }
          if (info.status == "SUCCESS") {
            console.log("TX SUCCESS2")
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
          } else {
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
        }
        return {
          success: false,
          txid,
          contractId: null,
          block: null,
          error: "Error deploying contract - timeout (953)",
        } // get error
      }
    } else {
      console.log("BAD", sim)
      return {
        success: false,
        txid: "",
        contractId: null,
        block: null,
        error: "Error deploying contract - bad simulation (954)",
      } // get error
    }
  } catch (ex) {
    console.log("ERROR", ex)
    return {
      success: false,
      txid: "",
      contractId: null,
      block: null,
      error: ex.message,
    }
  }
}

// -- deploy --deployer GDDMYQEROCEBL75ZHJYLSEQMRTVT6BSXQHPEBITCXXQ5GGW65ETQAU5C --wasm_hash d433b471c3959a9d87702b3648a2214f2c8c8d716a000ae2c6e13be9bb68ad51 --salt 1234567890 --init_fn init --init_args '[{"u32":123}]'
// credits contract constructor: initialize(e: Env, admin: Address, initiative: u128, provider: Address, vendor: Address, bucket: i128, xlm: Address) {
// ARGS [admin, initiative, provider, vendor, bucket, xlm]
// VARS [deployer, wasm_hash, salt, init_fn, init_args]
async function deployCredits(data) {
  console.log("DATA", data)
  try {
    const chain = "stellar" // TODO: get from config
    const nettype = "testnet" // TODO: get from config
    const network = networks[nettype]
    const wallet = new Wallet()
    await wallet.init()
    const walletInfo = await wallet.connect()
    console.log("WALLET", walletInfo)
    console.log("-- Deploying")

    // Factory contract
    const factory = await getContract(chain, nettype, "Factory", "ALL")
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

    const contractHash = await getContract(chain, nettype, "CreditsHash", "ALL")
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

    const xlmContract =
      "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC" // TODO: constant from config
    const orgwallet = walletInfo.account
    const deployer = new Address(orgwallet).toScVal()
    const wasm_hash = nativeToScVal(Buffer.from(contractHash, "hex"), {
      type: "bytes",
    })
    const salt = nativeToScVal(Buffer.from(randomNumber(32)), { type: "bytes" })
    const init_fn = nativeToScVal("initialize", { type: "symbol" })
    const owner = orgwallet
    const admin = new Address(owner).toScVal()
    const initiative = nativeToScVal(1, { type: "u128" }) // Not used ???
    const provider = new Address(data.provider)
    const vendor = new Address(data.vendor).toScVal()
    const bucket = nativeToScVal(data.bucket * 1000000, { type: "i128" })
    const xlm = new Address(xlmContract).toScVal()
    const init_args = nativeToScVal(
      [admin, initiative, provider, vendor, bucket, xlm],
      { type: "vector" },
    )
    //const args = [deployer, wasm_hash, salt, init_fn, init_args]
    //console.log('ARGS', args)
    const result = await deploy(
      nettype,
      factory,
      owner,
      deployer,
      wasm_hash,
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
      error: ex.message,
    }
  }
}

async function deployNFTReceipt(data) {
  console.log("DATA", data)
  try {
    const chain = "stellar" // TODO: get from config
    const nettype = "testnet" // TODO: get from config
    const network = networks[nettype]
    const wallet = new Wallet()
    await wallet.init()
    const walletInfo = await wallet.connect()
    console.log("WALLET", walletInfo)
    console.log("-- Deploying")

    // Factory contract
    const factory = await getContract(chain, nettype, "Factory", "ALL")
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
      chain,
      nettype,
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

    const orgwallet = walletInfo.account
    const deployer = new Address(orgwallet).toScVal()
    const wasm_hash = nativeToScVal(Buffer.from(contractHash, "hex"), {
      type: "bytes",
    })
    const salt = nativeToScVal(Buffer.from(randomNumber(32)), { type: "bytes" })
    const init_fn = nativeToScVal("initialize", { type: "symbol" })
    const owner = orgwallet
    const admin = new Address(owner).toScVal()
    const name = nativeToScVal(data.name, { type: "string" })
    const symbol = nativeToScVal(data.symbol, { type: "string" })
    const init_args = nativeToScVal([admin, name, symbol], { type: "vector" })
    //const args = [deployer, wasm_hash, salt, init_fn, init_args]
    //console.log('ARGS', args)
    const result = await deploy(
      nettype,
      factory,
      owner,
      deployer,
      wasm_hash,
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
      error: ex.message,
    }
  }
}

class StellarContracts {
  contracts = {
    Credits: {
      deploy: async (data) => {
        const res = await deployCredits(data)
        return res
      },
    },
    NFTReceipt: {
      deploy: async (data) => {
        const res = await deployNFTReceipt(data)
        return res
      },
    },
  }
}

const Stellar = new StellarContracts()

export default Stellar
