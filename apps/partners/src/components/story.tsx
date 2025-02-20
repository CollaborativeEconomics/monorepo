import type { Story } from "@cfce/database"
import { ipfsCIDToUrl } from "@cfce/utils"
import { DateTime } from "luxon"
import Image from "next/image"

const StoryCard = (item: Story) => {
  return (
    <div className="flex flex-row justify-start w-full">
      {item.image ? (
        <Image
          src={ipfsCIDToUrl(item.image)}
          width={100}
          height={100}
          className="w-32 h-32 mr-6 rounded"
          alt={item.name ?? "Story image"}
        />
      ) : null}
      <div>
        <h1 className="text-2xl font-bold">{item.name}</h1>
        {DateTime.fromJSDate(item.created).toRelative()}
        <h3 className="text-base">{item.description}</h3>
      </div>
    </div>
  )
}

export default StoryCard
