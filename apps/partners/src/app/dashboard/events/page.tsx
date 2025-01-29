import { auth } from '@cfce/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import {
  getEventsByOrganization,
  getOrganizationById,
} from '~/actions/database';
import EventsClient from './events-client';

export default async function Page() {
  const session = await auth();
  console.log('Events session', { session });
  const oid = session?.orgId ?? '';
  if (!oid) {
    redirect('/dashboard');
  }
  const orgData = (await getOrganizationById(oid)) || {};
  const evtData = (await getEventsByOrganization(oid)) || [];
  const organization = JSON.parse(JSON.stringify(orgData));
  const events = JSON.parse(JSON.stringify(evtData));
  console.log('ORG:', organization?.name);
  console.log('EVT:', events.length);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EventsClient organization={organization} events={events} />
    </Suspense>
  );
}
