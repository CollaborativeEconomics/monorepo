import { type Prisma, getDonations } from "@cfce/database"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import OrganizationAvatar from "~/organization/OrganizationAvatar"
import { Button } from "~/ui/button"
import { Card, CardContent, CardHeader } from "~/ui/card"
import { DateDisplay } from "~/ui/date-posted"
import { OrgStats } from "~/ui/org-stats"
import { Progress } from "~/ui/progress"
import { Separator } from "~/ui/separator"

const dummyImgSrc: string =
  "https://partners.cfce.io/_next/image?url=https%3A%2F%2Fipfs.filebase.io%2Fipfs%2FQmcS3rZdEzNkYxSd79AJVgjkDpK7sBd1ej99i4sBXD1mkQ&w=256&q=75"

export default async function InitiativeCard({
  initiative,
}: {
  initiative: Prisma.InitiativeGetPayload<{
    include: { organization: true }
  }>
}) {
  const initurl = `/initiatives/${initiative?.id || 0}`

  const donations = await getDonations({ initid: initiative.id })

  const donationsSum = donations.reduce(
    (acc, donation) => acc + Number(donation.usdvalue),
    0,
  )
  const startDate = new Date(initiative?.start).getTime()
  const progress = (donationsSum / initiative.goal) * 100
  console.log(
    "PROGRESS",
    initiative.title,
    progress,
    donationsSum,
    initiative.goal,
  )

  return (
    <Card className="flex flex-col overflow-hidden h-auto">
      <CardHeader className="relative h-72">
        <Link href={initurl}>
          <Image
            src={initiative.defaultAsset ?? dummyImgSrc}
            alt="IMG BG"
            fill
            className="object-cover"
          />
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col pb-8 pt-3 gap-3 px-0 justify-between h-full">
        <Link href={initurl}>
          <h3 className="px-5 pt-2 text-xl font-semibold uppercase text-ellipsis overflow-scroll">
            {initiative.title ?? "no title"}
          </h3>
        </Link>
        <DateDisplay className="pl-5" timestamp={startDate} />
        <p className="px-6">{initiative.description ?? "no description"}</p>
        <Separator />
        <div className="px-6 pt-3">
          <Progress value={progress} />
        </div>
        <OrgStats
          stats={{
            amountRaised: donationsSum,
            amountTarget: initiative.goal,
            donorCount: donations.length,
            institutionalDonorCount: initiative.institutions,
          }}
        />
        <div>
          <Separator />
          <div className="px-6 pt-6 inline-flex justify-between w-full gap-2">
            <OrganizationAvatar organization={initiative.organization} />
            <Link href={initurl}>
              <Button className="p-6 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 hover:shadow-inner">
                Donate
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
