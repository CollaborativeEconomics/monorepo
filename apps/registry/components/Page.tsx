import Head from 'next/head'
import { ReactChild } from 'react'

interface PageProps {
  title?: string;
  className?: string;
  children: ReactChild;
}

function Page({title, className, children}) {
  return <>
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <div className={`block ${className}`} >
      {children}
    </div>
  </>
}

export default Page