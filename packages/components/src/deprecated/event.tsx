import React from "react"
import Image from "next/image"
import { DateTime } from "luxon"

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

// @deprecated old story UI
const Event = (item: EventProps) => {
  return (
    <div className="flex flex-row justify-start w-full">
      <Image
        src={item.image || ""}
        width={100}
        height={100}
        className="w-32 h-32 mr-6 rounded"
        alt={item.name || ""}
      />
      <div>
        <h1 className="text-2xl font-bold">{item.name || ""}</h1>
        <div className="text-slate-400 text-sm">
          {DateTime.fromJSDate(item.created ?? new Date(0)).toRelative()}
        </div>
        <h3 className="text-base">{item.description || ""}</h3>
      </div>
    </div>
  )
}

export default Event
