# NFT721 Contract

Use in server:

```JS
import { Address }  from "@stellar/stellar-sdk"
import { networks } from '@/contracts/networks'
import { submit }   from '@/contracts/nft721/server'

const network  = networks.futurenet
const receiver = 'GCFED2OC5W2S46UYVUY6K3CDFXTCIY2FHU3RN2FM4P2WT224OYTTJXUL'
const method   = 'mint'
const args     = [new Address(receiver).toScVal()]
submit(network, secret, address, method, args)
```

Use in client:

```JS
// Client must use freighter wallet
import {Contract, networks} from '@/contracts/nft721/client'

export async function mint(to:string){
  const opt = {...networks.futurenet}
  const ctr = new Contract(opt)
  const tx  = await ctr.mint({to})
  const { res } = await tx.signAndSend()
  console.log(res)
  return res
}

mint('GCFED2OC5W2S46UYVUY6K3CDFXTCIY2FHU3RN2FM4P2WT224OYTTJXUL')