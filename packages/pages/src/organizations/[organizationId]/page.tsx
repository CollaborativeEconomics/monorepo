import React from 'react';

import { InitiativeCard } from '@cfce/components/initiative';
import { OrganizationAvatar } from '@cfce/components/organization';
import { StoryCard } from '@cfce/components/story';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarTitle,
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

const DonateButton = (organization: OrganizationData) => {
  return (
    <div className="flex flex-col items-center ml-4 mt-4 md:mt-0 z-20">
      <Button className="text-white bg-green-500 md:bg-white md:text-black w-48">
        <Link href={`/initiatives/${organization.initiative[0].id}`}>
          Donate
        </Link>
      </Button>
      {organization.url ? (
        <p className="text-sm font-semibold text-foreground md:text-white text-center mt-4">
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
  );
};

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
  console.log({ organization });

  return (
    <main className="w-full">
      <div className="relative flex flex-col px-[5%] lg:container pt-24 w-full h-full">
        {/* Banner */}
        <div className="relative md:h-96 -z-1 p-8 flex flex-col items-end rounded-md overflow-hidden">
          <div className="absolute left-0 right-0 top-0 bottom-0 h-full w-full bg-gradient-to-t from-black to-transparent opacity-70 z-10" />
          {organization.background && (
            <Image
              src={organization.background}
              alt="organization image"
              fill
              style={{ objectFit: 'cover' }}
            />
          )}
          {/* Organization Info */}
          <div className="flex flex-col md:flex-row justify-center items-end gap-y-5 w-full h-full w-max-full z-10">
            <div className="hidden md:flex w-full justify-between items-end gap-4 z-20">
              <>
                <Avatar size="lg">
                  {organization.image ? (
                    <AvatarImage
                      src={organization.image}
                      alt={organization.name}
                    />
                  ) : (
                    <AvatarFallback>
                      {organization.name.slice(0, 2)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col items-start z-20">
                  <AvatarTitle
                    className="line-clamp-3"
                    size="lg"
                    title={organization.name}
                  />
                  <OrgSocials
                    className="gap-1 md:gap-3"
                    twitterLabel={organization.twitter || ''}
                    twitterAddress={organization.twitter || ''}
                    facebookLabel={organization.facebook || ''}
                    facebookAddress={organization.facebook || ''}
                    websiteLabel={organization.url || ''}
                    websiteAddress={organization.url || ''}
                  />
                </div>
              </>
              <DonateButton {...organization} />
            </div>
          </div>

          {/* Small */}
          <div className="md:hidden flex flex-col items-center justify-stretch z-20">
            <Avatar size="lg">
              {organization.image ? (
                <AvatarImage src={organization.image} alt={organization.name} />
              ) : (
                <AvatarFallback>{organization.name.slice(0, 2)}</AvatarFallback>
              )}
            </Avatar>
            <AvatarTitle
              className="line-clamp-3 text-center mt-4"
              size="md"
              title={organization.name}
            />
            <OrgSocials
              className="gap-1 md:gap-3 md:hidden"
              twitterLabel={organization.twitter || ''}
              twitterAddress={organization.twitter || ''}
              facebookLabel={organization.facebook || ''}
              facebookAddress={organization.facebook || ''}
              websiteLabel={organization.url || ''}
              websiteAddress={organization.url || ''}
            />
            <DonateButton {...organization} />
          </div>
        </div>

        {/* Tabs */}
        <div className="pt-8">
          <Tabs defaultValue="about">
            <TabsList>
              <TabsTrigger value="about" className="font-semibold text-md">
                About
              </TabsTrigger>
              <TabsTrigger value="stats" className="font-semibold text-md">
                Stats
              </TabsTrigger>
            </TabsList>
            <div className="mt-4 py-5 px-7 rounded-md bg-card text-foreground gap-3">
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
