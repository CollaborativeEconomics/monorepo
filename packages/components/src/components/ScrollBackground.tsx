'use client';
import { useCallback, useEffect, useState } from 'react';

interface ScrollBackgroundProps {
  children: React.ReactNode;
}

export function ScrollBackground({ children }: ScrollBackgroundProps) {
  const [scrollY, setScrollY] = useState(0);

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

  const backgroundClass =
    scrollY > 0
      ? 'bg-white dark:bg-gradient-to-b py-4 shadow-md'
      : 'bg-transparent';

  console.log('scrollY', scrollY, backgroundClass);

  return (
    <div className={`w-full h-full transition-all ${backgroundClass}`}>
      {children}
    </div>
  );
}
