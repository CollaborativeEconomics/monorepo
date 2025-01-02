import type { Metadata, Viewport } from "next"
import type { PropsWithChildren } from "react"

interface PageProps {
  title?: string
  className?: string
}

export const metadata: Metadata = {
  title: "Give Credit",
}

export const viewport: Viewport = { initialScale: 1.0, width: "device-width" }

function Page({ title, className, children }: PropsWithChildren<PageProps>) {
  return (
    <>
      <div className={`block ${className}`}>{children}</div>
    </>
  )
}

export default Page
