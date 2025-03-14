import type { Initiative, Organization } from "@cfce/database"
import { ipfsCIDToUrl } from "@cfce/utils"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import OrganizationAvatar from "~/organization/OrganizationAvatar"
import { Button } from "~/ui/button"
import { Card, CardContent } from "~/ui/card"
import { DateDisplay } from "~/ui/date-posted"
import { Progress } from "~/ui/progress"
import { Separator } from "~/ui/separator"

interface InitiativeCardCompactProps extends Initiative {
  organization: Organization
}

export default function InitiativeCardCompact({
  initiative,
}: {
  initiative: InitiativeCardCompactProps
}) {
  console.log("initiative", initiative)
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardContent className="flex flex-col pb-8 pt-3 gap-3 px-0">
        <Link href={`/initiatives/${initiative.id}`}>
          <div className="inline-flex">
            {initiative.defaultAsset && (
              <Image
                className="mt-3 ml-6 rounded-sm"
                src={initiative.defaultAsset}
                alt="IMG BG"
                width={200}
                height={200}
              />
            )}
            <div>
              <h3 className="px-6 pt-2 text-xl font-semibold uppercase">
                {initiative.title}
              </h3>
              <DateDisplay
                timestamp={+new Date(initiative.created)}
                className="py-4 px-6"
              />
              <div className="px-6 line-clamp-2">{initiative.description}</div>
            </div>
          </div>
        </Link>
        <Separator />
        <div className="px-6 pt-3">
          <Progress value={(initiative.received / initiative.goal) * 100} />
        </div>
        <div className="px-6 pb-2 -mt-2 text-sm font-semibold">
          ${initiative.received?.toLocaleString()} of $
          {initiative.goal?.toLocaleString()} raised this month
        </div>
        <Separator />
        <div className="px-6 pt-6 inline-flex justify-between">
          <OrganizationAvatar organization={initiative.organization} />
          <Link href={`/initiatives/${initiative.id}`}>
            <Button className="mx-6 bg-transparent text-black dark:text-white outline outline-slate-300 outline-1">
              Donate
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
