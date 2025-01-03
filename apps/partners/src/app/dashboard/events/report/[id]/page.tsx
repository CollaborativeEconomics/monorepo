import { getContract, getEventById } from "@cfce/database"
import { Suspense } from "react"
import ReportClient from "./report-client"

interface PageProps {
  params: Promise<{ id: string }>
  //searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ReportPage({ params }: PageProps) {
  const { id } = await params
  const event = await getEventById(id)

  if (!event) {
    return null
  }

  const resNFT = await getContract(id, "arbitrum", "testnet", "1155")
  const contractNFT = resNFT.length > 0 ? resNFT[0] : null

  if (!contractNFT) {
    return null
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportClient id={id} event={event} contractNFT={contractNFT} />
    </Suspense>
  )
}
