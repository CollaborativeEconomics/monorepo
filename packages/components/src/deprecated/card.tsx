import React, { type PropsWithChildren, type HTMLProps } from "react"

interface CardProps {
  className?: string
}

// @deprecated use ui/card
const Card = ({
  children,
  className,
  ...props
}: PropsWithChildren<CardProps> & HTMLProps<HTMLDivElement>) => (
  <div
    className={`rounded-xl flex self-center justify-center mb-4 text-center flex-col items-start bg-green-800 drop-shadow-lg ${className}`}
    {...props}
  >
    {children}
  </div>
)

export default Card
