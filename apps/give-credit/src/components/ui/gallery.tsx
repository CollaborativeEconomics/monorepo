'use client';

interface Props {
  images?: string[];
}

const IPFSURL = process.env.IPFS_GATEWAY_URL

export default function Gallery(props: Props) {
  let image = props.images?.[0] ?? '/nopic.png'
  if(image.startsWith('ipfs:')){
    image = IPFSURL + image.substr(5)
  }
  return (
    <div className="grid gap-1">
      <div>
        <img className="h-auto min-w-full max-w-full aspect-[4/3] object-cover" src={image} alt="" />
      </div>
      {getGridDiv(props.images?.slice(1))}
    </div>
  );
}

function getGridDiv(images: string[] | undefined): React.ReactElement {
  if (!images) {
    return <div />
  }
  // must contain at least three images to fill to width, overflows to new row after 4
  let gridClass;
  if (images.length <= 3) {
    gridClass = "grid grid-cols-3 gap-1";
  } else {
    gridClass = "grid grid-cols-4 gap-1";
  }
  return (
    <div className={gridClass}>
      {
        images.map(image => getImageDiv(image))
      }
    </div>
  )
}

function getImageDiv(image: string): React.ReactElement {
  const imgsrc = image.startsWith('ipfs:') ? IPFSURL + image.substr(5) : image
  return (
    <div key={image}>
      <img className="h-auto max-w-full aspect-[4/3] object-cover" src={imgsrc} alt=""/>
    </div>
  )
}
