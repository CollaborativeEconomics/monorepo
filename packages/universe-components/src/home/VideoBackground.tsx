'use client'

import { useTheme } from 'next-themes'

export default function VideoBackground() {
  const { theme, ...stuff } = useTheme()
  //console.log({ theme, stuff })
  const darkVideoSource = '/video/WatercolorEarthV1Inverse.mp4'
  const lightVideoSource = '/video/WatercolorEarthV1.mp4'
  return (
    <video
      src={theme === 'dark' ? darkVideoSource : lightVideoSource}
      autoPlay={true}
      loop
      muted
      className="absolute -z-10 top-0 left-0 right-0 h-[1000px] w-screen object-cover"
    />
  )
}
