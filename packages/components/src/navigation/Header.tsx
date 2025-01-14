import Link from "next/link"
import React from "react"
import { ScrollBackground } from "~/components/ScrollBackground"
import Logo from "~/home/Logo"
import NavigationMenu from "./NavigationMenu"

export default function Header() {
  return (
    <>
      <ScrollBackground>
        <header className="w-full py-4 fixed top-0 z-50 bg-gradient-to-b from-background/80 to-background/0 backdrop-blur-sm">
          <div className="flex justify-between items-center container mx-auto px-4">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
            <div className="flex flex-row items-center">
              <NavigationMenu />
            </div>
          </div>
        </header>
      </ScrollBackground>
      {/* Spacer div to prevent content from hiding under fixed header */}
      <div className="h-[72px]" />
    </>
  )
}
