import { useState, createContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import StoryCard from '@/components/StoryCard';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from '@contentful/rich-text-types';
import { Separator } from '@/components/ui/separator';
import OrganizationAvatar from '@/components/OrganizationAvatar';
import DonationView from '@/components/DonationView';
import { ReceiptStatus } from '@/types/common';
import InitiativeCardCompact from '@/components/InitiativeCardCompact';
import NotFound from '@/components/NotFound';
import { getInitiativeById, getInitiativesByOrganization } from '@/utils/registry';
import restoreContract from '@/contracts/credits/server/restore';
import getRates from '@/utils/rates';

export default async function Handler(props: any) {
  const params = props.params;
  const initiative = (await getInitiativeById(params?.id)) || null;
  //console.log('INIT', initiative)
  if (!initiative) {
    return <NotFound />;
  }

  // Restore credits contract
  //console.log('RESTORING...');
  //const contractId = initiative.contractcredit;
  //restoreContract(contractId).then(result => {
  //  console.log('RESTORED', result);
  //});

  const organization = initiative.organization;
  const initiatives = await getInitiativesByOrganization(organization.id);
  const stories = initiative.stories;
  console.log('STORIES', stories.length);
  const rate = await getRates('XLM');
  //const carbon = await getCarbon();
  let carbon = '0'
  if(initiative.credits.length>0){
    carbon = initiative.credits[0].value
  }
  console.log('RATE', rate)
  console.log('CARBON', carbon)

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
  };

  return (
    <main className="w-full bg-gradient-to-t from-slate-200 dark:from-slate-950 mt-12">
      <div className="relative flex flex-col px-[5%] container pt-24 w-full h-full">
        <div className="flex overflow-hidden mb-4 flex-col md:flex-row">
          <div className="relative w-full md:w-[45%] h-[200px] md:h-[300px] mb-12 md:mb-2">
            <Image
              className="h-[300px] rounded-lg"
              src={initiative.defaultAsset||'noimage.png'}
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
          <DonationView initiative={initiative} receipt={receipt} rate={rate} carbon={carbon} />
        </div>

        <div className="mb-10 pt-10 flex justify-center w-full">
          <div className="flex flex-wrap md:flex-nowrap justify-center gap-9 xl:max-w-screen-xl">
            {initiatives.length > 1 && (
              <div className="flex flex-col gap-5 w-full min-w-[400px]">
                {' '}
                {/* md:w-2/6 */}
                <p className="text-3xl font-semibold">
                  <a id="more">Other Initiatives</a>
                </p>
                {initiatives?.length > 0 ? (
                  initiatives.map((item: any) => {
                    if (item.id == initiative.id) {
                      return;
                    }
                    return (
                      <InitiativeCardCompact
                        key={item.id}
                        timestamp={item.created}
                        imgSrc={item.defaultAsset||'noimage.png'}
                        title={item.title}
                        description={item.description}
                        amountRaised={item.received}
                        amountTarget={item.goal}
                        name={organization.name}
                        avatarImg={organization.image}
                      />
                    );
                  })
                ) : (
                  <h1 className="m-4">No initiatives found</h1>
                )}
              </div>
            )}
            {/*
            <div>
              <p className="text-3xl font-semibold py-6">
                <a id="stories">Stories</a>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {stories?.length > 0 ? (
                  stories.map((story: any) => {
                    return <StoryCard key={story.id} story={story} />;
                  })
                ) : (
                  <h1 className="m-4">No stories found</h1>
                )}
              </div>
            </div>
            */}
          </div>
        </div>
      </div>
    </main>
  );
}
