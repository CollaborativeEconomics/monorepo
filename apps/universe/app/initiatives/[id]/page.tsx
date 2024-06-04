import { useState, createContext } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StoryCard from '@/components/StoryCard'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { Document } from '@contentful/rich-text-types'
import { Separator } from '@/components/ui/separator'
import {
  getInitiativeById,
  getInitiativesByOrganization,
} from '@/lib/utils/registry'
import OrganizationAvatar from '@/components/OrganizationAvatar'
import DonationView from '@/components/DonationView'
//import DonationForm from '@/components/DonationForm'
import { ReceiptStatus } from '@/types/receipt'
import InitiativeCardCompact from '@/components/InitiativeCardCompact'
import NotFound from '@/components/NotFound'

export default async function Home(props: { params: { id: string } }) {
  const initId = props.params.id
  const initiative = await getInitiativeById(initId)
  if (!initiative) {
    return <NotFound />
  }

  const organization = initiative?.organization
  const stories = initiative?.stories
  const initiatives = await getInitiativesByOrganization(organization.id)

  const receipt = {
    status: ReceiptStatus.pending,
    image: initiative.defaultAsset,
    organization: {
      name: organization.name,
      ein: organization.EIN || 'n/a',
      address: organization.mailingAddress,
    },
    date: new Date(),
    amount: 0,
    ticker: 'USD',
    amountFiat: 0,
    fiatCurrencyCode: 'USD',
    donor: {
      name: 'Anonymous',
    },
  }

  return (
    <main className="w-full bg-gradient-to-t from-slate-200 mt-12">
      <div className="relative flex flex-col px-[5%] container pt-24 w-full h-full">
        <div className="flex overflow-hidden mb-4 flex-col md:flex-row">
          <div className="relative w-full md:w-[45%] h-[200px] md:h-[300px] mb-6 md:mb-0">
            <Image
              className="h-[300px]"
              src={initiative.defaultAsset}
              alt="IMG BG"
              fill
              style={{
                objectFit: 'cover',
              }}
            />
          </div>
          <div className="flex flex-col w-full h-auto">
            <div className="w-auto w-max-full px-[5%] pb-6">
              <OrganizationAvatar
                name={organization.name}
                image={organization.image}
                avatarProps={{ size: 'md' }}
              />
            </div>
            <h1 className="px-[5%] text-2xl font-medium pb-4">
              {initiative.title}
            </h1>
            <div className="flex mx-[5%] pb-3 overflow-hidden h-max-[40px]">
              <span className="text-sm overflow-hidden line-clamp-6">
                {initiative.description}
              </span>
            </div>
            {initiatives.length > 1 && (
              <Link className="px-[5%] font-bold hover:underline" href="#more">
                See more initiatives
              </Link>
            )}
            {stories?.length > 0 && (
              <Link
                className="px-[5%] font-bold hover:underline"
                href="#stories"
              >
                See impact storyline
              </Link>
            )}
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="md:flex md:flex-col items-center">
          <DonationView initiative={initiative} receipt={receipt} />
        </div>

        <div className="mb-10 pt-10 flex justify-center w-full">
          <div className="flex flex-wrap md:flex-nowrap justify-center gap-9 xl:max-w-screen-xl">
            {initiatives?.length > 1 && (
              <div className="flex flex-col gap-5 w-full min-w-[400px]">
                {' '}
                {/* md:w-2/6 */}
                <p className="text-3xl font-semibold">
                  <a id="more">Other Initiatives</a>
                </p>
                {initiatives.map((item: any) => {
                  if (item.id == initiative.id) {
                    return
                  }
                  return (
                    <InitiativeCardCompact
                      key={item.id}
                      timestamp={item.created}
                      imgSrc={item.defaultAsset}
                      title={item.title}
                      description={item.description}
                      amountRaised={item.received}
                      amountTarget={item.goal}
                      name={organization.name}
                      avatarImg={organization.image}
                    />
                  )
                })}
              </div>
            )}
            <div className="flex flex-col gap-5 md:w-4/6">
              <p className="text-3xl font-semibold">
                <a id="stories">Stories</a>
              </p>
              {stories?.length ? (
                stories.map((story: any) => {
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
