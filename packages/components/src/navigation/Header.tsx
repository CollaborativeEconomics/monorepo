import Link from 'next/link';
import React from 'react';
import { ScrollBackground } from '~/components/ScrollBackground';
import Logo from '~/home/Logo';
import NavigationMenu from './NavigationMenu';

export default function Header() {
  return (
    <>
      <ScrollBackground className="w-full fixed top-0 z-50">
        <header className="flex justify-between items-center container mx-auto px-4">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
          <div className="flex flex-row items-center">
            <NavigationMenu />
          </div>
        </header>
      </ScrollBackground>
    </>
  );
}
