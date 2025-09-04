import React from 'react';
import Logo from './Logo';

const Seven18Section: React.FC = () => {
  return (
    <section className="py-16 bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-4 min-h-[60vh] sm:min-h-[80vh] flex items-center">
          {/* Main brand text - Mobile Responsive */}
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
            <Logo size="large" variant="section" />
          </div>

          {/* Responsive spacing container */}
          <div className="w-full max-w-4xl mx-auto mt-4 sm:mt-6 md:mt-8">
            {/* Subtitle - Mobile Optimized */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed px-4 sm:px-6 md:px-8">
              Brooklyn's premier bar & lounge with venue rental.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-brand-green/10 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

export default Seven18Section;
