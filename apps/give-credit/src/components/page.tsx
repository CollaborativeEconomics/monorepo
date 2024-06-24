import React, { PropsWithChildren } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

interface PageProps {
  toolbarTitle?: string
  noPadding?: boolean
  footer?: React.ElementType
  className?: string
}

export const PageWrapper = (props:any) => {
  const children = props?.children
  return (
    <div className="min-h-screen flex flex-col align-middle justify-center bg-slate-300">
      {children}
    </div>
  )
}

const Page = ({
  toolbarTitle,
  children,
  className
}: PropsWithChildren<PageProps>) => {
  return (
    <div>
      <Head>
        <title>{toolbarTitle||'Give Credit'}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Give Credit"
          className="h-20 w-auto mx-auto my-6"
          width={370}
          height={80}
          priority
        />
      </Link>
      <main className={`container max-w-3xl rounded-2xl px-4 lg:px-12 py-12  w-11/12 md:w-1/2 2xl:w-1/3 md:mt-20 bg-green-900 shadow-3xl backdrop-blur mx-auto  ${className}`} >
        {children}
      </main>
      <div
        className="fixed top-0 bottom-0 left-0 right-0 bg-cover -z-10 bg-center opacity-60"
        style={{ backgroundImage: 'url(/bg0.jpg)' }}
      />
      {/*<script defer src="/scripts/stellar-sdk.js"></script>*/}
      <script defer src="/scripts/common.js"></script>
    </div>
  )
}

export default Page