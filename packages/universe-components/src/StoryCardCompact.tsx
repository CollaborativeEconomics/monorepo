import Image from 'next/image';
import { Card, CardContent, CardHeader } from './ui/card';
import { DateDisplay } from './ui/date-posted';
import OrganizationAvatar from './OrganizationAvatar';
import { Story } from '@/types/models'

export default function StoryCardCompact(props:{story:Story}) {
  const story = props?.story
  if(!story){ return }
  const organization = story.organization
  const initiative = story.initiative
  //const media = story.media.map((it:any)=>it.media) // flatten list
  //media.unshift(story.image) // main image to the top

  return (
    <Card className="flex overflow-hidden h-auto">
      <div className="relative min-w-[150px] max-w-[25%] w-full h-auto -mr-6">
        <Image
          className=""
          src={story.image}
          alt="IMG BG"
          fill style={{
            objectFit: 'cover',
          }}
        />
      </div>

      <CardContent className="flex flex-col overflow-hidden gap-3">

        <div className="inline-flex flex-wrap items-top pl-6 gap-x-4 pt-4">
          <OrganizationAvatar className="flex-wrap" name={organization?.name} image={organization?.image} />
          <p className="text-sm font-semibold truncate">
            in <span className="underline"><a href={'/initiatives/'+initiative?.id}>{initiative?.title}</a></span>
          </p>
        </div>

        <DateDisplay timestamp={story.created} className="pl-6" />
        <div className="pl-6 line-clamp-2">
          {story.description}
        </div>

      </CardContent>
    </Card>
  );
}