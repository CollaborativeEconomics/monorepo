import * as React from "react"

import { localizedNumber } from "@cfce/utils"
import { Building2, DollarSign, Sprout, Target, UserIcon } from "lucide-react"
import { cn } from "~/shadCnUtil"
import { ListObject } from "./list-object"

export interface Stats {
  amountRaised: number
  amountTarget: number
  raisedThisMonth?: number
  donorCount: number
  institutionalDonorCount: number
  initiativeCount?: number
}

export interface Props extends React.HTMLAttributes<HTMLUListElement> {
  className?: string
  stats: Stats
}

function buildList(props: Stats): Array<React.JSX.Element> {
  const items = new Array<React.JSX.Element>()
  if (props.amountTarget) {
    items.push(
      <ListObject
        Icon={Sprout}
        text={`$${localizedNumber(props.amountRaised)} of ${localizedNumber(props.amountTarget)} raised`}
      />,
    )
  } else {
    items.push(
      <ListObject
        Icon={Sprout}
        text={`$${localizedNumber(props.amountRaised)} total raised`}
      />,
    )
  }
  if (props.raisedThisMonth) {
    items.push(
      <ListObject
        Icon={DollarSign}
        text={`$${props.raisedThisMonth.toLocaleString()} raised this month`}
      />,
    )
  }
  if (props.initiativeCount) {
    const initiativePlural = props.initiativeCount === 1 ? "" : "s"
    items.push(
      <ListObject
        Icon={Target}
        text={`${props.initiativeCount} Initiative${initiativePlural}`}
      />,
    )
  }
  const donorPlural = props.donorCount === 1 ? "" : "s"
  items.push(
    <ListObject
      Icon={UserIcon}
      text={`${props.donorCount} Donor${donorPlural}`}
    />,
  )
  // TODO: Add institutional donor count when we have logic for it
  // const institutionalDonorPlural =
  //   props.institutionalDonorCount === 1 ? "" : "s"
  // items.push(
  //   <ListObject
  //     Icon={Building2}
  //     text={`${props.institutionalDonorCount} Institutional Donor${institutionalDonorPlural}`}
  //   />,
  // )
  return items
}

const OrgStats = React.forwardRef<HTMLUListElement, Props>(
  ({ className, stats, ...props }, ref) => {
    //console.log('STATS', stats)
    return (
      <ul
        ref={ref}
        className={cn("px-3 flex flex-col gap-2", className)}
        {...props}
      >
        {buildList(stats).map((item) => {
          //console.log('ITEM', item)
          const key = item.key || Math.random()
          return <div key={key}>{item}</div>
        })}
      </ul>
    )
  },
)
OrgStats.displayName = "org-stats"

export { OrgStats }
