'use client'

import * as React from 'react'
import { cn } from '@/src/libs/shadCnUtil'
import { Button } from '../ui/button'

export interface ActionBarBoxProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface ActionBarButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ActionBarBox = React.forwardRef<HTMLDivElement, ActionBarBoxProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          'flex flex-col container py-8 gap-3 w-[90%] md:w-[45%] max-w-[700px] hover:bg-slate-500 duration-200 text-white bg-opacity-20 text-center items-center justify-center m-auto md:m-0',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
ActionBarBox.displayName = 'action-bar-box'

const ActionBarButton = React.forwardRef<
  HTMLButtonElement,
  ActionBarButtonProps
>(({ className, ...props }, ref) => {
  return (
    <Button
      className={cn('bg-white text-black text-md font-normal', className)}
      {...props}
    />
  )
})
ActionBarButton.displayName = 'action-bar-button'

export { ActionBarBox, ActionBarButton }
