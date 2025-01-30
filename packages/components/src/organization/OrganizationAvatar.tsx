import type { Organization } from "@cfce/database"
import Link from "next/link"
import React from "react"
import { cn } from "~/shadCnUtil"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  type AvatarProps,
  AvatarTitle,
} from "~/ui/avatar"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  organization: Organization
  avatarProps?: AvatarProps
}

const OrganizationAvatar = React.forwardRef<HTMLDivElement, Props>(
  ({ className, organization, avatarProps, ...props }, ref) => {
    console.log({ props })
    return (
      <Link href={`/organizations/${organization.id}`}>
        <div
          ref={ref}
          className={cn(
            "flex flex-row items-center overflow-hidden gap-3",
            className,
          )}
          {...props}
        >
          <Avatar size={avatarProps?.size}>
            {organization.image ? (
              <AvatarImage src={organization.image} alt={organization.name} />
            ) : (
              <AvatarFallback>OT</AvatarFallback>
            )}
          </Avatar>
          <AvatarTitle
            size={avatarProps?.size}
            title={organization.name ?? "no name"}
            className={className}
          />
        </div>
      </Link>
    )
  },
)
OrganizationAvatar.displayName = "OrganizationAvatar"

export default OrganizationAvatar
