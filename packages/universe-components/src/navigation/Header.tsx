'use client';
import Link from 'next/link';
import React from 'react';
import Logo from '~/home/Logo';
import NavigationMenu from './NavigationMenu';
import ScrollingHeaderBackground from './ScrollingHeaderBackground';

export default function Header() {
  return (
    <header className="w-full py-10 pb-7.5 fixed top-0 z-50 relative">
      <ScrollingHeaderBackground />
      <div className="flex justify-between container relative">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex flex-row items-center">
          <NavigationMenu />
        </div>
      </div>
    </header>
  );
}
