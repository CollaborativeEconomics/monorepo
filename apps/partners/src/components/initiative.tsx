import Link from 'next/link'
import Image from 'next/image'

interface CreditType {
  id: string
  type: string
  currency: string
  value: number
}

interface InitiativeProps {
  id: string
  title?: string
  description?: string
  defaultAsset?: string
  credits?: CreditType[]
  start?: Date
  end?: Date
}

function toDate(date){
  return new Date(date).toLocaleString()
}

const Initiative = (item:InitiativeProps) => {
  let hasCredit = false
  let creditText = ''
  if(item?.credits?.length>0){
    const credit = item.credits[0]
    creditText = `Offsets ${credit.type} Credits every ${credit.currency} ${credit.value}`
    hasCredit = true
  }
  return (
    <div className="flex flex-row justify-start w-full">
      <Image src={item.defaultAsset} width={100} height={100} className="w-32 h-32 mr-6 rounded" alt={item.title}/>
      <div>
        <h1 className="text-2xl font-bold">{item.title}</h1>
        <div className="text-slate-400 text-sm">Start {toDate(item.start)} • End {toDate(item.end)}</div>
        <h3 className="text-base">{item.description}</h3>
        { hasCredit ? <p className="text-green-500">{creditText}</p> : '' }
        {/*<Link href={'/partners/reports/initiatives?id='+item.id} className="text-slate-250">View donations &raquo;</Link>*/}
      </div>
    </div>
  )
}

export default Initiative