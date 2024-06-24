import { Card } from '@/components/ui/card'
import SearchBar from '@/components/search/SearchBar'
import OrganizationCard from '@/components/OrganizationCard'
import { searchOrganizations } from '@/lib/utils/registry'

export default async function Organizations(props:{searchParams:{query:string, category:string, location:string}}) {
  const query = props?.searchParams?.query || ''
  const category = props?.searchParams?.category || ''
  const location = props?.searchParams?.location || ''
  const organizations = (await searchOrganizations(query, category, location)) || []

  return (
    <main className="flex min-h-screen flex-col items-stretch container pt-24">
      <Card className="flex">
        <SearchBar />
      </Card>
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 pt-10">
        { organizations?.length>0 ? organizations.map((organization:any) => {
          return (
            <OrganizationCard key={organization.id} data={organization} />
          )
        }) : (
          <h1 className="m-4">No organizations found</h1>
        )}
      </div>
    </main>
  )
}
