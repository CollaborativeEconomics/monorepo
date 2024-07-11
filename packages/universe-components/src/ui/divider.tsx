import React, { HTMLProps } from 'react'

interface DividerProps {
  className?: string;
}

const Divider = ({
  className,
  ...props
}: DividerProps & HTMLProps<HTMLDivElement>) => (
  <div
    className={`border-dotted border-t border-slate-300 w-full h-1 ${className}`}
    {...props}
  />
)

export default Divider