import { ipfsCIDToUrl } from "@cfce/utils/client"
import Image from "next/image"
import React from "react"
interface Props {
  images?: string[]
}

export default function Gallery(props: Props) {
  return (
    <div className="grid gap-2">
      <div>
        <Image
          className="w-full aspect-[4/3] object-cover rounded-md max-h-[500px]"
          src={ipfsCIDToUrl(props.images?.[0] ?? "/nopic.png")}
          alt=""
          width={1000}
          height={1000}
        />
      </div>
      {props.images?.slice(1).length ? (
        <ThumbnailGrid images={props.images?.slice(1)} />
      ) : null}
    </div>
  )
}

function ThumbnailGrid({ images }: { images: string[] }) {
  // must contain at least three images to fill to width, overflows to new row after 4
  let gridClass: string
  if (images.length <= 3) {
    gridClass = "grid grid-cols-3 gap-2"
  } else {
    gridClass = "grid grid-cols-4 gap-2"
  }
  console.log({ images })
  return (
    <div className={gridClass}>
      {images.map((image) => (
        <Image
          key={image}
          className="h-auto max-w-full aspect-[4/3] object-cover rounded-md"
          src={ipfsCIDToUrl(image)}
          width={600}
          height={600}
          alt=""
        />
      ))}
    </div>
  )
}
