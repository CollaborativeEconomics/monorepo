'use client';
import { useCallback, useEffect, useState } from 'react';

interface ScrollBackgroundProps {
  children: React.ReactNode;
}

const headerClass = 'backdrop-blur-lg bg-white/90 py-4 shadow-md';

export function ScrollBackground({ children }: ScrollBackgroundProps) {
  const [scrollY, setScrollY] = useState(0);
  const [backgroundClass, setBackgroundClass] = useState('');

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

  return (
    <div className={`w-full h-full transition-all ${backgroundClass}`}>
      {children}
    </div>
  );
}
