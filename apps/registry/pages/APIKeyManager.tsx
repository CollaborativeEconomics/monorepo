import React, { useState } from 'react'
import { unstable_getServerSession } from 'next-auth'

import { authOptions } from 'pages/api/auth/[...nextauth]'
import { prismaClient } from '@cfce/database'

export async function getServerSideProps(context) {
  // @ts-ignore
  const session = await unstable_getServerSession(
    // @ts-ignore
    context.req,
    // @ts-ignore
    context.res,
    // @ts-ignore
    authOptions,
  )

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const { api_key } = await prismaClient.user.findFirst()
  console.log({ api_key, session })

  return { props: { session, api_key } }
}

const APIKeyManager = props => {
  const [apiSecret, setApiSecret] = useState('')
  console.log({ props })

  return (
    <div>
      <h2>Generate an API Key</h2>
      {apiSecret}
      <button
        onClick={() => {
          fetch('/api/users/api_key', {
            method: 'put',
          })
        }}
      >
        Get Keys
      </button>
    </div>
  )
}

export default APIKeyManager
