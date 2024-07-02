//import React, { HTMLAttributes } from 'react'
import Link, { LinkProps } from 'next/link'

interface LinkButtonProps {
  text: string
  href: string
  className?: string
}

const LinkButton = ({
      text,
      href,
      className,
      ...props
    }: LinkProps & LinkButtonProps) => (
  <Link
    href={href}
    className={`mx-auto px-12 py-2 rounded-full uppercase flex flex-row justify-center bg-blue-700 ${className}`}
  >{text}</Link>
)

LinkButton.displayName = 'LinkButton'

export default LinkButton
