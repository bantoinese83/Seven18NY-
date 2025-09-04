import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'gold' | 'white' | 'gray';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'gold', 
  text,
  className = '' 
}) => {
  const sizeValues = {
    sm: 16,
    md: 32,
    lg: 48
  };

  const colorClasses = {
    gold: 'text-brand-gold',
    white: 'text-white',
    gray: 'text-gray-400'
  };

  const skeletonColors = {
    gold: { baseColor: '#D4AF37', highlightColor: '#F4D03F' },
    white: { baseColor: '#ffffff', highlightColor: '#f3f4f6' },
    gray: { baseColor: '#6b7280', highlightColor: '#9ca3af' }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Skeleton
        circle
        height={sizeValues[size]}
        width={sizeValues[size]}
        baseColor={skeletonColors[color].baseColor}
        highlightColor={skeletonColors[color].highlightColor}
        className="opacity-50"
      />
      {text && (
        <p className={`mt-2 text-sm ${colorClasses[color]}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
