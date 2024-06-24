'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  InstructionImageProps,
  InstructionPaneSectionOverlay,
} from './InstructionPaneSection'

interface OverlayProps extends InstructionImageProps {
  className?: string
}

function OverlayHandler(props: OverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [opacity, setOpacity] = useState(0)
  //console.log('in overlay handler')

  // Intersection Observer to detect when overlay is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.addEventListener('scroll', handleScroll)
        } else {
          window.removeEventListener('scroll', handleScroll)
        }
      },
      { threshold: 0.1 }
    )

    if (overlayRef.current) {
      observer.observe(overlayRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [overlayRef])

  // Handle scroll and calculate progress
  const handleScroll = () => {
    const element = overlayRef.current
    if (element) {
      const windowHeight = window.innerHeight
      const rect = element.getBoundingClientRect()
      const elementVisible = rect.top - windowHeight < 0
      const scrollableDistance = windowHeight // 62% of the way down
      let newOpacity = 0

      if (elementVisible) {
        newOpacity = 1 - rect.top / scrollableDistance
        if (newOpacity > 1) {
          newOpacity = 2 - newOpacity
        }
        setOpacity(newOpacity)
        //console.log(opacity)
      }

      setOpacity(newOpacity)
    }
  }

  //console.log(opacity)
  return (
    <div ref={overlayRef} style={{ opacity }} className={props.className}>
      <InstructionPaneSectionOverlay className={props.sourceProperty} />
    </div>
  )
}

export { OverlayHandler }
