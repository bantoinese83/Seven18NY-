import React, { useRef, useEffect, useState } from 'react'
import VideoTextFallback from './VideoTextFallback'

interface VideoTextProps {
  text: string
  videoSrc: string
  className?: string
  textSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl'
  fallbackImage?: string
}

const VideoText: React.FC<VideoTextProps> = ({
  text,
  videoSrc,
  className = '',
  textSize = '8xl',
  fallbackImage
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isVideoError, setIsVideoError] = useState(false)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) {
      return
    }

    const handleLoadedData = () => {
      setIsVideoLoaded(true)
    }

    const handleError = () => {
      setIsVideoError(true)
    }

    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('error', handleError)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) {
      return
    }

    if (isIntersecting && isVideoLoaded) {
      video.play().catch(console.error)
    } else {
      video.pause()
    }
  }, [isIntersecting, isVideoLoaded])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    const video = videoRef.current
    if (video) {
      observer.observe(video)
    }

    return () => {
      if (video) {
        observer.unobserve(video)
      }
    }
  }, [])

  const sizeClasses = {
    sm: 'text-2xl sm:text-4xl',
    md: 'text-3xl sm:text-5xl',
    lg: 'text-4xl sm:text-6xl',
    xl: 'text-5xl sm:text-7xl',
    '2xl': 'text-6xl sm:text-8xl',
    '3xl': 'text-7xl sm:text-9xl',
    '4xl': 'text-8xl sm:text-[10rem]',
    '5xl': 'text-9xl sm:text-[12rem]',
    '6xl': 'text-[10rem] sm:text-[14rem]',
    '7xl': 'text-[12rem] sm:text-[16rem]',
    '8xl': 'text-[14rem] sm:text-[18rem]',
    '9xl': 'text-[16rem] sm:text-[20rem]'
  }

  // If video fails to load or doesn't exist, use fallback component
  if (isVideoError || !videoSrc) {
    return (
      <VideoTextFallback 
        text={text} 
        className={className} 
        textSize={textSize} 
      />
    )
  }

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
          poster={fallbackImage}
          onError={() => setIsVideoError(true)}
          onLoadedData={() => setIsVideoLoaded(true)}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>

      {/* Text Overlay with Better Vercel Compatibility */}
      <div className="relative z-10 flex items-center justify-center min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] px-4">
        <div className="text-center">
          {/* Main Text with Gradient Background */}
          <h1
            className={`${sizeClasses[textSize]} font-black select-none leading-none tracking-tight`}
            style={{
              background: isVideoLoaded && !isVideoError
                ? 'linear-gradient(45deg, rgba(251, 191, 36, 0.9), rgba(245, 158, 11, 0.9), rgba(217, 119, 6, 0.9))'
                : fallbackImage
                  ? `linear-gradient(45deg, rgba(251, 191, 36, 0.9), rgba(245, 158, 11, 0.9), rgba(217, 119, 6, 0.9))`
                  : 'linear-gradient(45deg, #fbbf24, #f59e0b, #d97706)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: isVideoLoaded && !isVideoError
                ? '0 0 20px rgba(251, 191, 36, 0.5), 0 0 40px rgba(251, 191, 36, 0.3)'
                : 'none',
              filter: isVideoLoaded && !isVideoError ? 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.3))' : 'none'
            }}
          >
            {text}
          </h1>

          {/* Subtitle for better context */}
          {(isVideoError || !isVideoLoaded) && (
            <p className="mt-4 text-lg text-gray-400 max-w-md mx-auto">
              Loading video content...
            </p>
          )}
        </div>
      </div>

      {/* Fallback for when video fails */}
      {isVideoError && fallbackImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${fallbackImage})` }}
        />
      )}
    </div>
  )
}

export default VideoText
