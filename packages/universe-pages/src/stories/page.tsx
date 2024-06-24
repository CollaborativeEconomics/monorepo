import Page from '@/components/page'
import Title from '@/components/title'
import StoryCard from '@/components/StoryCard'
//import styles from '@/styles/common.module.css'
import { getRecentStories, getStoriesByInitiative } from '@/utils/registry'

export default async function Impact(props:any) {
  const initid = props.searchParams?.initiative || ''
  console.log('InitID', initid)
  let stories = []
  if(initid){
    stories = await getStoriesByInitiative(initid) || []
  } else {
    stories = await getRecentStories(20) || []
  }
  console.log('STORIES', stories.length)
  if(stories?.length>0){ stories.sort((a:any, b:any) => (a.created < b.created ? 1 : -1)) } // Sort by date desc

  return (
    <main className="flex min-h-screen flex-col items-stretch container mt-12 pt-24">
      <div className="text-center mb-8">
        <Title text="Impact Storyline" className="text-4xl" />
      </div>
      <p className="text-center">
        Your donations are helping people and communities around the world<br/>
        Here is a storyline of recent events made possible with your help<br/>
        Together we keep building a better world!
      </p>
      <div className="mx-auto my-4 w-[720px]">
      { stories?.length>0 ? stories.map((item:any) => (
        <div className="my-4" key={item.id}>
          <StoryCard key={item.id} story={item} />
        </div>
      )) : (
        <h1 className="text-center text-2xl my-24">No stories found</h1>
      )}
      </div>
    </main>
  )
}
