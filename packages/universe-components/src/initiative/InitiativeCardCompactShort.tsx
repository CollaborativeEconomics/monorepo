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
    <Card className="flex flex-col overflow-hidden h-56">
      <CardContent className="flex flex-col pb-8 pt-3 gap-3 px-0">
        <Link href={`/initiatives/${initiative.id}`}>
          <div className="inline-flex">
            <Image
              className="mt-3 ml-6"
              src={initiative.defaultAsset}
              alt="IMG BG"
              width={120}
              height={120}
            />
            <div>
              <h3 className="px-6 pt-2 text-xl font-semibold uppercase">
                {initiative.title}
              </h3>
              <DateDisplay
                timestamp={+new Date(initiative.created)}
                className="py-4 px-6"
              />
              <div className="px-6 line-clamp-2">{initiative.description}</div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
