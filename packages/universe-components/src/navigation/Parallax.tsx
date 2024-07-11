import { RefObject, useEffect, useRef, useState } from 'react'

interface ParallaxProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  speed?: number
}

const PARALLAX_SPEED = 0.1

const Parallax = (props: ParallaxProps) => {
  const parallaxRef = useRef(null)
  useParallax(parallaxRef, props.speed ?? PARALLAX_SPEED) // Adjust speed as needed

  return (
    <div {...props} ref={parallaxRef} className={`parallax ${props.className}`}>
      {props.children}
    </div>
  )
}

export const useParallax = (
  ref: RefObject<HTMLDivElement>,
  speed = PARALLAX_SPEED
) => {
  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const elementRect = ref.current.getBoundingClientRect()
        const elementCenter = elementRect.top + elementRect.height / 2
        const viewportCenter = window.innerHeight / 2

        // Calculate the difference between the element center and viewport center
        const centerDiff = elementCenter - viewportCenter

        // Adjust the background position
        // When centerDiff is 0 (element center is at viewport center), backgroundPositionY should be centered
        const backgroundPositionY = -centerDiff * speed
        ref.current.style.backgroundPositionY = backgroundPositionY + 'px'
      }
    }

    window.addEventListener('scroll', handleScroll)

    // Trigger an initial adjustment in case the element starts in view
    handleScroll()

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [ref, speed])
}

export default Parallax
