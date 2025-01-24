"use client"
import { useTheme } from "next-themes"
import React, { useState, useEffect, useRef } from "react"
import { cn } from "~/shadCnUtil"

interface VideoSource {
  src: string
  type: "dark" | "light"
}

export default function VideoBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<VideoSource | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const darkVideoRef = useRef<HTMLVideoElement>(null)
  const lightVideoRef = useRef<HTMLVideoElement>(null)

  const videos: VideoSource[] = [
    { src: "/video/WatercolorEarthV1Inverse.mp4", type: "dark" },
    { src: "/video/WatercolorEarthV1.mp4", type: "light" },
  ]

  // Handle initial mount and video preloading
  useEffect(() => {
    setMounted(true)
    // Preload both videos
    for (const video of videos) {
      const preloadVideo = document.createElement("video")
      preloadVideo.src = video.src
      preloadVideo.load()
    }
  }, [])

  // Handle theme changes
  useEffect(() => {
    if (!mounted) return

    setIsLoading(true)
    const newVideo = videos.find((v) => v.type === theme) || videos[1]
    setCurrentVideo(newVideo)
  }, [theme, mounted])

  // Handle video loading states
  const handleVideoLoad = () => {
    setIsLoading(false)
  }

  const handleVideoError = (
    e: React.SyntheticEvent<HTMLVideoElement, Event>,
  ) => {
    console.error("Error loading video:", e)
    setIsLoading(false)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="absolute -z-10 top-0 left-0 right-0 h-[1000px] w-screen overflow-hidden">
      {videos.map((video) => (
        <video
          key={video.type}
          ref={video.type === "dark" ? darkVideoRef : lightVideoRef}
          src={video.src}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          className={cn(
            "absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000",
            isLoading
              ? "opacity-0"
              : currentVideo?.type === video.type
                ? "opacity-100"
                : "opacity-0",
          )}
        />
      ))}

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
