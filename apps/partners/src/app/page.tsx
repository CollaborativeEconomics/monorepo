import React from 'react';
import { getServerSession } from 'next-auth/next';
import startCase from 'lodash/startCase';
import Footer from '~/components/footer';
import Header from '~/components/header';
import Main from '~/components/main';
import Title from '~/components/title';
import LinkButton from '~/components/linkbutton';
import { authOptions } from '@cfce/utils';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const name = session?.user?.name ?? '';
  const orgId = session?.orgId ?? '';
  const isLogged = !!name;
  const isAuthed = !!orgId;

  let welcomeText = 'Log in with your Google account';
  if (isLogged) {
    welcomeText = isAuthed
      ? `Welcome ${startCase(name)}`
      : 'You are not authorized, request access to the portal';
  }

  return (
    <>
      <Header />
      <Main>
        <Title text="Partners Portal" />
        <div className="py-4">
          <li>Monitor your crypto donations</li>
          <li>Create funding initiatives</li>
          <li>Update donors by creating Story NFTs</li>
          <li>Add or change crypto-wallets</li>
        </div>
        <h3 className="pt-12 pb-4">{welcomeText}</h3>
        {isLogged && isAuthed && (
          <LinkButton
            className="mb-12"
            text="GO TO DASHBOARD"
            href="/dashboard/donations"
          />
        )}
      </Main>
      <Footer />
    </>
  );
}
