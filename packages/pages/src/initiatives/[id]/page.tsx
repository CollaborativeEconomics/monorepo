import React from "react"

import appConfig from "@cfce/app-config"
import { getCoinRate } from "@cfce/blockchain-tools/server"
import { DonationForm, NFTReceipt } from "@cfce/components/donationForm"
import { InitiativeCardCompact } from "@cfce/components/initiative"
import { OrganizationAvatar } from "@cfce/components/organization"
import { StoryCard } from "@cfce/components/story"
import { Separator } from "@cfce/components/ui"
import { getInitiativeById, getInitiatives } from "@cfce/database"
import Image from "next/image"
import Link from "next/link"
import NotFound from "../../not-found"

export default async function Initiative(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  let initiative = await getInitiativeById(params?.id)
  initiative = JSON.parse(JSON.stringify(initiative))
  //console.log('INIT', initiative)
  if (!initiative) {
    return <NotFound />
  }

  // Restore credits contract
  //console.log('RESTORING...');
  //const contractId = initiative.contractcredit;
  //restoreContract(contractId).then(result => {
  //  console.log('RESTORED', result);
  //});

  let organization = initiative.organization
  organization = JSON.parse(JSON.stringify(organization))
  let initiatives = await getInitiatives({ orgId: organization.id })
  initiatives = JSON.parse(JSON.stringify(initiatives))

  const stories = initiative.stories
  console.log("STORIES", stories.length)
  // TODO: use default chain
  const { chainDefaults } = appConfig
  console.log("CHAIN DEFAULTS", chainDefaults)
  const rate = await getCoinRate({
    symbol: chainDefaults.coin,
  })
  // TODO: use carbon only if initiative has credits
  //const carbon = await getCarbon();
  let carbon = "0"
  if (initiative.credits.length > 0) {
    carbon = `${initiative.credits[0].value}`
  }
  console.log("RATE", rate)
  console.log("CARBON", carbon)
  //console.log('INITIATIVE', initiative);

  return (
    <main className="w-full">
      <div className="relative flex flex-col px-[5%] container pt-24 w-full h-full">
        {/* Initiative Header */}
        <div className="relative h-96 rounded-lg overflow-hidden mb-4">
          {/* Overlay */}
          <div className="absolute left-0 right-0 top-0 bottom-0 h-full w-full bg-gradient-to-t from-black to-transparent opacity-50 -z-1" />
          {/* Background */}
          <Image
            src={initiative.defaultAsset || "noimage.png"}
            alt="Initiative background"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "50% 10%",
            }}
            className="-z-10"
          />
          <div className="flex flex-col w-full h-auto p-6 absolute bottom-0">
            <div className="w-auto w-max-full pb-6">
              <OrganizationAvatar
                organization={organization}
                avatarProps={{ size: "md" }}
                className="text-white"
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-medium text-white mb-3">
              {initiative.title}
            </h1>

            <div className="text-white/90 mb-4">
              <span className="text-sm md:text-base line-clamp-2">
                {initiative.description}
              </span>
            </div>

            <div className="flex gap-4 flex-wrap">
              {initiatives?.length > 1 && (
                <Link
                  className="text-white font-bold hover:underline"
                  href="#more"
                >
                  See more initiatives
                </Link>
              )}
              {stories?.length > 0 && (
                <Link
                  className="text-white font-bold hover:underline"
                  href={`/stories?initiative=${initiative.id}`}
                >
                  See impact storyline
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Donation Form and NFT Receipt */}
        <div className="md:flex md:flex-col items-center">
          <div className="flex flex-col lg:flex-row flex-nowrap gap-10 items-start">
            <div className="w-full lg:w-[60%]">
              <DonationForm initiative={initiative} rate={rate} />
            </div>
            <div className="lg:w-[40%]">
              <NFTReceipt initiative={initiative} />
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Stories and Initiatives  */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-3xl font-semibold mb-6">
              <span id="more">Other Initiatives</span>
            </p>
            <div className="grid grid-cols-1 gap-4 w-full">
              {initiatives?.length > 0 ? (
                initiatives.map((otherInitiative) => {
                  if (otherInitiative.id === initiative.id) {
                    return
                  }
                  return (
                    <InitiativeCardCompact
                      key={`other-${otherInitiative.id}`}
                      initiative={otherInitiative}
                    />
                  )
                })
              ) : (
                <h1 className="m-4">No initiatives found</h1>
              )}
            </div>
          </div>
          <div>
            <p className="text-3xl font-semibold mb-6">
              <span id="stories">Stories</span>
            </p>
            <div className="grid grid-cols-1 xxl:grid-cols-2 gap-4">
              {stories?.length > 0 ? (
                stories.map((story) => {
                  return <StoryCard key={story.id} story={story} />
                })
              ) : (
                <h1 className="m-4">No stories found</h1>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
