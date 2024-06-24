'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { SessionProvider } from "next-auth/react";
import { NavMenu } from './navigation-menu';

export default function Header() {
  const [y, setY] = React.useState(0);
  const handleScroll = (e: Event) => {
    const scrollY = (e.currentTarget as Window).scrollY;
    setY(scrollY);
  };

  React.useEffect(() => {
    setY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`w-full py-10 pb-7.5 fixed top-0 z-50 transition-all ${
        y > 0 ? 'bg-white dark:bg-accent py-4 shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="flex justify-between container">
        <Link href="/">
          <Image
            src="/GivingUniverseLogoV1.svg"
            alt="Giving Universe"
            className="dark:invert"
            width={300}
            height={60}
            priority
          />
        </Link>
        <div className="flex flex-row items-center">
          <SessionProvider>
            <NavMenu />
          </SessionProvider>
        </div>
      </div>
    </header>
  );
}
