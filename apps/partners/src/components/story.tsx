import Image from "next/image"
import type { Story } from "@cfce/database"
import { DateTime } from "luxon"

const Story = (item: Story) => {
  return (
    <div className="flex flex-row justify-start w-full">
      {item.image ? (
        <Image
          src={
            item.image.startsWith("ipfs:")
              ? process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL + item.image.substr(5)
              : item.image
          }
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

export default Story
