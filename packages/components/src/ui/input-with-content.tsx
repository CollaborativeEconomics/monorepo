"use client"
import React from "react"
import { cn } from "~/shadCnUtil"
import type { InputProps } from "./input"

export interface InputWithContentProps extends InputProps {
  text: string
}

const InputWithContent = React.forwardRef<
  HTMLInputElement,
  InputWithContentProps
>(({ className, id, type, text, ...props }, ref) => {
  return (
    <div className="flex flex-row text-lg w-full rounded-full bg-white ring-offset-background focus-within:ring-1 dark:bg-slate-500 border ring-slate-300 border-slate-300 dark:border-none overflow-visible">
      <input
        type={type}
        id={id}
        className={cn(
          "flex h-10 text-lg w-full rounded-full bg-white dark:bg-slate-500 px-4 py-2 border-0 focus:border-0 focus:outline-0 focus:ring-0",
          className,
        )}
        {...props}
      />
      <div className="my-auto pr-3 whitespace-nowrap text-slate-400">
        {text}
      </div>
    </div>
  )
})
InputWithContent.displayName = "input-with-content"

export { InputWithContent }
