import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'header' | 'section';
}

const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'medium',
  variant = 'section'
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'h-12 w-auto scale-150';
      case 'medium':
        return 'h-16 w-auto scale-200';
      case 'large':
        return 'h-20 w-auto scale-250';
      default:
        return 'h-16 w-auto scale-200';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'header':
        return 'hover:opacity-80 transition-opacity duration-300 origin-left';
      case 'section':
        return 'opacity-80 origin-center';
      default:
        return 'opacity-80 origin-center';
    }
  };

  const getTransformOrigin = () => {
    return variant === 'header' ? 'left center' : 'center';
  };

  return (
    <img
      src="/images/logoseven18.png"
      alt="Seven18BK Logo"
      className={`transform ${getSizeClasses()} ${getVariantClasses()} ${className}`}
      style={{
        transformOrigin: getTransformOrigin(),
        transform: `scale(${size === 'small' ? 1.5 : size === 'medium' ? 2 : 2.5})`
      }}
    />
  );
};

export default Logo;
