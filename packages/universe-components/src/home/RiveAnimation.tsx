import React, { useRef, useState } from 'react'
import { Rive, useRive, useStateMachineInput } from '@rive-app/react-canvas'
import { useEffect } from 'react'
import { useTheme } from 'next-themes'

export default function RiveAnimation({ number }: { number: 1 | 2 | 3 }) {
  const { theme } = useTheme()
  const riveRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const { RiveComponent, rive } = useRive({
    src: `/home/number${number}V3.riv`,
    autoplay: true,
    stateMachines: 'State Machine 1',
    artboard: 'New Artboard',
  })
  const progressInput = useStateMachineInput(
    rive,
    'State Machine 1',
    'Progress',
    0
  )
  const darkModeInput = useStateMachineInput(
    rive,
    'State Machine 1',
    'Dark Mode',
    theme !== 'dark'
  )

  // Intersection Observer to detect when Rive component is visible
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

    if (riveRef.current) {
      observer.observe(riveRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [riveRef])

  // Handle scroll and calculate progress
  const handleScroll = () => {
    const element = riveRef.current
    if (element) {
      const windowHeight = window.innerHeight
      const rect = element.getBoundingClientRect()
      const elementVisible = rect.top - windowHeight < 0
      const scrollableDistance = windowHeight // 62% of the way down
      let newProgress = 0

      if (elementVisible) {
        newProgress = Math.max(
          0,
          Math.min(100, (1 - rect.top / scrollableDistance) * 100)
        )
      }

      setProgress(newProgress)
      if (progressInput) {
        progressInput.value = newProgress
      }
    }
  }

  // Update Rive inputs based on scroll position and dark mode
  useEffect(() => {
    if (progressInput) {
      progressInput.value = progress // Assuming scrollPosition is between 0 and 100
    }
    if (darkModeInput) {
      darkModeInput.value = theme !== 'dark'
    }
  }, [progress, theme, progressInput, darkModeInput])

  return (
    <div ref={riveRef}>
      <RiveComponent className="w-32 h-32 my-8 md:my-0" />
    </div>
  )
}
