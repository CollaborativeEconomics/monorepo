'use client';
import { useCallback, useEffect, useState } from 'react';

interface ScrollBackgroundProps {
  children: React.ReactNode;
}

export function ScrollBackground({ children }: ScrollBackgroundProps) {
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

  const backgroundClass =
    scrollY > 0 ? 'bg-white dark:bg-accent py-4 shadow-md' : 'bg-transparent';

  return <div className={`transition-all ${backgroundClass}`}>{children}</div>;
}
