import appConfig from "@cfce/app-config"
import Image from "next/image"
import React from "react"

const Logo = ({ className }: { className?: string }) => {
  const logoLight = `${appConfig.siteInfo.logo?.light ?? "/newui/logo.png"}`
  const logoDark = `${appConfig.siteInfo.logo?.dark ?? "/newui/logoWhite.png"}`

  return (
    <div className={`w-60 lg:w-80 h-16 my-4 relative ${className}`}>
      <Image
        src={logoLight}
        alt={`${appConfig.siteInfo.title} logo`}
        fill
        className="object-contain dark:hidden object-left"
      />
      <Image
        src={logoDark}
        alt={`${appConfig.siteInfo.title} logo`}
        fill
        className="object-contain hidden dark:block object-left"
      />
    </div>
  )
}

export default Logo
