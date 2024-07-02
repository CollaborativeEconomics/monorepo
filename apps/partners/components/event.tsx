import Link from 'next/link'
import Image from 'next/image'
import timeAgo from 'utils/timeago'

interface EventProps {
  id: string
  created?: Date
  name?: string
  description?: string
  amount?: number
  image?: string
  organizationId?: string
  initiativeId?: string
}

function toDate(date){
  return new Date(date).toLocaleDateString()
}

const Event = (item:EventProps) => {
  //console.log('ENV', process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL)
  const imgsrc = item.image.startsWith('ipfs:') ? process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL + item.image.substr(5) : item.image
  return (
    <div className="flex flex-row justify-start w-full">
      <Image src={imgsrc} width={100} height={100} className="w-32 h-32 mr-6 rounded" alt={item.name}/>
      <div>
        <h1 className="text-2xl font-bold">{item.name}</h1>
        <div className="text-slate-400 text-sm">{timeAgo(item.created)}</div>
        <h3 className="text-base">{item.description}</h3>
      </div>
    </div>
  )
}

export default Event