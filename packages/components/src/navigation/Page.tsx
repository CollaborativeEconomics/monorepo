import appConfig from "@cfce/app-config"
import Image from "next/image"
import Link from "next/link"
import React, { type PropsWithChildren } from "react"

interface PageProps {
  noPadding?: boolean
  footer?: React.ElementType
  className?: string
}

export const PageWrapper = (props: PropsWithChildren) => {
  const children = props?.children
  return (
    <div className="min-h-screen flex flex-col align-middle justify-center bg-slate-300">
      {children}
    </div>
  )
}

const Page = ({ children, className }: PropsWithChildren<PageProps>) => {
  return (
    <div>
      <Link href="/">
        <Image
          src="/logo.png"
          alt={appConfig.siteInfo.title}
          className="h-20 w-auto mx-auto my-6"
          width={370}
          height={80}
          priority
        />
      </Link>
      <main
        className={`container max-w-3xl rounded-2xl px-4 lg:px-12 py-12  w-11/12 md:w-1/2 2xl:w-1/3 md:mt-40 bg-green-900 shadow-3xl backdrop-blur mx-auto  ${className}`}
      >
        {children}
      </main>
      <div
        className="fixed top-0 bottom-0 left-0 right-0 bg-cover -z-10 bg-center opacity-60"
        style={{ backgroundImage: "url(/bg0.jpg)" }}
      />
    </div>
  )
}

export default Page
