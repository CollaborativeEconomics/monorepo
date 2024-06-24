import React, { HTMLProps, ReactChild } from 'react'

interface CardProps {
  children: ReactChild;
  className?: string;
}

const Card = ({
  children,
  className,
  ...props
}: CardProps & HTMLProps<HTMLDivElement>) => (
  <div
    className={`rounded-xl flex self-center justify-center mb-4 text-center flex-col items-start bg-green-800 drop-shadow-lg ${className}`}
    {...props}
  >
    {children}
  </div>
)

export default Card
