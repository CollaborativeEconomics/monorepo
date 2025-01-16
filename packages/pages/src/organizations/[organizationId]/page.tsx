import React from 'react';

import { InitiativeCard } from '@cfce/components/initiative';
import { OrganizationAvatar } from '@cfce/components/organization';
import { StoryCard } from '@cfce/components/story';
import {
  Button,
  OrgSocials,
  OrgStats,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@cfce/components/ui';
import {
  type OrganizationData,
  getOrganizationById,
  getStories,
} from '@cfce/database';
import Image from 'next/image';
import Link from 'next/link';
import NotFound from '../../not-found';

export default async function Home(props: {
  params: Promise<{ organizationId: string }>;
}) {
  const orgId = (await props.params)?.organizationId || null;
  if (!orgId) {
    return <NotFound />;
  }

  let organization = (await getOrganizationById(orgId)) || null;
  if (!organization) {
    return <NotFound />;
  }
  organization = JSON.parse(JSON.stringify(organization)) as OrganizationData;

  let stories = (await getStories({ orgId })) || [];
  stories = JSON.parse(JSON.stringify(stories));

  let initiatives = organization.initiative;
  initiatives = JSON.parse(JSON.stringify(initiatives));

  return (
    <main className="w-full bg-gradient-to-t from-slate-200">
      <div className="relative flex flex-col px-[5%] lg:container mt-12 pt-24 w-full h-full">
        <div className="relative h-96">
          {organization.image && (
            <Image
              className="hidden md:block absolute -z-1"
              src={organization.image}
              alt="organization image"
              fill
              style={{ objectFit: 'cover' }}
            />
          )}

          <div className="hidden md:block md:h-full bg-gradient-to-t from-slate-800 to-transparent opacity-50 w-full z-5" />

          <div className="flex flex-col md:flex-row absolute justify-center md:justify-between items-center justify-between gap-y-5 w-full w-max-full px-[5%]">
            <div className="hidden md:block">
              <OrganizationAvatar
                name={organization.name}
                image={organization.image}
                avatarProps={{ size: 'lg', title: organization.name }}
                className="text-black md:text-white"
              />
            </div>
            <div className="md:hidden">
              <OrganizationAvatar
                name={organization.name}
                image={organization.image}
                avatarProps={{ size: 'md', title: organization.name }}
                // className="text-black md:text-white"
              />
            </div>
            <div className="flex flex-col items-center pb-5 ml-4 mt-4 md:mt-0">
              <Button className="text-white bg-green-500 md:bg-white md:text-black w-48">
                Donate
              </Button>
              {organization.url ? (
                <p className="text-sm font-semibold text-black md:text-white text-center mb-24 md:mb-0">
                  to{' '}
                  <span className="underline">
                    <Link href={organization?.url ?? 'https://example.com'}>
                      {organization.name}
                    </Link>
                  </span>
                </p>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>

        <OrgSocials
          className="pt-[25rem] md:ml-56 pl-[5%] gap-1 md:gap-3"
          twitterLabel={organization.twitter || ''}
          twitterAddress={organization.twitter || ''}
          facebookLabel={organization.facebook || ''}
          facebookAddress={organization.facebook || ''}
          websiteLabel={organization.url || ''}
          websiteAddress={organization.url || ''}
        />

        <div className="pt-20">
          <Tabs defaultValue="about">
            <TabsList className="bg-slate-100">
              <TabsTrigger value="about" className="font-semibold text-md">
                About
              </TabsTrigger>
              <TabsTrigger value="stats" className="font-semibold text-md">
                Stats
              </TabsTrigger>
            </TabsList>
            <div className="mt-4 py-5 px-7 rounded-md bg-white text-black gap-3">
              <TabsContent value="about">
                {organization.description}
              </TabsContent>
              <TabsContent value="stats">
                <OrgStats
                  stats={{
                    amountRaised: organization.received || 0,
                    amountTarget: organization.goal || 0,
                    raisedThisMonth: organization.lastmonth || 0,
                    donorCount: organization.donors || 0,
                    institutionalDonorCount: organization.institutions || 0,
                    initiativeCount: organization.initiative?.length || 0,
                  }}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="mb-10 pt-10 flex justify-center w-full">
          <div className="flex flex-wrap md:flex-nowrap justify-center gap-9 md:max-w-screen-lg">
            <div className="flex flex-col gap-5 w-full md:w-2/6 min-w-[350px]">
              <p className="text-3xl font-semibold">Initiatives</p>
              {initiatives.map(initiative => {
                //initiative.organization = organization
                return <InitiativeCard key={initiative.id} data={initiative} />;
              })}
            </div>
            <div className="flex flex-col gap-5 md:w-4/6">
              <p className="text-3xl font-semibold">Stories</p>
              {stories.map(story => {
                return <StoryCard key={story.id} story={story} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
