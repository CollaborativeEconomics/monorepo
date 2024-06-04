'use client'

import * as React from 'react'
import { signIn, signOut, useSession } from "next-auth/react"

import { cn } from '@/lib/shadCnUtil'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { DarkModeSwitcher } from './dark-mode-switcher'
import Link from 'next/link'
import Image from 'next/image'

export function NavMenu() {
  const SessionStatus = {
    AUTHENTICATED: 'authenticated',
    UNAUTHENTICATED: 'unauthenticated' // Add more statuses as needed
  };
  const { data: session, status } = useSession()
  //console.log('Header Session', session, status)
  const avatar  = session?.user?.image || '/media/nopic.png'
  const userurl = session?.userid ? '/profile/'+session?.userid : ''

  return (
    <>
      <div className="flex-row gap-3 items-center hidden md:flex">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Partners</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] xl:w-[500px] xl:grid-cols-[.75fr_1fr]">
                  <ListItem href="/docs/installation" title="Sign In">
                    Access the partner portal
                  </ListItem>
                  <ListItem
                    href="/docs"
                    title="Pricing"
                    className="bg-primary text-primary-foreground"
                  >
                    View our pricing plans
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              {status==SessionStatus.AUTHENTICATED
              ?
                <NavigationMenuLink className={navigationMenuTriggerStyle()} href={userurl}>
                  <Image src={avatar} width={40} height={40} alt="Avatar" layout="fixed" className="rounded-lg" />
                </NavigationMenuLink>
              :
                <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/signin">
                  Sign In
                </NavigationMenuLink>
              }
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <DarkModeSwitcher />
      </div>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <HamburgerMenuIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col justify-between">
            <div>
              <SheetHeader className="mb-3">
                <SheetTitle>Menu</SheetTitle>
                {/* <SheetDescription>Put some links here...</SheetDescription> */}
              </SheetHeader>
              <ul className="flex flex-col gap-3">
                <Link href="/docs/installation" title="Sign In">
                  Sign In
                </Link>
                <Link href="/docs" title="Pricing">
                  Pricing
                </Link>
              </ul>
            </div>
            <SheetFooter>
              <DarkModeSwitcher />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
