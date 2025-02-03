import React from 'react';

interface ParallaxLayerProps {
  speed: number;
  blurMultiplier: number; // Added blurMultiplier to control the amount of blur
  children: React.ReactNode;
}

interface ParallaxLayerProps {
  speed: number;
  blurMultiplier: number;
  offset: number; // Added offset as a prop
  blur: number; // Added blur as a prop
  children: React.ReactNode;
}

const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  offset,
  blur,
  children,
}) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full"
      style={{
        transform: `translateY(${offset}px)`,
        filter: `blur(${blur}px)`,
      }}
    >
      <div className="w-full h-full flex justify-center items-center">
        {children}
      </div>
    </div>
  );
};

const TitleComponent = () => {
  return (
    <div className="text-white shadow-xl">
      <h1 className="text-7xl font-bold">Donate Carbon Credits</h1>
      <p className="text-3xl">
        Make tax-deductible donations of carbon credits to worthy non-profits
      </p>
    </div>
  );
};

export {TitleComponent}
export default ParallaxLayer;