import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '../ui/card.js'
import { DateDisplay } from '../ui/date-posted.js'
import Initiative from '@/types/initiative'

export default function InitiativeCardCompactShort(initiative: Initiative) {
  return (
    <Card className="flex flex-col overflow-hidden h-56">
      <CardContent className="flex flex-col pb-8 pt-3 gap-3 px-0">
        <Link href={`/initiatives/${initiative.id}`}>
          <div className="inline-flex">
            <Image
              className="mt-3 ml-6"
              src={initiative.defaultAsset}
              alt="IMG BG"
              width={120}
              height={120}
              layout="fixed"
            />
            <div>
              <h3 className="px-6 pt-2 text-xl font-semibold uppercase">
                {initiative.title}
              </h3>
              <DateDisplay
                timestamp={initiative.created}
                className="py-4 px-6"
              />
              <div className="px-6 line-clamp-2">{initiative.description}</div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
