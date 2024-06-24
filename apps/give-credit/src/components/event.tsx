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

const Event = (item:EventProps) => {
  return (
    <div className="flex flex-row justify-start w-full">
      <Image src={item.image||''} width={100} height={100} className="w-32 h-32 mr-6 rounded" alt={item.name||''}/>
      <div>
        <h1 className="text-2xl font-bold">{item.name||''}</h1>
        <div className="text-slate-400 text-sm">{timeAgo(item.created?.toString()||'0')}</div>
        <h3 className="text-base">{item.description||''}</h3>
      </div>
    </div>
  )
}

export default Event
