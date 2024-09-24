# Credits Contract

Use in server:

```JS
import { Address }  from "@stellar/stellar-sdk"
import { networks } from '@/contracts/networks'
import { submit }   from '@/contracts/credits/server'

async function donate(from, amount){
  const network  = networks.futurenet
  const secret   = process.env.SECRET
  const contract = network.contractId
  const method   = 'donate'
  const args     = [new Address(from).toScVal(), nativeToScVal(amount, { type: 'i128' })]
  const result   = await submit(network, secret, contract, method, args)
  console.log(result)
  return result
}

donate('GTEST123...', 12000000)
```

Use in client:

```JS
// Client must use freighter wallet
import {Contract, networks} from '@/contracts/credits/client'

async function donate(from, amount){
  const options  = {...networks.futurenet}
  const contract = new Contract(opt)
  const tx = await ctr.donate({from, amount})
  const {result} = await tx.signAndSend()
  console.log(result)
  return result
}

donate('GTEST123...', 12000000)
```