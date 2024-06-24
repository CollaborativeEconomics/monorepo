import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/shadCnUtil'
import { ReceiptStatus } from '@/types/receipt'

export interface ClaimButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  status: ReceiptStatus
}

const ClaimButton = React.forwardRef<HTMLDivElement, ClaimButtonProps>(
  ({ className, status, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex w-full justify-center pt-4', className)}
      {...props}
    >
      {createClaimButton(status)}
    </div>
  )
)
ClaimButton.displayName = 'claim-button'

function createClaimButton(status: ReceiptStatus): React.JSX.Element {
  let claimText: ReceiptStatus = ReceiptStatus.claim
  switch (status) {
    case ReceiptStatus.claim:
      claimText = ReceiptStatus.claim
      return (
        <button
          type="button"
          className="inline-flex rounded-md bg-blue-600 hover:bg-blue-500 px-3 py-2 text-sm font-semibold w-[200px]"
        >
          <p className="text-slate-200 text-center w-full">{claimText}</p>
        </button>
      )
    case ReceiptStatus.minted:
      claimText = ReceiptStatus.minted
      return (
        <button
          type="button"
          className="inline-flex rounded-md bg-blue-600 hover:bg-blue-500 px-3 py-2 text-sm font-semibold w-[200px]"
          disabled
        >
          <p className="text-white text-center w-full">{claimText}</p>
        </button>
      )
    default:
      claimText = ReceiptStatus.pending
      return (
        <button
          type="button"
          className="inline-flex rounded-md bg-gray-400 px-3 py-2 text-sm font-semibold w-[200px]"
          disabled
        >
          <p className="text-slate-200 text-center w-full">{claimText}</p>
        </button>
      )
  }
}

export { ClaimButton }
