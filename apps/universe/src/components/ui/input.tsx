'use client'

import * as React from 'react'

import { cn } from '@/lib/shadCnUtil'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, id, type, ...props }, ref) => {
    return (
      <input
        type={type}
        id={id}
        className={cn(
          'flex h-10 text-lg text-black dark:text-slate-800 w-full rounded-full border border-input border-2 border-slate-300 bg-white px-3 py-2 ring-offset-background',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
