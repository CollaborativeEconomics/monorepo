import appConfig from '@cfce/app-config';
import { getInitiatives } from '@cfce/database';
import {
  ActionBar,
  ImpactCarousel,
  InstructionPanes,
  VideoBackground,
} from '@cfce/universe-components/home';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: appConfig.siteInfo.title,
  viewport: { initialScale: 1.0, width: 'device-width' },
};

export default async function Handler(props: {
  searchParams?: Promise<{
    query?: string;
    category?: string;
    location?: string;
  }>;
}) {
  // const { query, category, location } = await props.searchParams;
  const initiatives = (await getInitiatives({})) || [];
  return (
    <>
      <div className="w-full top-0">
        <div className="container mt-48 mb-16 ml-6 md:ml-auto">
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
        <ImpactCarousel initiatives={initiatives} />
        <ActionBar />
        <InstructionPanes />
        <VideoBackground />
      </div>
    </>
  );
}
