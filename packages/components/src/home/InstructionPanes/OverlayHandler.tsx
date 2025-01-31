'use client';

import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import type { InstructionImageProps } from './InstructionPaneSectionImageBlend';

interface OverlayProps extends InstructionImageProps {
  className?: string;
}

function OverlayHandler(props: OverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(0);
  //console.log('in overlay handler')

  // Intersection Observer to detect when overlay is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          window.addEventListener('scroll', handleScroll);
        } else {
          window.removeEventListener('scroll', handleScroll);
        }
      },
      { threshold: 0.1 },
    );

    if (overlayRef.current) {
      observer.observe(overlayRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Handle scroll and calculate progress
  const handleScroll = () => {
    const element = overlayRef.current;
    if (element) {
      const windowHeight = window.innerHeight;
      const rect = element.getBoundingClientRect();
      const elementVisible = rect.top - windowHeight < 0;
      const scrollableDistance = windowHeight;
      let newOpacity = 0;

      if (elementVisible) {
        // Get the linear progress (0 to 1)
        let progress = 1 - rect.top / scrollableDistance;

        // Apply easing function - choose one of these:

        // 1. Quadratic ease (smoother start)
        progress = progress * progress;

        // 2. Cubic ease (even smoother start)
        // progress = progress * progress * progress;

        // 3. Sine ease (smooth S-curve)
        // progress = Math.sin((progress * Math.PI) / 2);

        // 4. Custom power ease (adjust power for different curves)
        // const power = 2.5; // adjust this number for different curves
        // progress = Math.pow(progress, power);

        newOpacity = progress;
        if (newOpacity > 1) {
          newOpacity = 2 - newOpacity;
        }
        setOpacity(newOpacity);
      }

      setOpacity(newOpacity);
    }
  };

  return (
    <div ref={overlayRef} style={{ opacity }} className={props.className}>
      <Image
        src={props.source}
        alt="Instruction Pane Section Overlay"
        fill
        className="object-cover object-top md:object-top-left"
      />
      <Image
        src="/home/ColorOverlay.png"
        alt="Instruction Pane Section Overlay"
        fill
        className="object-cover mix-blend-screen"
      />
    </div>
  );
}

export { OverlayHandler };
