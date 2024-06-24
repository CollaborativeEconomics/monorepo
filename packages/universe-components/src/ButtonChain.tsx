import React, { HTMLAttributes } from 'react'
import Image from 'next/image'


interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  text: string
  icon?: string
  className?: string
  disabled?: boolean
  onClick?: ()=>void
}

const style = 'flex flex-col justify-center items-center border rounded-md text-xs p-4'

const ButtonChain = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      text,
      icon,
      onClick,
      className,
      disabled,
      ...props
    }: ButtonProps,
    ref
  ) => (
    <button
      disabled={disabled}
      className={`${style} ${className||''}`}
      {...{ onClick, ref }}
      {...props}
    >
      {icon ? (<Image src={'/chains/'+icon} className="mb-2" width={64} height={64} alt="Chain icon" />) : null}
      {text}
    </button>
  )
);

ButtonChain.displayName = 'ButtonChain'

export default ButtonChain
