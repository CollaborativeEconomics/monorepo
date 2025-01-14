'use client';
import { useCallback, useEffect, useState } from 'react';

interface ScrollBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const headerClass =
  'backdrop-blur-lg bg-white/90 dark:bg-background/90 py-4 shadow-md';

export function ScrollBackground({
  children,
  className,
}: ScrollBackgroundProps) {
  const [scrollY, setScrollY] = useState(0);
  const [backgroundClass, setBackgroundClass] = useState('bg-transparent');

  const handleScroll = useCallback(() => {
    const frameId = requestAnimationFrame(() => {
      setScrollY(window.scrollY);
    });
    return frameId;
  }, []);

  useEffect(() => {
    setScrollY(window.scrollY);
    let frameId: number;

    const scrollListener = () => {
      frameId = handleScroll();
    };

    window.addEventListener('scroll', scrollListener, { passive: true });

    return () => {
      window.removeEventListener('scroll', scrollListener);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    if (scrollY > 0) {
      setBackgroundClass(headerClass);
    } else {
      setBackgroundClass('bg-transparent');
    }
  }, [scrollY]);

  console.log({ backgroundClass });

  return (
    <div className={`transition-all ${backgroundClass} ${className}`}>
      {children}
    </div>
  );
}
