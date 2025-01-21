import * as React from 'react';

import { Facebook, Globe, Twitter } from 'lucide-react';
import Link from 'next/link';
import { cn } from '~/shadCnUtil';

export interface OrgSocialsProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  twitterLabel: string;
  twitterAddress: string;
  facebookLabel: string;
  facebookAddress: string;
  websiteLabel: string;
  websiteAddress: string;
}

const OrgSocials = React.forwardRef<HTMLDivElement, OrgSocialsProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex flex-wrap', className)}>
        {props.websiteAddress && (
          <div className="flex gap-x-1">
            <Globe size={17} />{' '}
            <Link href={props.websiteAddress} className="text-sm font-semibold">
              {props.websiteLabel}
            </Link>
          </div>
        )}
        {props.twitterAddress && (
          <div className="flex gap-x-1">
            <Twitter size={17} />{' '}
            <Link href={props.twitterAddress} className="text-sm font-semibold">
              {props.twitterAddress}
            </Link>
          </div>
        )}
        {props.facebookAddress && (
          <div className="flex gap-x-1">
            <Facebook size={17} />{' '}
            <Link
              href={props.facebookAddress}
              className="text-sm font-semibold"
            >
              {props.facebookAddress}
            </Link>
          </div>
        )}
      </div>
    );
  },
);
OrgSocials.displayName = 'org-socials';

export { OrgSocials };
