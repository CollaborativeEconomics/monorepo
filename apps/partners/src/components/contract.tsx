import Link from 'next/link'
import Image from 'next/image'
import copy from 'clipboard-copy'

interface ContractProps {
  id: string
  created?: Date
  inactive?: boolean
  chain?: string
  network?: string
  start_block?: string
  contract_type?: string
  contract_address?: string
  admin_wallet_address?: string
  entity_id?: string
}


function copyToClipboard(text?:string) {
  if(!text) { return }
  copy(text).then(() => {
    console.log('COPIED:', text)
  })
}

const Contract = (item:ContractProps) => {
  return (
    <div className="flex flex-row justify-between items-center w-full">
      <div className="flex flex-col justify-start items-start w-full">
        <h1 className="text-2xl font-bold">{item.chain}</h1>
        <p className="text-slate-400">{item.network}</p>
      </div>
      <p className="mr-4 grow text-sm text-right font-mono">{item.contract_type}</p>
      <p className="mr-4 grow text-sm text-right font-mono">{item.contract_address}</p>
      <button type="button" onClick={()=>{copyToClipboard(item.contract_address)}}><Image src="/media/icon-copy.png" width={16} height={16} alt="Copy address to clipboard" /></button>
    </div>
  )
}

export default Contract