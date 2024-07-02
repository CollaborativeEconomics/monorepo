import Link from 'next/link'
import Image from 'next/image'
import timeAgo from 'utils/timeago'

interface WalletProps {
  id: string
  chain?: string
  address?: string
  description?: string
  status?: string  // 0.pending 1.approved 2.rejected
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(function() {
    console.log('Copytoclipboard', text)
  }, function(err) {
    console.error('Error copying to clipboard:', err)
  })
}

const Wallet = (item:WalletProps) => {
  return (
    <div className="flex flex-row justify-between items-center w-full">
      <h1 className="text-2xl font-bold">{item.chain}</h1>
      <p className="mr-4 grow text-sm text-right">{item.address}</p>
      <button onClick={()=>{copyToClipboard(item.address)}}><Image src="/media/icon-copy.png" width={16} height={16} alt="Copy address to clipboard" /></button>
    </div>
  )
}

export default Wallet