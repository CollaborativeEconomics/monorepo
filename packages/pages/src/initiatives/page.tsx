import React from 'react';

import { getInitiatives } from '@cfce/database';
import { InitiativeCard } from '@cfce/components/initiative';
import { SearchBar } from '@cfce/components/search';
import { Card } from '@cfce/components/ui';

export default async function Initiatives({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    category?: string;
    location?: string;
  }>;
}) {
  const { query, category, location } = await searchParams;
  console.log('SEARCH', query, category, location);
  const data =
    (await getInitiatives({
      search: query,
      category,
      location,
    })) || [];
  const initiatives = data.filter(it => !it.inactive);
  //console.log('INITS', initiatives.length)

  return (
    <main className="flex min-h-screen flex-col items-stretch container pt-24 mt-12">
      <Card className="flex">
        <SearchBar />
      </Card>
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 pt-10">
        {initiatives?.length > 0 ? (
          initiatives.map(intiative => (
            <InitiativeCard key={intiative.id} data={intiative} />
          ))
        ) : (
          <h1 className="m-4">No initiatives found</h1>
        )}
      </div>
    </main>
  );
}