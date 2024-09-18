import { ReceiptStatus } from '@cfce/types';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../shadCnUtil';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export interface ClaimButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  status: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

const ClaimButton = React.forwardRef<HTMLDivElement, ClaimButtonProps>(
  ({ className, status, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex w-full justify-center pt-4', className)}
      {...props}
    >
      {createClaimButton(status)}
    </div>
  ),
);
ClaimButton.displayName = 'claim-button';

function createClaimButton(status: string): React.JSX.Element {
  //'minted' value should instead refer to enum type/property
  let claimText = 'Claim';
  switch (status) {
    case ReceiptStatus.claim:
      claimText = 'Claim';
      return (
        <button
          type="button"
          className="inline-flex rounded-md bg-blue-600 hover:bg-blue-500 px-3 py-2 text-sm font-semibold w-[200px]"
        >
          <p className="text-slate-200 text-center w-full">{claimText}</p>
        </button>
      );
    case ReceiptStatus.minting:
      claimText = 'Minting';
      return (
        <button
          type="button"
          className="inline-flex rounded-md bg-blue-600 hover:bg-blue-500 px-3 py-2 text-sm font-semibold w-[200px] disabled:pointer-events-none disabled:opacity-50"
          disabled={true}
        >
          <p className="text-white text-center w-full">{claimText}</p>
        </button>
      );
    case ReceiptStatus.minted:
      claimText = 'Minted';
      return (
        <button
          type="button"
          className="inline-flex rounded-md bg-blue-600 hover:bg-blue-500 px-3 py-2 text-sm font-semibold w-[200px] disabled:pointer-events-none disabled:opacity-50"
          disabled={true}
        >
          <p className="text-white text-center w-full">{claimText}</p>
        </button>
      );
    default:
      claimText = 'Pending';
      return (
        <button
          type="button"
          className="inline-flex rounded-md bg-gray-400 px-3 py-2 text-sm font-semibold w-[200px] disabled:pointer-events-none disabled:opacity-50"
          disabled={true}
        >
          <p className="text-slate-200 text-center w-full">{claimText}</p>
        </button>
      );
  }
}

export { Button, ClaimButton, buttonVariants };
