import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "TEST",
  viewport: { initialScale: 1.0, width: 'device-width' }
}


function Linked({href, title}:{href:string, title:string}){
  return <Link href={href} className="block w-[400px] mt-4 px-4 py-2 border rounded">{title}</Link>
}

export default async function Home() {
  return (
    <>
      <div className="w-full top-0">
        <div className="container mt-48 mb-16 ml-6 md:ml-auto">
          <h1 className="mt-24 mb-4 text-4xl">TESTING MODULE</h1>
          <Linked title="Create User" href="tests" />
          <Linked title="Another test #1" href="tests" />
          <Linked title="Another test #2" href="tests" />
          <Linked title="Another test #3" href="tests" />
        </div>
      </div>
    </>
  );
}

