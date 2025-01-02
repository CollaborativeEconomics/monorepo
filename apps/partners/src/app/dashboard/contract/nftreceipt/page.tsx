import { Suspense } from "react"
import NFTReceiptClient from "./nftreceipt-client"
import { getOrganizationById } from "~/actions/database"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function NFTReceiptPage({ searchParams }: PageProps) {
  const { chain, network, wallet, organizationId } = await searchParams
  const data = await getOrganizationById(organizationId?.toString() || "")
  const organization = JSON.parse(JSON.stringify(data))

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NFTReceiptClient
        chain={chain?.toString()}
        network={network?.toString()}
        wallet={wallet?.toString()}
        organizationId={organizationId?.toString()}
        organization={organization}
      />
    </Suspense>
  )
}
