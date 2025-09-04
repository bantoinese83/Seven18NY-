import React from 'react'

interface VideoTextFallbackProps {
  text: string
  className?: string
  textSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl'
}

const VideoTextFallback: React.FC<VideoTextFallbackProps> = ({
  text,
  className = '',
  textSize = '8xl'
}) => {
  const sizeClasses = {
    sm: 'text-4xl',
    md: 'text-5xl',
    lg: 'text-6xl',
    xl: 'text-7xl',
    '2xl': 'text-8xl',
    '3xl': 'text-9xl',
    '4xl': 'text-[10rem]',
    '5xl': 'text-[12rem]',
    '6xl': 'text-[14rem]',
    '7xl': 'text-[16rem]',
    '8xl': 'text-[18rem]',
    '9xl': 'text-[20rem]'
  }

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-amber-600 via-orange-500 to-red-600">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-amber-400/20 via-transparent to-orange-600/20 animate-pulse"></div>
        <div className="absolute inset-0 video-text-shimmer"></div>
      </div>

      {/* Text with gradient background */}
      <div className="relative z-10 flex items-center justify-center min-h-[400px] md:min-h-[600px]">
        <h1
          className={`${sizeClasses[textSize]} font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 select-none leading-none tracking-tight`}
          style={{
            backgroundSize: '200% 200%',
            animation: 'gradientShift 3s ease-in-out infinite'
          }}
        >
          {text}
        </h1>
      </div>

      <style>{`
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  )
}

export default VideoTextFallback
