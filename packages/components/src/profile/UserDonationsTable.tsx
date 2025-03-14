import {
  DonationsTableSortable,
  ReceiptTableSortable,
} from "@cfce/components/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@cfce/components/ui"
import { getDonations, getNftData } from "@cfce/database"
import type {
  DonationWithRelations,
  NFTDataWithRelations,
} from "@cfce/database"
import { ImageIcon, LayoutList, Newspaper } from "lucide-react"
import { Suspense } from "react"
import { DonationsTableSkeleton } from "./ProfileSkeletons"
import { ReceiptNFTCard } from "./ReceiptNFTCard"
type Props = {
  userId: string
}

async function DonationsData({ userId }: Props) {
  let [receipts, donations] = await Promise.all([
    getNftData({ userId }),
    getDonations({ userId }),
  ])
  receipts = JSON.parse(JSON.stringify(receipts))
  donations = JSON.parse(JSON.stringify(donations))

  return (
    <div className="w-full border rounded-md px-6 py-4 bg-card">
      {/* NFT card view */}
      <TabsContent className="TabsContent mt-0" value="tab1">
        <div className="grid grid-cols-1 sm:grid-cols-2 xxl:grid-cols-3 gap-6">
          {receipts.map((receipt) => {
            return <ReceiptNFTCard key={receipt.id} {...receipt} />
          })}
        </div>
      </TabsContent>
      {/* NFT Receipts */}
      <TabsContent className="TabsContent" value="tab2">
        <ReceiptTableSortable receipts={receipts} />
      </TabsContent>
      {/* Donations */}
      <TabsContent className="TabsContent" value="tab3">
        <DonationsTableSortable donations={donations} />
      </TabsContent>
    </div>
  )
}

export function UserDonationsTable({ userId }: Props) {
  return (
    <div className="w-full lg:w-3/4">
      <h1 className="text-2xl font-medium mb-4">Donation Data</h1>
      <Tabs className="TabsRoot" defaultValue="tab1">
        <div className="flex flex-row justify-between items-center">
          <div className="mb-2">
            <TabsList className="TabsList" aria-label="Donations data">
              <TabsTrigger className="TabsTrigger" value="tab1">
                Donation Receipt NFTs
              </TabsTrigger>
              <TabsTrigger className="TabsTrigger" value="tab2">
                NFTs Receipts
              </TabsTrigger>
              <TabsTrigger className="TabsTrigger" value="tab3">
                My Donations
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        <Suspense fallback={<DonationsTableSkeleton />}>
          <DonationsData userId={userId} />
        </Suspense>
      </Tabs>
    </div>
  )
}
