import {
  DonationsTableSortable,
  ReceiptTableSortable,
} from '@cfce/components/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@cfce/components/ui';
import { getDonations, getNftData } from '@cfce/database';
import { ImageIcon, LayoutList, Newspaper } from 'lucide-react';
import { Suspense } from 'react';
import { DonationsTableSkeleton } from './ProfileSkeletons';

type Props = {
  userId: string;
};

async function DonationsData({ userId }: Props) {
  const [receipts, donations] = await Promise.all([
    getNftData({ userId }),
    getDonations({ userId }),
  ]);

  return (
    <div className="w-full border rounded-md p-10 bg-card">
      <TabsContent className="TabsContent" value="tab1">
        <ReceiptTableSortable
          receipts={JSON.parse(JSON.stringify(receipts)) || []}
        />
      </TabsContent>
      <TabsContent className="TabsContent" value="tab2">
        <DonationsTableSortable
          donations={JSON.parse(JSON.stringify(donations)) || []}
        />
      </TabsContent>
    </div>
  );
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
                NFTs Receipts
              </TabsTrigger>
              <TabsTrigger className="TabsTrigger" value="tab2">
                My Donations
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="flex flex-row">
            <Newspaper size={32} className="pr-2 cursor-pointer" />
            <LayoutList size={32} className="pr-2 cursor-pointer" />
            <ImageIcon size={32} className="pr-2 cursor-pointer" />
          </div>
        </div>
        <Suspense fallback={<DonationsTableSkeleton />}>
          <DonationsData userId={userId} />
        </Suspense>
      </Tabs>
    </div>
  );
}
