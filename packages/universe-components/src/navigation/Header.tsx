'use client';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import React, { useEffect, useState, useCallback } from 'react';
import Logo from '~/home/Logo';
import NavigationMenu from './NavigationMenu';

function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    requestAnimationFrame(() => {
      setScrollY(window.scrollY);
    });
  }, []);

  useEffect(() => {
    setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return scrollY;
}

export default function Header() {
  const scrollY = useScrollPosition();
  const { resolvedTheme } = useTheme();

  return (
    <header
      className={`w-full py-10 pb-7.5 fixed top-0 z-50 transition-all ${
        scrollY > 0
          ? 'bg-white dark:bg-accent py-4 shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="flex justify-between container">
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
