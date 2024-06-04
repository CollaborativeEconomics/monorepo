
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Props {
  page: 'receipts' | 'donations';
}

// @deprecated
// Possibly unused, consider removing
export default function DonationsSwitch() {
  const activeStyle = 'bg-card text-foreground shadow';
  const params = useSearchParams();
  const page = params.get('tab') || 'receipts'
  console.log('PATH', page)
  return (
    <div className="inline-flex items-center justify-center rounded-lg bg-accent p-2 mb-2 text-muted-foreground">
      <div
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
          page === 'receipts' ? activeStyle : ''
        }`}
      >
        <Link href="?tab=receipts" data-state="active">
          NFTs Receipts
        </Link>
      </div>
      <div
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
          page === 'donations' ? activeStyle : ''
        }`}
      >
        <Link href="?tab=donations">My Donations</Link>
      </div>
    </div>
  );
}
