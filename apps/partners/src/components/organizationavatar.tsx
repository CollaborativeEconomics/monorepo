import React from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  type AvatarProps,
  AvatarTitle,
} from '~/components/ui/avatar';
import { cn } from '~/utils/shadCnUtil';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  organizationId?: string; // eventually required
  name?: string;
  image?: string;
  avatarProps?: AvatarProps;
}

const OrganizationAvatar = React.forwardRef<HTMLDivElement, Props>(
  ({ className, image, name, avatarProps, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-row items-center overflow-hidden gap-3',
          className,
        )}
        {...props}
      >
        <Avatar size={avatarProps?.size}>
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>OT</AvatarFallback>
        </Avatar>
        <AvatarTitle size={avatarProps?.size} title={name ?? 'no name'} />
      </div>
    );
  },
);
OrganizationAvatar.displayName = 'OrganizationAvatar';

export default OrganizationAvatar;
