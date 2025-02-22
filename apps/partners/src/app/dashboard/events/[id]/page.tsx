import appConfig from "@cfce/app-config"
import { getContract, getEventById } from "@cfce/database"
import { Suspense } from "react"
import EventClient from "./event-client"

interface PageProps {
  params: Promise<{ id: string }>
  //searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function EventPage({ params }: PageProps) {
  const { id } = await params
  const event = await getEventById(id)

  if (!event) {
    return null
  }

  const resNFT = await getContract(
    id,
    "arbitrum",
    appConfig.chainDefaults.network,
    "1155",
  )
  const resV2E = await getContract(
    id,
    "arbitrum",
    appConfig.chainDefaults.network,
    "V2E",
  )

  const contractNFT = resNFT.length > 0 ? resNFT[0] : null
  const contractV2E = resV2E.length > 0 ? resV2E[0] : null

  // TODO: is event still supposed to have media?
  // const media = event.media?.map((it: any) => it.media) || [];
  // media.unshift(event.image); // main image to the top
  const media = event.image ? [event.image] : null

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EventClient
        id={id}
        event={JSON.parse(JSON.stringify(event))}
        media={media}
        contractNFT={JSON.parse(JSON.stringify(contractNFT))}
        contractV2E={JSON.parse(JSON.stringify(contractV2E))}
      />
    </Suspense>
  )
}
