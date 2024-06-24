import React, { HTMLAttributes } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  href: string
  text: string
  icon?: string
  className?: string
  disabled?: boolean
}

const style = 'flex flex-col justify-center items-center border rounded-md text-xs p-4 text-center'

const ButtonWallet = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      href,
      text,
      icon,
      className,
      disabled,
      ...props
    }: ButtonProps,
    ref
  ) => (
    <button 
      disabled={disabled}
      className={`${style} ${className||''}`}
      {...{ ref }}
      {...props}
    >
      <Link href={href}>
        {icon ? (<Image src={'/wallets/'+icon} className="mb-2" width={64} height={64} alt="Chain icon" />) : null}
        {text}
      </Link>
    </button>
  )
);

ButtonWallet.displayName = 'ButtonWallet'

export default ButtonWallet
