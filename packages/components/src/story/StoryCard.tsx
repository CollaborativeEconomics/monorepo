import type { StoryWithRelations } from '@cfce/database';
import Link from 'next/link';
import React from 'react';
import OrganizationAvatar from '~/organization/OrganizationAvatar';
import { Card, CardContent, CardHeader } from '~/ui/card';
import DateDisplay from '~/ui/date-posted';
import Gallery from '~/ui/gallery';

interface StoryCardProps {
  story: StoryWithRelations;
}

export default function StoryCard(props: StoryCardProps) {
  const story = props?.story;
  if (!story) {
    return;
  }
  const organization = story.organization;
  const initiative = story.initiative;
  const media = story.media.map(it => it.media); // flatten list
  if (story.image) {
    media.unshift(story.image); // main image to the top
  }

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader>
        <OrganizationAvatar
          name={organization?.name}
          image={organization?.image ?? '/nopic.png'}
          avatarProps={{ title: organization?.name }}
        />
        <p className="text-sm font-semibold">
          in{' '}
          <span className="underline">
            <a href={`/initiatives/${initiative?.id}`}>{initiative?.title}</a>
          </span>
        </p>
        <DateDisplay
          timestamp={new Date(story.created).getTime()}
          className="py-4"
        />
      </CardHeader>
      <div className="px-2 -mt-2">
        <Link href={`/stories/${story.id}`}>
          <Gallery images={media} />
        </Link>
      </div>
      <CardContent className="flex flex-col pb-8 pt-3 gap-3 px-0">
        <p className="px-6">{story.description}</p>
      </CardContent>
    </Card>
  );
}
