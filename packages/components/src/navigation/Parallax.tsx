'use client';
import React, { type RefObject, useEffect, useRef } from 'react';

interface ParallaxProps extends React.ComponentProps<'div'> {
  speed?: number;
}

// Default to 20% extra height (120% total)
const EXTRA_HEIGHT_PERCENT = 20;
const DEFAULT_SPEED = 0.5;

interface ParallaxStyle {
  height: string;
  top: string;
  transform: string;
}

export const useParallax = (
  containerRef: RefObject<HTMLDivElement | null>,
  speed = DEFAULT_SPEED,
): ParallaxStyle => {
  const [style, setStyle] = React.useState<ParallaxStyle>({
    height: '100%',
    top: '0',
    transform: 'translateY(0px)',
  });

  useEffect(() => {
    const extraHeightPercent = EXTRA_HEIGHT_PERCENT * speed;
    const totalHeightPercent = 100 + extraHeightPercent;
    const topOffsetPercent = -extraHeightPercent / 2;

    const handleScroll = () => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerCenter = containerRect.top + containerRect.height / 2;
        const viewportCenter = window.innerHeight / 2;

        const centerDiff = containerCenter - viewportCenter;
        const maxTravel = (containerRect.height * extraHeightPercent) / 100;
        const progress = Math.max(
          -1,
          Math.min(1, centerDiff / (window.innerHeight / 2)),
        );
        const translateY = -(progress * (maxTravel / 2));

        setStyle({
          height: `${totalHeightPercent}%`,
          top: `${topOffsetPercent}%`,
          transform: `translateY(${translateY}px)`,
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, speed]);

  return style;
};

const Parallax = ({
  speed = DEFAULT_SPEED,
  children,
  ...props
}: ParallaxProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const style = useParallax(containerRef, speed);

  return (
    <div
      {...props}
      ref={containerRef}
      className={`relative overflow-hidden ${props.className ?? ''}`}
    >
      <div className="absolute inset-0 w-full" style={style}>
        {children}
      </div>
    </div>
  );
};

export default Parallax;
