import { Card } from '@/components/ui/card'
import SearchBar from '@/components/search/SearchBar'
import InitiativeCard from '@/components/InitiativeCard'
import { searchInitiatives } from '@/utils/registry'

export default async function Initiatives(props: any) {
  const query = props?.searchParams?.query || ''
  const category = props?.searchParams?.category || ''
  const location = props?.searchParams?.location || ''
  console.log('SEARCH', query, category, location)
  const data = (await searchInitiatives(query, category, location)) || []
  const initiatives = data.filter((it:any)=>!it.inactive)
  //console.log('INITS', initiatives.length)

  return (
    <main className="flex min-h-screen flex-col items-stretch container pt-24 mt-12">
      <Card className="flex">
        <SearchBar />
      </Card>
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 pt-10">
        {initiatives?.length > 0 ? (
          initiatives.map((intiative: any) => <InitiativeCard key={intiative.id} data={intiative} />)
        ) : (
          <h1 className="m-4">No initiatives found</h1>
        )}
      </div>
    </main>
  )
}
