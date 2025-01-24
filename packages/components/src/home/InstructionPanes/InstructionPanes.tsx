'use client';

import Link from 'next/link';
import React from 'react';
import RiveAnimation from '../RiveAnimation';
import {
  InstructionPaneSectionContent,
  InstructionPaneSectionImageBlend,
  InstructionPaneSectionText,
  InstructionPaneSectionTitle,
} from './InstructionPaneSection';

export default function InstructionPanes() {
  return (
    <div className="flex flex-col container pt-20 pl-0 w-[90%] gap-8">
      <h2 className="text-5xl font-bold">How it works</h2>

      <div className="flex flex-col h-[400px] rounded-2xl overflow-hidden">
        <InstructionPaneSectionImageBlend
          sourceProperty='bg-[url("/home/DonateV2.jpg")]'
          className="w-full h-full rounded-2xl"
        />
        <div className="flex flex-col md:flex-row items-center px-8 mt-[-400px] h-full">
          <InstructionPaneSectionContent className="md:w-1/3 bg-background/90 backdrop-blur-sm p-6 rounded-xl shadow-lg mr-auto">
            <RiveAnimation number={1} />
            <InstructionPaneSectionTitle>
              Donate to community causes you care about
            </InstructionPaneSectionTitle>
            <InstructionPaneSectionText>
              Find organizations working on the{' '}
              <Link
                className="hover:underline"
                href="https://www.cfce.io/un2030/"
              >
                sustainable development goals
              </Link>{' '}
              that you care most about. Invest in those working in your
              community or for a community you care about.
            </InstructionPaneSectionText>
          </InstructionPaneSectionContent>
        </div>
      </div>

      <div className="flex flex-col h-[400px] rounded-2xl overflow-hidden">
        <InstructionPaneSectionImageBlend
          sourceProperty="bg-[url('/home/NFTReceiptV2.jpg')]"
          className="w-full h-full rounded-2xl"
        />
        <div className="flex flex-col md:flex-row items-center px-8 mt-[-400px] h-full">
          <InstructionPaneSectionContent className="md:w-1/3 bg-background/90 backdrop-blur-sm p-6 rounded-xl shadow-lg mr-auto">
            <RiveAnimation number={2} />
            <InstructionPaneSectionTitle>
              Receive personalized, tax-deductible NFT Receipts
            </InstructionPaneSectionTitle>
            <InstructionPaneSectionText>
              Whenever you donate, you receive a personalzed tax-deductible NFT
              receipt.
            </InstructionPaneSectionText>
          </InstructionPaneSectionContent>
        </div>
      </div>

      <div className="flex flex-col h-[400px] rounded-2xl overflow-hidden">
        <InstructionPaneSectionImageBlend
          sourceProperty="bg-[url('/home/ReceiveNFTV2.jpg')]"
          className="w-full h-full rounded-2xl"
        />
        <div className="flex flex-col md:flex-row items-center px-8 mt-[-400px] h-full">
          <InstructionPaneSectionContent className="md:w-1/3 bg-background/90 backdrop-blur-sm p-6 rounded-xl shadow-lg mr-auto">
            <RiveAnimation number={3} />
            <InstructionPaneSectionTitle>
              NFTs tell the story of your impact
            </InstructionPaneSectionTitle>
            <InstructionPaneSectionText>
              Non-profits publish and distribute their progress as Story NFTs.
              Watch the impact from your donation unfold!
            </InstructionPaneSectionText>
          </InstructionPaneSectionContent>
        </div>
      </div>
    </div>
  );
}
