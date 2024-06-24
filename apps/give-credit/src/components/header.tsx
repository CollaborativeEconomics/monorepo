'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SessionProvider } from 'next-auth/react';
import { NavMenu } from './navigation-menu';
import { useTheme } from 'next-themes';
import Logo from './Logo';

export default function Header() {
  const [y, setY] = useState(0);

  function handleScroll(e: Event) {
    const scrollY = (e.currentTarget as Window).scrollY;
    setY(scrollY);
  }

  useEffect(() => {
    setY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const { resolvedTheme } = useTheme();

  return (
    <header
      className={`w-full py-10 pb-7.5 fixed top-0 z-50 transition-all ${
        y > 0 ? 'bg-white dark:bg-accent py-4 shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="flex justify-between container">
        <Link href="/">
          <Logo />
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
