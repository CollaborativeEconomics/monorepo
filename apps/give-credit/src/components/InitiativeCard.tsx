'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from './ui/card'
import { Progress } from './ui/progress'
import { Separator } from './ui/separator'
import { DateDisplay } from './ui/date-posted'
import { Button } from './ui/button'
import { OrgStats } from './ui/org-stats'
import OrganizationAvatar from './OrganizationAvatar'

const dummyImgSrc: string = 'https://partners.cfce.io/_next/image?url=https%3A%2F%2Fipfs.filebase.io%2Fipfs%2FQmcS3rZdEzNkYxSd79AJVgjkDpK7sBd1ej99i4sBXD1mkQ&w=256&q=75'

export default function InitiativeCard({ ...props }) {
  const initiative = props?.data || {}
  const initurl = '/initiatives/' + (initiative?.id || 0)
  let image = dummyImgSrc
  if (initiative?.defaultAsset) {
    image = initiative?.defaultAsset.startsWith('ipfs')
      ? 'https://ipfs.filebase.io/ipfs/' + initiative.defaultAsset.substr(5)
      : initiative.defaultAsset
  }
  const startDate = new Date(initiative?.start).getTime()
  const progress = (initiative.donations / initiative.goal) * 100

  return (
    <Card className="flex flex-col overflow-hidden h-auto">
      <CardHeader className="relative h-72">
        <Link href={initurl}>
          <Image
            src={image}
            alt="IMG BG"
            fill
            style={{
              objectFit: 'cover',
            }}
          />
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col pb-8 pt-3 gap-3 px-0">
        <Link href={initurl}>
          <h3 className="px-5 pt-2 text-xl font-semibold uppercase text-ellipsis overflow-scroll">
            {initiative.title ?? 'no title'}
          </h3>
        </Link>
        <DateDisplay className="pl-5" timestamp={startDate} />
        <p className="px-6">{initiative.description ?? 'no description'}</p>
        <Separator />
        <div className="px-6 pt-3">
          <Progress value={progress} />
        </div>
        <OrgStats
          stats={{
            amountRaised: initiative.lastmonth,
            amountTarget: initiative.goal,
            donorCount: initiative.donors,
            institutionalDonorCount: initiative.institutions,
          }}
        />
        <Separator />
        <div className="px-6 pt-6 inline-flex justify-between">
          <OrganizationAvatar
            name={initiative?.organization?.name}
            image={initiative?.organization?.image}
            avatarProps={{ title: initiative?.organization?.name }}
          />
          <Link href={initurl}>
            <Button className="p-6 bg-blue-600 text-white text-lg rounded-lg outline outline-slate-300 outline-1 hover:bg-blue-700 hover:shadow-inner">
              Donate
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
