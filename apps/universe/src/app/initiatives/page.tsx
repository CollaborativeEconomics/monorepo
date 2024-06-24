import { Card } from '@/components/ui/card'
import SearchBar from '@/components/search/SearchBar'
import InitiativeCard from '@/components/InitiativeCard'
import { searchInitiatives } from '@/lib/utils/registry'

export default async function Initiatives(props: {searchParams:{query?:string, category?:string, location?:string}}) {
  const query = props?.searchParams?.query || ''
  const category = props?.searchParams?.category || ''
  const location = props?.searchParams?.location || ''
  console.log('SEARCH', query, category, location)
  const initiatives = (await searchInitiatives(query, category, location)) || []
  //console.log('INITS', initiatives.length)

  return (
    <main className="flex min-h-screen flex-col items-stretch container pt-24">
      <Card className="flex">
        <SearchBar />
      </Card>
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 pt-10">
        {initiatives?.length ? (
          initiatives.map((intiative: any) => <InitiativeCard key={intiative.id} data={intiative} />)
        ) : (
          <h1 className="m-4">No initiatives found</h1>
        )}
      </div>
    </main>
  )
}
