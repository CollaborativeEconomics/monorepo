import Link from "next/link"
import Image from "next/image"
import OrganizationAvatar from './OrganizationAvatar'
import { Card, CardContent, CardHeader } from './ui/card'
import { DateDisplay } from './ui/date-posted'
import Gallery from './ui/gallery'
import ShareModal from './ShareModal'
import { Story } from '@/types/models'

export default function StoryPage(props:{story:Story}) {
  const story = props?.story
  if(!story){ return }
  const media = story.media?.map((it:any)=>it.media) // flatten list
  media?.unshift(story.image) // main image to the top
  //console.log('IMGS', images)

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="flex-row justify-between">
        <DateDisplay timestamp={story.created} className="py-4" />
        <ShareModal />
      </CardHeader>
      <div className="px-2 -mt-2">
        <Gallery images={media} />
      </div>
      <CardContent className="flex flex-col pb-8 pt-3 gap-3 px-6">
        <h1 className="mt-4 text-4xl">{story.name}</h1>
        <p className="">{story.description}</p>
        <div className="flex flex-row justify-between border-t mt-4 pt-4">
          <div>
            <p className="mb-4 text-sm font-semibold">
              <span>Posted in{' '}</span>
              <span className="underline">
                <a href={'/initiatives/'+story.initiative?.id}>{story.initiative?.title}</a>
              </span>
            </p>
            <Link href={'/organizations/'+story.organization?.id}><OrganizationAvatar name={story.organization?.name} image={story.organization?.image} /></Link>
          </div>
          <div className="flex flex-col items-center">
            {story.initiative?.category ?
              <>
                <h1 className="text-sm">{story.initiative?.category?.title}</h1>
                <Image src={story.initiative?.category?.image || '/media/noimage.png'} width={96} height={96} alt="Category" />
              </>
            :
              <></>
            }
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
