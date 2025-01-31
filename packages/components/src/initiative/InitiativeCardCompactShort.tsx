import type { Initiative } from '@cfce/database';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Card, CardContent } from '~/ui/card';
import { DateDisplay } from '~/ui/date-posted';

export default function InitiativeCardCompact(props: {
  initiative: Initiative;
}) {
  const initiative = props.initiative;
  if (!initiative) {
    return <></>;
  }
  return (
    <Link href={`/initiatives/${initiative.id}`}>
      <Card className="flex flex-col overflow-hidden h-40">
        <CardContent className="flex flex-col p-0 h-full">
          <div className="flex flex-row h-full">
            <div className="relative w-40 h-full">
              <Image
                className="object-cover object-left-top"
                src={initiative.defaultAsset}
                alt="Initiative image"
                fill
              />
            </div>
            <div className="flex flex-col flex-1 p-4">
              <h3 className="text-xl font-semibold uppercase line-clamp-2">
                {initiative.title}
              </h3>
              <DateDisplay
                timestamp={+new Date(initiative.created)}
                className="py-4"
              />
              <div className="line-clamp-2">{initiative.description}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
