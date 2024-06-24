import React, { HTMLProps } from 'react'

interface IconProps {
  icon: string;
  className?: string;
}

const Icon = ({ icon, className, ...props }: IconProps & HTMLProps<HTMLSpanElement>) => (
  <span className={`material-icons ${className}`} {...props}>
    {icon}
  </span>
)

export default Icon
