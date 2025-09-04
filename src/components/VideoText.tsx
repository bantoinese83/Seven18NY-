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
      // Enhanced mobile video play handling
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Video play failed:', error)
          // Fallback: try to play with user interaction
          if (error.name === 'NotAllowedError') {
            // Video autoplay was prevented, this is normal on mobile
            console.log('Autoplay prevented, video will play on user interaction')
          }
        })
      }
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
    sm: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
    md: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
    lg: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
    xl: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
    '2xl': 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl',
    '3xl': 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl',
    '4xl': 'text-7xl sm:text-8xl md:text-9xl lg:text-[10rem]',
    '5xl': 'text-8xl sm:text-9xl md:text-[10rem] lg:text-[12rem]',
    '6xl': 'text-9xl sm:text-[10rem] md:text-[12rem] lg:text-[14rem]',
    '7xl': 'text-[10rem] sm:text-[12rem] md:text-[14rem] lg:text-[16rem]',
    '8xl': 'text-[12rem] sm:text-[14rem] md:text-[16rem] lg:text-[18rem]',
    '9xl': 'text-[14rem] sm:text-[16rem] md:text-[18rem] lg:text-[20rem]'
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

  const handleVideoClick = () => {
    const video = videoRef.current
    if (video) {
      if (video.paused) {
        video.play().catch(console.error)
      } else {
        video.pause()
      }
    }
  }

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover cursor-pointer"
          muted
          loop
          playsInline
          preload="metadata"
          poster={fallbackImage}
          onError={() => setIsVideoError(true)}
          onLoadedData={() => setIsVideoLoaded(true)}
          onClick={handleVideoClick}
          webkit-playsinline="true"
          x5-playsinline="true"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="true"
          x5-video-orientation="portraint"
        >
          <source src={videoSrc} type="video/mp4" />
          <source src={videoSrc} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Text Overlay with Better Mobile Responsiveness */}
      <div className="relative z-10 flex items-center justify-center min-h-[250px] sm:min-h-[350px] md:min-h-[450px] lg:min-h-[550px] xl:min-h-[650px] px-4 sm:px-6 md:px-8">
        <div className="text-center w-full max-w-7xl">
          {/* Main Text with Gradient Background */}
          <h1
            className={`${sizeClasses[textSize]} font-black select-none leading-tight tracking-tight break-words`}
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
            <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-400 max-w-md mx-auto px-4">
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
