import React from 'react'
import { InputProps } from './input'
import { cn } from '@/lib/shadCnUtil'

export interface InputWithContentProps extends InputProps {
  text: string
  divRef: any
}

const InputWithContent = React.forwardRef<
  HTMLInputElement,
  InputWithContentProps
>(({ className, id, type, text, divRef, ...props }, ref) => {
  return (
    <div className="flex flex-row h-10 text-lg w-full rounded-full border border-2 border-slate-300 bg-white ring-offset-background focus-within:border-blue-700 focus-within:ring-1">
      <input
        type={type}
        id={id}
        className={cn(
          'flex h-9 text-lg text-black dark:text-slate-800 w-full rounded-full bg-white px-2 py-2 border-0 focus:border-0 focus:outline-0 focus:ring-0',
          className
        )}
        {...props}
        ref={ref}
      />
      <div className="my-auto pr-3 whitespace-nowrap text-slate-400">
        {text}
      </div>
    </div>
  )
})
InputWithContent.displayName = 'input-with-content'

export { InputWithContent }
