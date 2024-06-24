import Image from 'next/image'
import { Card, CardContent } from './ui/card'
import { Progress } from './ui/progress'
import { Separator } from './ui/separator'
import { DateDisplay } from './ui/date-posted'
import { Button } from './ui/button'
import OrganizationAvatar from './OrganizationAvatar'

export default function InitiativeCardCompact({ ...props }) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardContent className="flex flex-col pb-8 pt-3 gap-3 px-0">
        <div className="inline-flex">
          <Image
            className="mt-3 ml-6"
            src={props.imgSrc}
            alt="IMG BG"
            width={200}
            height={200}
          />
          <div>
            <h3 className="px-6 pt-2 text-xl font-semibold uppercase">
              {props.title}
            </h3>
            <DateDisplay timestamp={props.timestamp} className="py-4 px-6" />
            <div className="px-6 line-clamp-2">{props.description}</div>
          </div>
        </div>
        <Separator />
        <div className="px-6 pt-3">
          <Progress value={(props.amountRaised / props.amountTarget) * 100} />
        </div>
        <div className="px-6 pb-2 -mt-2 text-sm font-semibold">
          ${props.amountRaised?.toLocaleString()} of $
          {props.amountTarget?.toLocaleString()} raised this month
        </div>
        <Separator />
        <div className="px-6 pt-6 inline-flex justify-between">
          <OrganizationAvatar name={props.name} image={props.avatarImg} />
          <Button className="mx-6 bg-transparent text-black dark:text-white outline outline-slate-300 outline-1">
            Donate
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
