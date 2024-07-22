import * as React from 'react';

import { cn } from '@/shadCnUtil';
import {
  AlertTriangle,
  CheckCircle,
  Hourglass,
  LucideIcon,
  RefreshCw,
} from 'lucide-react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  status: string;
}

interface BodyProps {
  className: string;
  Icon: LucideIcon;
  text: string;
  subtext: string;
  iconWrapperClassName?: string;
}

interface WrapperProps {
  className?: string;
  Icon: LucideIcon;
}

function ReceiptBodyBuilder(status: string): React.JSX.Element {
  switch (status) {
    case 'Claim':
      return (
        <ReceiptStatusBody
          className="bg-blue-500"
          Icon={CheckCircle}
          text="Claim your NFT"
          subtext="Thank you for your donation"
        />
      );
    case 'Pending':
      return (
        <ReceiptStatusBody
          className="bg-gray-400" //
          Icon={Hourglass}
          text="Not Yet Minted"
          subtext="Complete the donation to claim NFT"
        />
      );
    case 'Minting':
      return (
        <ReceiptStatusBody
          className="bg-blue-500"
          Icon={RefreshCw}
          text="Minting..."
          subtext="Transaction received"
          iconWrapperClassName="animate-spin"
        />
      );
    case 'Minted':
      return (
        <ReceiptStatusBody
          className="bg-green-400"
          Icon={CheckCircle}
          text="Minted!"
          subtext="NFT has been sent to your wallet"
        />
      );
    case 'Rejected':
      return (
        <ReceiptStatusBody
          className="bg-gray-400" //
          Icon={Hourglass}
          text="Not Claimed"
          subtext="Donor did not claim NFT"
        />
      );
    default:
      return (
        <ReceiptStatusBody
          className="bg-rose-400"
          Icon={AlertTriangle}
          text="Failed"
          subtext="Contact support"
        />
      );
  }
}

const ReceiptStatus = React.forwardRef<HTMLDivElement, Props>(
  ({ className, status, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex justify-center mt-2 border-dotted border-t-2 border-b-2 border-gray-300 p-4 w-full',
          className,
        )}
        {...props}
      >
        {ReceiptBodyBuilder(status)}
      </div>
    );
  },
);
ReceiptStatus.displayName = 'receipt-status';

const IconWrapper = React.forwardRef<HTMLDivElement, WrapperProps>(
  ({ className, Icon, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(className)} {...props}>
        <Icon size="40px" color="white" />
      </div>
    );
  },
);
IconWrapper.displayName = 'icon-wrapper';

const ReceiptStatusBody = React.forwardRef<HTMLDivElement, BodyProps>(
  ({ className, iconWrapperClassName, text, subtext, Icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-row items-center w-auto h-auto rounded-lg gap-3',
          className,
        )}
        {...props}
      >
        <div className="pl-4">
          <IconWrapper className={iconWrapperClassName} Icon={Icon} />
        </div>
        <div className="py-4 pr-6">
          <p className="text-xl font-semibold text-white">Status: {text}</p>
          <p className="font-base text-gray-200">{subtext}</p>
        </div>
      </div>
    );
  },
);
ReceiptStatusBody.displayName = 'receipt-status-body';

export { ReceiptStatus };
