"use client"
import { clsx } from "clsx"
import React, { useState } from "react"

interface FlipCardChildProps {
  onFlip?: () => void
}

interface FlipCardProps {
  front: React.ComponentType<FlipCardChildProps>
  back: React.ComponentType<FlipCardChildProps>
  className?: string
}

export function FlipCard({
  front: Front,
  back: Back,
  className,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className={clsx("relative block", className)}>
      <div className="relative [perspective:1000px]">
        <div
          className={clsx(
            "relative transition-transform duration-800",
            "[transform-style:preserve-3d]",
            isFlipped ? "[transform:rotateY(180deg)]" : "",
          )}
        >
          {/* Front */}
          <div className="relative [backface-visibility:hidden]">
            <Front onFlip={() => setIsFlipped(true)} />
          </div>

          {/* Back */}
          <div
            className={clsx(
              "absolute top-0 left-0 w-full h-full overflow-auto",
              "[backface-visibility:hidden]",
              "[transform:rotateY(180deg)]",
            )}
          >
            <Back onFlip={() => setIsFlipped(false)} />
          </div>
        </div>
      </div>
    </div>
  )
}
