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

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-amber-600 via-orange-500 to-red-600">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-amber-400/20 via-transparent to-orange-600/20 animate-pulse"></div>
        <div className="absolute inset-0 video-text-shimmer"></div>
      </div>

      {/* Text with gradient background */}
      <div className="relative z-10 flex items-center justify-center min-h-[250px] sm:min-h-[350px] md:min-h-[450px] lg:min-h-[550px] xl:min-h-[650px] px-4 sm:px-6 md:px-8">
        <div className="text-center w-full max-w-7xl">
          <h1
            className={`${sizeClasses[textSize]} font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 select-none leading-tight tracking-tight break-words`}
            style={{
              backgroundSize: '200% 200%',
              animation: 'gradientShift 3s ease-in-out infinite'
            }}
          >
            {text}
          </h1>
        </div>
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
