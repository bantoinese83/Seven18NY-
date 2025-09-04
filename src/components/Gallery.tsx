import React, { useState, useEffect, useRef } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useScroll } from '../contexts/ScrollContext';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import ImageWithSkeleton from './ImageWithSkeleton';

const galleryItems = [
  {
    title: 'Artisanal Cocktails',
    imageUrl: '/gallery/7-1.jpg',
  },
  {
    title: 'Gourmet Bites',
    imageUrl: '/gallery/7-2.jpg',
  },
  {
    title: 'Elegant Ambiance',
    imageUrl: '/gallery/7-3.jpg',
  },
  {
    title: 'Vibrant Nightlife',
    imageUrl: '/gallery/7-4.jpg',
  },
  {
    title: 'Signature Cocktails',
    imageUrl: '/gallery/7-5.jpg',
  },
  {
    title: 'Premium Atmosphere',
    imageUrl: '/gallery/7-6.jpg',
  },
  {
    title: 'Event Excellence',
    imageUrl: '/gallery/7-07.jpg',
  },
  {
    title: 'Brooklyn Nights',
    imageUrl: '/gallery/7-08.jpg',
  },
];

const Lightbox: React.FC<{
  items: typeof galleryItems,
  currentIndex: number,
  onClose: () => void,
  onNext: () => void,
  onPrev: () => void,
}> = ({ items, currentIndex, onClose, onNext, onPrev }) => {
  const [animationKey, setAnimationKey] = useState(0);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  useEffect(() => {
    // Increment key whenever the image index changes to re-trigger the animation
    setAnimationKey(prev => prev + 1);
  }, [currentIndex]);

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center animate-fade-in" onClick={onClose}>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition p-4 sm:p-3 z-[110] touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>

      <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
        <img 
          key={animationKey}
          src={items[currentIndex].imageUrl} 
          alt={items[currentIndex].title} 
          className="w-full h-auto object-contain max-h-[90vh] rounded-lg shadow-2xl animate-fade-in-sm"
          loading="eager"
        />
      </div>
      
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition p-4 sm:p-3 z-[110] touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition p-3 sm:p-2 z-[110] touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
};


const GalleryImage: React.FC<{ item: typeof galleryItems[0], onClick: () => void, index: number }> = ({ item, onClick, index }) => {
    return (
        <div onClick={onClick} className="group cursor-pointer active:scale-95 transition-transform duration-150 touch-manipulation">
            {/* Image Container - Mobile-First Responsive */}
            <div className="relative w-full aspect-square sm:aspect-[4/3] md:aspect-square overflow-hidden rounded-lg shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                <ImageWithSkeleton
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                {/* Overlay for better mobile touch interaction */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:hidden" />
            </div>

            {/* Title - Mobile Optimized */}
            <div className="mt-3 sm:mt-4 text-center px-2">
                <h3 className="text-sm sm:text-base md:text-lg font-medium text-white group-hover:text-brand-gold transition-colors duration-300 tracking-wide leading-tight">
                    {item.title}
                </h3>
            </div>
        </div>
    )
}

const Gallery: React.FC = () => {
  const [ref, isVisible] = useScrollAnimation<HTMLElement>();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => setLightboxIndex(prev => (prev! + 1) % galleryItems.length);
  const prevImage = () => setLightboxIndex(prev => (prev! - 1 + galleryItems.length) % galleryItems.length);

  // Keyboard navigation for lightbox
  useKeyboardNavigation({
    onEscape: closeLightbox,
    onArrowLeft: lightboxIndex !== null ? prevImage : undefined,
    onArrowRight: lightboxIndex !== null ? nextImage : undefined,
    enabled: lightboxIndex !== null
  });

  return (
    <>
      <section id="gallery" ref={ref} className="py-24 md:py-40 bg-black/0 overflow-hidden">
        <div className={`container mx-auto px-6 fade-in-section ${isVisible ? 'is-visible' : ''}`}>
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-medium text-white tracking-wide mb-4">
              A Glimpse of Seven18NY
            </h2>
            <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
              Explore the vibe and possibilities for your next event.
            </p>
          </div>

          {/* Gallery Grid - Mobile-First Responsive Design */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-12 max-w-7xl mx-auto px-2 sm:px-4">
              {galleryItems.map((item, index) => (
                <div
                  key={item.title}
                  className="transform transition-all duration-700 ease-out"
                  style={{
                    transitionDelay: `${index * 100}ms`,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)'
                  }}
                >
                  <GalleryImage item={item} onClick={() => openLightbox(index)} index={index} />
                </div>
              ))}
          </div>
        </div>
      </section>
      {lightboxIndex !== null && (
        <Lightbox
          items={galleryItems}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </>
  );
};

export default Gallery;