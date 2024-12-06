'use client';
import React, { useCallback, useEffect, useState } from 'react';

export default function ScrollingHeaderBackground() {
  const [y, setY] = useState(0);

  const handleScroll = useCallback((e: Event) => {
    const scrollY = (e.currentTarget as Window).scrollY;
    setY(scrollY);
  }, []);

  useEffect(() => {
    setY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div
      className={`w-full h-full absolute inset-0 transition-all ${
        y > 0 ? 'bg-white dark:bg-accent shadow-md' : 'bg-transparent'
      }`}
    />
  );
}
