'use client'
import * as React from 'react'
import { cn } from '@/src/libs/shadCnUtil'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const NFTReceiptText = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        className={cn(
          'text-sm font-bold whitespace-nowrap text-gray-500 dark:text-white',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </p>
    )
  }
)
NFTReceiptText.displayName = 'NFT-receipt-text'

export { NFTReceiptText }
