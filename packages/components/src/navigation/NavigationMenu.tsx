import { auth } from '@cfce/auth';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { cn } from '~/shadCnUtil';
import { Button } from '~/ui/button';
import DarkModeSwitcher from './DarkModeSwitcher';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '~/ui/navigation-menu';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/ui/sheet';

export default async function NavMenu() {
  const session = await auth();
  const status = session?.user ? 'authenticated' : 'unauthenticated';
  console.log('Header Session', session, status, session);
  const avatar = session?.user?.image || '/media/nopic.png';
  // @ts-ignore - module augmentation is hard
  const userurl = session?.user.id ? `/profile/${session?.user.id}` : '';

  return (
    <>
      <div className="flex-row gap-3 items-center hidden md:flex">
        <NavigationMenu>
          <NavigationMenuList>
            {/* <NavigationMenuItem>
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
            </NavigationMenuItem> */}
            <NavigationMenuItem>
              {status === 'authenticated' ? (
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle({ type: 'avatar' })}
                  href={userurl}
                >
                  <Image src={avatar} fill alt="Avatar" className="rounded" />
                </NavigationMenuLink>
              ) : (
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  href="/signin"
                >
                  Sign In
                </NavigationMenuLink>
              )}
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
  );
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
            className,
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
  );
});
ListItem.displayName = 'ListItem';
