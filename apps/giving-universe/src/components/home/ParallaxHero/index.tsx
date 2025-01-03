"use client"
import Image from "next/image"
import React, { useState, useEffect } from "react"
import ParallaxLayer, { TitleComponent } from "./Layers"

const layers = [
  { id: "layer-1", src: "/home/Hero/Layer5.jpg" },
  { id: "layer-2", src: "/home/Hero/Layer4.png" },
  { id: "layer-3", src: "/home/Hero/Layer3.png" },
  { id: "layer-4", src: TitleComponent },
  { id: "layer-5", src: "/home/Hero/Layer2.png" },
  { id: "layer-6", src: "/home/Hero/Layer1.png" },
]

const ParallaxHero: React.FC = () => {
  const [scrollOffset, setScrollOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollOffset(window.pageYOffset)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {layers.map((layer, index) => {
        const initialOffset = index * 0.05 * window.outerHeight
        const speed = -index * 0.05
        const blurMultiplier = index * 0.001
        const offset = scrollOffset * speed + initialOffset
        const blur = Math.min(10, Math.abs(offset) * blurMultiplier)

        return (
          <ParallaxLayer
            key={layer.id}
            speed={speed}
            blurMultiplier={blurMultiplier}
            offset={offset}
            blur={blur}
          >
            {typeof layer.src === "function" ? (
              <layer.src />
            ) : (
              <Image
                src={layer.src}
                layout="fill"
                objectFit="cover"
                alt="jungle background"
              />
            )}
          </ParallaxLayer>
        )
      })}
    </div>
  )
}

export default ParallaxHero
