"use client"

import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { type VariantProps, cva } from "class-variance-authority"
import * as React from "react"
import { cn } from "~/utils/shadCnUtil"

const avatarImageVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        default: "h-10 w-10",
        md: "h-16 w-16",
        lg: "h-48 w-48 mr-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
)

const avatarTitleVariants = cva("", {
  variants: {
    size: {
      default: "text-sm font-semibold line-clamp-2",
      md: "text-2xl font-medium line-clamp-2 pb-1 border-transparent",
      lg: "text-5xl text-white font-medium line-clamp-2 pb-1 border-b-[16px] border-transparent",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>,
    VariantProps<typeof avatarImageVariants>,
    VariantProps<typeof avatarTitleVariants> {
  className?: string
  title?: string
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarImageVariants({ size, className }))}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className,
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

const AvatarTitle = React.forwardRef<HTMLParagraphElement, AvatarProps>(
  ({ className, title, size, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(avatarTitleVariants({ size, className }))}
      {...props}
    >
      {title}
    </p>
  ),
)
AvatarTitle.displayName = "avatarTitle"

export { Avatar, AvatarImage, AvatarFallback, AvatarTitle }
export type { AvatarProps }
