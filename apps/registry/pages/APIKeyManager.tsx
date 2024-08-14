import { auth } from 'next-auth';
import React, { useState } from 'react';

import { prismaClient } from '@cfce/database';
import { authOptions } from 'pages/api/auth/[...nextauth]';

export async function getServerSideProps(context) {
  // @ts-ignore
  const session = await auth(
    // @ts-ignore
    context.req,
    // @ts-ignore
    context.res,
    // @ts-ignore
    authOptions,
  );

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const { api_key } = await prismaClient.user.findFirst();
  console.log({ api_key, session });

  return { props: { session, api_key } };
}

const APIKeyManager = () => {
  const [apiSecret, setApiSecret] = useState('');

  return (
    <div>
      <h2>Generate an API Key</h2>
      {apiSecret}
      <button
        type="button"
        onClick={() => {
          fetch('/api/users/api_key', {
            method: 'put',
          });
        }}
      >
        Get Keys
      </button>
    </div>
  );
};

export default APIKeyManager;
