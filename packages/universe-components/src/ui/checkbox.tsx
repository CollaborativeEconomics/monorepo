'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { cn } from '@/lib/shadCnUtil'
import { InputProps } from './input'
import { Label } from './label'

export interface CheckboxWithTextProps extends InputProps {
  text: string
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ id, className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    id={id}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-[2px] border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      className
    )}
    ref={ref}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn(
        'flex items-center justify-center text-black font-black bg-white outline-none'
      )}
    >
      <Check className="h-auto w-auto" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

const CheckboxWithText = React.forwardRef<
  HTMLInputElement,
  CheckboxWithTextProps
>(({ className, text, id, type, ...props }, ref) => {
  return (
    <div
      className={cn('flex flex-row align-middle gap-2', className)}
      {...props}
      ref={ref} 
    >
      <label className="flex flex-row gap-3">
        <Checkbox id={id} />
        <Label>{text}</Label>
      </label>
    </div>
  )
})
CheckboxWithText.displayName = 'checkbox-with-text'

export { Checkbox, CheckboxWithText }
