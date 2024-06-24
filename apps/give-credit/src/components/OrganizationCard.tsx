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

export default function OrganizationCard({ ...props }) {
  const organization = props?.data || {}
  if(!organization.id){ return <></> }
  const orgurl = '/organizations/' + organization.id
  let image = dummyImgSrc
  if (organization.image) {
    image = organization.image.startsWith('ipfs')
      ? 'https://ipfs.filebase.io/ipfs/' + organization.image.substr(5)
      : organization.image
  }
  //const startDate = new Date(organization?.start).getTime()
  const progress = (organization.donations / organization.goal) * 100

  return (
    <Card className="flex flex-col overflow-hidden h-auto">
      <CardHeader className="relative w-full aspect-[8/5]">
        <Link href={orgurl}>
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
        <Link href={orgurl}>
          <h3 className="h-[2rem] min-h-[2rem] px-6 pt-2 text-xl font-semibold uppercase text-ellipsis whitespace-nowrap overflow-hidden">
            {organization.name}
          </h3>
        </Link>
        <p className="block h-[8-rem] min-h-[8rem] max-h-[8rem] px-6 py-2 text-ellipsis overflow-scroll">{organization.description}</p>
        <Separator />
        <div className="px-6 pt-3">
          <OrgStats
            stats={{
              amountTarget: organization?.goal || 0,
              amountRaised: organization.donations,
              raisedThisMonth: organization.lastmonth,
              initiativeCount: organization.initiative?.length || 0,
              donorCount: organization.donors,
              institutionalDonorCount: organization.institutions,
            }}
          />
        </div>
        <Separator />
        <div className="pt-4 inline-flex justify-between box-border w-full">
          <Link href={orgurl} className="box-border w-full mx-6">
            <Button className="py-6 w-full bg-blue-600 text-white text-lg rounded-lg outline outline-slate-300 outline-1 hover:bg-blue-700 hover:shadow-inner">
              Donate
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
