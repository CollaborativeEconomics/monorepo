import type { Event as EventType } from "@cfce/database"
import { ipfsCIDToUrl } from "@cfce/utils"
import { DateTime } from "luxon"
import Image from "next/image"

const Event = (event: EventType) => {
  return (
    <div className="flex flex-row justify-start w-full">
      {event.image ? (
        <Image
          src={ipfsCIDToUrl(event.image)}
          width={100}
          height={100}
          className="w-32 h-32 mr-6 rounded"
          alt={event.name ?? "Event banner image"}
        />
      ) : null}
      <div>
        <h1 className="text-2xl font-bold">{event.name}</h1>
        {event.created ? (
          <div className="text-slate-400 text-sm">
            {DateTime.fromJSDate(event.created).toRelative()}
          </div>
        ) : null}
        <h3 className="text-base">{event.description}</h3>
      </div>
    </div>
  )
}

export default Event
