import Link from 'next/link';
import React from 'react';
import { ScrollBackground } from '~/components/ScrollBackground';
import Logo from '~/home/Logo';
import NavigationMenu from './NavigationMenu';

export default function Header() {
  return (
    <header className="w-full fixed top-0 z-50">
      <ScrollBackground>
        <div className="flex justify-between container py-10 pb-7.5">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex flex-row items-center">
            <NavigationMenu />
          </div>
        </div>
      </ScrollBackground>
    </header>
  );
}
