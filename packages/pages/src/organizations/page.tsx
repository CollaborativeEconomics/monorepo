import React from 'react';

import { OrganizationCard } from '@cfce/components/organization';
import { SearchBar } from '@cfce/components/search';
import { Card } from '@cfce/components/ui';
import { type OrganizationData, getOrganizations } from '@cfce/database';

export default async function Organizations(props: {
  searchParams: Promise<{
    query?: string;
    category?: string;
    location?: string;
  }>;
}) {
  const { query, category, location } = await props.searchParams;
  console.log('SEARCH', query, category, location);
  const data =
    ((await getOrganizations({
      search: query,
      category,
      location,
    })) as OrganizationData[]) || [];
  const organizations = JSON.parse(
    JSON.stringify(data.filter(org => !org.inactive)),
  ) as OrganizationData[];
  console.log('ORGS', organizations.length);

  return (
    <main className="flex min-h-screen flex-col items-stretch container mt-12 pt-24">
      <Card className="flex">
        <SearchBar />
      </Card>
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 pt-10">
        {organizations?.length > 0 ? (
          organizations.map(organization => {
            return (
              <OrganizationCard key={organization.id} data={organization} />
            );
          })
        ) : (
          <h1 className="m-4">No organizations found</h1>
        )}
      </div>
    </main>
  );
}
