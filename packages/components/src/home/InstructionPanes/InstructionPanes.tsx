'use client';

import Link from 'next/link';
import React from 'react';
import { Parallax } from '../../navigation';
import RiveAnimation from '../RiveAnimation';
import { InstructionPaneSectionImageBlend } from './InstructionPaneSectionImageBlend';

const instructionPanesData = [
  {
    slug: 'donate',
    image: '/home/DonateV2.jpg',
    riveNumber: 1 as const,
    title: 'Donate to community causes you care about',
    content: (
      <>
        Find organizations working on the{' '}
        <Link className="hover:underline" href="https://www.cfce.io/un2030/">
          sustainable development goals
        </Link>{' '}
        that you care most about. Invest in those working in your community or
        for a community you care about.
      </>
    ),
  },
  {
    slug: 'nft-receipt',
    image: '/home/NFTReceiptV2.jpg',
    riveNumber: 2 as const,
    title: 'Receive personalized, tax-deductible NFT Receipts',
    content:
      'Whenever you donate, you receive a personalzed tax-deductible NFT receipt.',
  },
  {
    slug: 'nft-story',
    image: '/home/ReceiveNFTV2.jpg',
    riveNumber: 3 as const,
    title: 'NFTs tell the story of your impact',
    content:
      'Non-profits publish and distribute their progress as Story NFTs. Watch the impact from your donation unfold!',
  },
];

export default function InstructionPanes() {
  return (
    <div className="container flex flex-col pt-8 md:pt-20 w-full gap-16">
      <h2 className="text-5xl font-bold">How it works</h2>
      {instructionPanesData.map(pane => (
        <div
          key={`${pane.slug}-pane`}
          className="flex flex-col relative gap-4 md:gap-0"
        >
          <Parallax
            className="w-full h-72 md:h-[500px] rounded-2xl"
            speed={0.5}
          >
            <InstructionPaneSectionImageBlend source={pane.image} />
          </Parallax>
          <div className="md:w-1/2 lg:w-[38%] bg-background/90 backdrop-blur-sm p-6 rounded-xl shadow-lg mr-auto flex flex-col md:flex-row gap-4 flex flex-row md:absolute top-8 left-8">
            <RiveAnimation number={pane.riveNumber} />
            <div className="flex flex-col gap-4">
              <h3 className="text-3xl font-bold">{pane.title}</h3>
              <p className="text-lg">{pane.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
