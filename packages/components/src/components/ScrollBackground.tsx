'use client';
import { useCallback, useEffect, useState } from 'react';

interface ScrollBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollBackground({
  children,
  className,
}: ScrollBackgroundProps) {
  const [scrollY, setScrollY] = useState(0);
  const [backgroundTransparent, setBackgroundTransparent] = useState(true);

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
      setBackgroundTransparent(false);
    } else {
      setBackgroundTransparent(true);
    }
  }, [scrollY]);

  return (
    <div
      className={`transition-all ${
        backgroundTransparent
          ? 'bg-transparent'
          : 'backdrop-blur-lg bg-white/70 dark:bg-background/70 shadow-md'
      } ${className}`}
    >
      {children}
    </div>
  );
}
