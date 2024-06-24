'use client'

import {
  InstructionPaneSectionContent,
  InstructionPaneSectionText,
  InstructionPaneSectionTitle,
  InstructionPaneSectionImageBlend,
} from './InstructionPaneSection'
import Link from 'next/link'
import RiveAnimation from './RiveAnimation'

export default function InstructionPanes() {
  return (
    <div className="relative flex flex-col container pt-20 md:my-auto pl-0 w-[90%]">
      <h2 className="text-5xl font-bold pb-8">How it works</h2>
      <div className="flex flex-col md:flex-row">
        <RiveAnimation number={1} />
        <InstructionPaneSectionContent>
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
            that you care most about. Invest in those working in your community
            or for a community you care about.
          </InstructionPaneSectionText>
        </InstructionPaneSectionContent>
      </div>
      <InstructionPaneSectionImageBlend sourceProperty='bg-[url("/home/DonateV2.jpg")]' />
      <div className="flex flex-col md:flex-row">
        <RiveAnimation number={2} />
        <InstructionPaneSectionContent>
          <InstructionPaneSectionTitle>
            Receive personalized, tax-deductible NFT Receipts
          </InstructionPaneSectionTitle>
          <InstructionPaneSectionText>
            Whenever you donate, you receive a personalzed tax-deductible NFT
            receipt.
          </InstructionPaneSectionText>
        </InstructionPaneSectionContent>
      </div>
      <InstructionPaneSectionImageBlend sourceProperty="bg-[url('/home/NFTReceiptV2.jpg')]" />
      <div className="flex flex-col md:flex-row">
        <RiveAnimation number={3} />
        <InstructionPaneSectionContent>
          <InstructionPaneSectionTitle>
            NFTs tell the story of your impact
          </InstructionPaneSectionTitle>
          <InstructionPaneSectionText>
            Non-profits publish and distribute their progress as Story NFTs.
            Watch the impact from your donation unfold!
          </InstructionPaneSectionText>
        </InstructionPaneSectionContent>
      </div>
      <InstructionPaneSectionImageBlend sourceProperty="bg-[url('/home/ReceiveNFTV2.jpg')]" />
    </div>
  )
}
