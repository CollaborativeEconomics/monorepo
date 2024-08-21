async function donateToCreditContract(
  contractId: string,
  from: string,
  amount: number,
  firstTime: boolean,
) {
  try {
    console.log("-- Donating", contractId, from, amount)
    const adr = new Address(from).toScVal()
    //const wei = BigInt(amount*10000000) // 7 decs
    if (!chainInterface) {
      throw new Error("No chain interface")
    }
    const wei = chainInterface.toBaseUnit(amount)
    //const args = {from:adr, amount:wei}
    const args = [adr, wei]
    console.log("ARGS", args)
    const contract = new Contract(contractId)
    console.log("CTR", contract)
    const operation = contract.call("donate", ...args)
    //const operation = contract.call('donate', args)
    console.log("OP", operation)
    //const account = await horizon.loadAccount(from)
    const account = await soroban.getAccount(from)
    console.log("ACT", account)
    //const base = await horizon.fetchBaseFee()
    //const fee = base.toString()
    const fee = BASE_FEE
    const trx = new TransactionBuilder(account, {
      fee,
      networkPassphrase: network.passphrase,
    })
      .addOperation(operation)
      .setTimeout(30)
      .build()
    console.log("TRX", trx)
    //window.trx = trx
    const sim = await soroban.simulateTransaction(trx)
    console.log("SIM", sim)
    //window.sim = sim
    if (SorobanRpc.Api.isSimulationSuccess(sim) && sim.result !== undefined) {
      console.log("RES", sim.result)
      // Now prepare it???
      let xdr = ""
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
        const account2 = await soroban.getAccount(from)
        const trz = new TransactionBuilder(account2, {
          fee: fee2,
          networkPassphrase: network.passphrase,
        })
          .setSorobanData(sdata)
          .addOperation(operation)
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
      const opx = { networkPassphrase: network.passphrase }
      //const opx = {network:network.name, networkPassphrase: network.passphrase, accountToSign: from}
      console.log("OPX", opx)
      //const res = await wallet.signAndSend(xdr, opx)
      const sgn = await signTransaction(xdr, opx)
      console.log("SGN", sgn)
      // Now send it?
      const txs = TransactionBuilder.fromXDR(sgn, network.passphrase) // as Tx
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
        return { success: false, txid, error: "Error sending payment (950)" } // get error
      }
      if (res?.status.toString() == "SUCCESS") {
        console.log("TX SUCCESS")
        return { success: true, txid, error: null }
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
              error: "Error sending payment (951)",
              extra: info,
            } // get error
          }
          if (info.status == "NOT_FOUND" || info.status == "PENDING") {
            continue // Not ready in blockchain?
          }
          if (info.status == "SUCCESS") {
            console.log("TX SUCCESS2")
            return { success: true, txid, error: null }
          } else {
            console.log("TX FAILED2")
            return {
              success: false,
              txid,
              error: "Error sending payment (952)",
              extra: info,
            } // get error
          }
        }
        return {
          success: false,
          txid,
          error: "Error sending payment - timeout (953)",
        } // get error
      }
    } else {
      console.log("BAD", sim)
      return {
        success: false,
        txid: "",
        error: "Error sending payment - bad simulation (954)",
      } // get error
    }
  } catch (ex) {
    console.log("ERROR", ex)
    return { error: ex.message }
  }
}

export default donateToCreditContract
