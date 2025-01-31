import appConfig from '@cfce/app-config';
import {
  ActionBar,
  ImpactCarousel,
  InstructionPanes,
  VideoBackground,
} from '@cfce/components/home';
import { getInitiatives } from '@cfce/database';
import type { Metadata, Viewport } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: appConfig.siteInfo.title,
};

export const viewport: Viewport = { initialScale: 1.0, width: 'device-width' };

export default async function Handler(props: {
  searchParams?: Promise<{
    query?: string;
    category?: string;
    location?: string;
  }>;
}) {
  // const { query, category, location } = await props.searchParams;
  const data = (await getInitiatives({})) || [];
  const list = data.filter(it => !it.inactive); // remove inactive initiatives
  const plain = JSON.parse(JSON.stringify(list)); // Only plain objects can be passed to Client Components
  //console.log('JSON', JSON.stringify(plain,null,2))
  return (
    <>
      <div className="relative">
        <div className="container pt-48 pb-16 py-6 md:py-auto">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-accent-foreground">
            Blockchain-driven philanthropy <br />
            for a transparent world
          </h1>
          <p className="pt-4 w-[95%] md:w-[60%]">
            With the increased transparency that blockchain donations provide,
            meaningful initiatives combine with donor generosity to tell the
            story of real world impact.
          </p>
        </div>
        <ImpactCarousel initiatives={plain} />
        <ActionBar />
        <div className="absolute inset-0 -z-10">
          <VideoBackground />
        </div>
      </div>
      <InstructionPanes />
    </>
  );
}
