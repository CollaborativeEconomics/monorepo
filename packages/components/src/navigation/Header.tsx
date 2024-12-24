import Link from 'next/link';
import React from 'react';
import { ScrollBackground } from '~/components/ScrollBackground';
import Logo from '~/home/Logo';
import NavigationMenu from './NavigationMenu';

export default function Header() {
  return (
    <ScrollBackground>
      <header className="w-full py-10 pb-7.5 fixed top-0 z-50 bg-gradient-to-b">
        <div className="flex justify-between container">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex flex-row items-center">
            <NavigationMenu />
          </div>
        </div>
      </header>
    </ScrollBackground>
  );
}
