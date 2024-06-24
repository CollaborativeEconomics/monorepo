import Link from 'next/link'
import OrganizationAvatar from './OrganizationAvatar'
import { Card, CardContent, CardHeader } from './ui/card'
import { DateDisplay } from './ui/date-posted'
import Gallery from './ui/gallery'
import { Story } from '@/types/models'

export default function StoryCard(props:{story:Story}) {
  const story = props?.story
  if(!story){ return }
  const organization = story.organization
  const initiative = story.initiative
  const media = story.media?.map((it:any)=>it.media) // flatten list
  media?.unshift(story.image) // main image to the top
  //console.log(media)

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader>
        <OrganizationAvatar name={organization?.name} image={organization?.image} avatarProps={{ title: organization?.name }} />
        <p className="text-sm font-semibold">
          in <span className="underline"><a href={'/initiatives/'+initiative?.id}>{initiative?.title}</a></span>
        </p>
        <DateDisplay timestamp={story.created} className="py-4" />
      </CardHeader>
      <div className="px-2 -mt-2">
        <Link href={'/stories/'+story.id}>
          <Gallery images={media} />
        </Link>
      </div>
      <CardContent className="flex flex-col pb-8 pt-3 gap-3 px-0">
        <p className="px-6">
          {story.description}
        </p>
      </CardContent>
    </Card>
  )
}
