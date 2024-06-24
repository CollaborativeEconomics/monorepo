'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  page: 'initiatives' | 'organizations';
}

export default function InitiativeOrgSwitch() {
  const activeStyle = 'bg-card text-foreground shadow';
  const path = usePathname();
  const page = path.split('/')[1];
  return (
    <div className="inline-flex items-center justify-center rounded-lg bg-accent px-2 text-muted-foreground">
      <div
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
          page === 'initiatives' ? activeStyle : ''
        }`}
      >
        <Link href="/initiatives" data-state="active">
          Initiatives
        </Link>
      </div>
      <div
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
          page === 'organizations' ? activeStyle : ''
        }`}
      >
        <Link href="/organizations">Organizations</Link>
      </div>
    </div>
  );
}
