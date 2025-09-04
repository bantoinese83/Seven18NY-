import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Hero Logo Fallback Component
  const HeroLogoFallback: React.FC = () => (
  <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-30">
    <div className="text-center">
      <img
        src="/images/logoseven18.png"
        alt="Seven18BK Logo"
        className="w-48 h-48 mx-auto mb-4 opacity-60"
      />
      <p className="text-xl text-gray-300">Welcome to Seven18BK</p>
      <p className="text-gray-500">Brooklyn's Premier Venue</p>
    </div>
  </div>
);

// Add styles to head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .hero,
    .content {
      width: 100%;
      height: 100svh;
      overflow: hidden;
      /* Enhanced mobile support */
      min-height: 100vh;
      min-height: 100dvh;
    }

    .images {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .images img {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      z-index: var(--index, 1);
      will-change: mask-image;
      /* Better mobile performance */
      transform: translateZ(0);
      backface-visibility: hidden;
    }

    .mask-img {
      mask-image: linear-gradient(90deg, black 70%, transparent 70%);
      -webkit-mask-image: linear-gradient(90deg, black 70%, transparent 70%);
      will-change: mask-image;
    }

    .content {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      z-index: 20;
      color: #fff;
      font-size: 20px;
      /* Safe area support for mobile devices */
      padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
    }

    .content .top,
    .content .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: clamp(10px, 5vw, 30px);
      /* Mobile-first responsive padding */
      padding-left: max(10px, 5vw);
      padding-right: max(10px, 5vw);
    }

    .content .center {
      width: 100%;
      max-width: clamp(300px, 90vw, 1200px);
      margin: auto;
      display: flex;
      flex-direction: column;
      gap: clamp(20px, 10vh, 100px);
      /* Better mobile spacing */
      justify-content: center;
      text-align: center;
      padding: 0 clamp(10px, 5vw, 40px);
    }

    .content .center .title-center {
      text-align: center;
      font-size: clamp(2rem, 12vw, 8rem);
      /* Better mobile typography */
      line-height: 1.1;
      letter-spacing: -0.02em;
    }

    .content .center .title-bottom {
      text-align: center;
      /* Center on mobile, right-align on larger screens */
      margin-left: auto;
      margin-right: auto;
      max-width: 400px;
    }

    .content .center .top-title {
      text-align: center;
      opacity: 0.9;
    }

    /* Enhanced animations and micro-interactions */
    .hero-content-enter {
      animation: heroContentEnter 1.2s ease-out forwards;
    }

    @keyframes heroContentEnter {
      0% {
        opacity: 0;
        transform: translateY(40px) scale(0.95);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* Mobile-specific optimizations */
    @media (max-width: 768px) {
      .content .top,
      .content .bottom {
        flex-direction: column;
        gap: 8px;
        text-align: center;
      }

      .content .center .title-center {
        font-size: clamp(2.5rem, 15vw, 5rem);
      }

      .content .center {
        gap: clamp(15px, 8vh, 40px);
      }
    }

    /* Touch device optimizations */
    @media (hover: none) and (pointer: coarse) {
      .images img {
        /* Disable expensive transforms on touch devices */
        transform: none;
      }

      .content * {
        /* Reduce motion for better performance on touch devices */
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
    }
  `;
  document.head.appendChild(style);
}

gsap.registerPlugin(ScrollTrigger);

// Text content for each image overlay
const imageTextOverlays = [
  {
    id: 'overlay-0',
    title: 'Welcome to Seven18BK',
    subtitle: 'Brooklyn\'s Premier Bar & Lounge',
    description: 'Where cocktails meet celebrations'
  },
  {
    id: 'overlay-1',
    title: 'Signature Cocktails',
    subtitle: 'Crafted with Passion',
    description: 'Experience our expertly mixed drinks'
  },
  {
    id: 'overlay-2',
    title: 'Private Events',
    subtitle: 'Perfect Venue',
    description: 'Host unforgettable gatherings'
  },
  {
    id: 'overlay-3',
    title: 'Live Music',
    subtitle: 'Weekly Performances',
    description: 'Enjoy live entertainment every week'
  },
  {
    id: 'overlay-4',
    title: 'Venue Rental',
    subtitle: 'Your Special Occasion',
    description: 'Book our space for your celebration'
  }
];

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const [mainImageError, setMainImageError] = React.useState(false);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const springY = useSpring(y, { stiffness: 400, damping: 40 });
  const springOpacity = useSpring(opacity, { stiffness: 400, damping: 40 });

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (!heroRef.current) return;

    const images = document.querySelectorAll('.images img');
    const content = document.querySelector('.content');
    const overlays = imageTextOverlays.map(overlay => document.getElementById(overlay.id));

    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: `+=${window.innerHeight * 4}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const {progress} = self;

        const totalImages = gsap.utils.toArray('.images .mask-img').length;
        const segmentSize = 1 / totalImages;

        // Handle image masking
        gsap.utils.toArray('.images .mask-img').forEach((img, index) => {
          const imageStart = index * segmentSize;
          const imageEnd = (index + 1) * segmentSize;

          let imageProgress = 0;

          if (progress >= imageStart && progress <= imageEnd) {
            imageProgress = (progress - imageStart) / segmentSize;
          } else if (progress > imageEnd) {
            imageProgress = 1;
          }

          const leftgradie = 50 - (imageProgress * 50);
          const rightgradie = 50 + (imageProgress * 50);
          const deg = 90 + (imageProgress * 40);
          gsap.set(img as HTMLElement, {
            maskImage: `linear-gradient(${deg}deg, black ${leftgradie}%, transparent ${leftgradie}%, transparent ${rightgradie}%, black ${rightgradie}%)`
          });
        });

        // Handle text overlay transitions
        overlays.forEach((overlay, index) => {
          if (!overlay) {
            return;
          }

          const overlayStart = index * segmentSize;
          const overlayEnd = (index + 1) * segmentSize;
          const fadeDuration = segmentSize * 0.3; // 30% of segment for fade

          let opacity = 0;

          if (progress >= overlayStart && progress < overlayStart + fadeDuration) {
            // Fade in
            opacity = (progress - overlayStart) / fadeDuration;
          } else if (progress >= overlayStart + fadeDuration && progress <= overlayEnd - fadeDuration) {
            // Full opacity
            opacity = 1;
          } else if (progress > overlayEnd - fadeDuration && progress <= overlayEnd) {
            // Fade out
            opacity = 1 - ((progress - (overlayEnd - fadeDuration)) / fadeDuration);
          }

          gsap.set(overlay, { opacity: Math.max(0, Math.min(1, opacity)) });
        });

        // Hide main content during scroll (after first segment)
        if (content) {
          const mainContentOpacity = progress < segmentSize ? 1 : 0;
          gsap.set(content, { opacity: mainContentOpacity });
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={heroRef} id="home" className="hero relative h-screen overflow-hidden">
      {/* Fallback Logo when main image fails */}
      {mainImageError && <HeroLogoFallback />}

      {/* Subtle Scrim Overlay for Better Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20 z-10 pointer-events-none"></div>

      {/* Stacked Images */}
      <div className="images">
        <img
          src="/images/IMG_3507.jpeg"
          alt="Seven18BK Venue"
          style={{ '--index': 1 } as React.CSSProperties}
          onError={() => setMainImageError(true)}
        />
        <img
          src="/images/IMG_3505.jpeg"
          alt="Seven18BK Venue"
          className="mask-img"
          style={{ '--index': 5 } as React.CSSProperties}
        />
        <img
          src="/images/IMG_3510.jpeg"
          alt="Seven18BK Venue"
          className="mask-img"
          style={{ '--index': 4 } as React.CSSProperties}
        />
        <img
          src="/images/IMG_3511.jpeg"
          alt="Seven18BK Venue"
          className="mask-img"
          style={{ '--index': 3 } as React.CSSProperties}
        />
        <img
          src="/images/IMG_3512.jpeg"
          alt="Seven18BK Venue"
          className="mask-img"
          style={{ '--index': 2 } as React.CSSProperties}
        />
      </div>

      {/* Text Overlays for Each Image */}
      {imageTextOverlays.map((overlay, index) => (
        <motion.div
          key={overlay.id}
          id={overlay.id}
          className="absolute inset-0 flex flex-col justify-center items-center z-20 pointer-events-none"
          initial={{ opacity: index === 0 ? 1 : 0 }}
          style={{
            opacity: index === 0 ? 1 : 0, // First overlay visible by default
          }}
        >
          <div className="text-center max-w-4xl mx-auto px-4">
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold text-white mb-4 drop-shadow-2xl"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {overlay.title}
            </motion.h1>
            <motion.h2
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-gray-200 mb-6 drop-shadow-xl"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {overlay.subtitle}
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-300 drop-shadow-lg max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {overlay.description}
            </motion.p>
          </div>
        </motion.div>
      ))}

      {/* Content */}
      <motion.div
        className="content relative"
        style={{ y: springY, opacity: springOpacity, scale }}
        ref={inViewRef}
        initial={{ opacity: 0 }}
      >
        <motion.div
          className="top"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="top-left"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium tracking-wide drop-shadow-sm">Bar & Lounge</p>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 drop-shadow-sm">Brooklyn, NY</p>
          </motion.div>
          <motion.div
            className="top-right"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium tracking-wide drop-shadow-sm">Seven18BK</p>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 drop-shadow-sm">Experience</p>
          </motion.div>
        </motion.div>

        <motion.div
          className="center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <motion.div
            className="top-title"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-light tracking-wider text-center drop-shadow-md">
              Brooklyn's Premier
            </p>
          </motion.div>
          <motion.div
            className="title-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-white text-center leading-none drop-shadow-lg">
              Bar & Lounge
            </h1>
          </motion.div>
          <motion.div
            className="title-bottom"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-light text-center tracking-wide text-gray-200 drop-shadow-md">
              Where cocktails meet celebrations
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="bottom"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.div
            className="top-left"
            whileHover={{ scale: 1.05, x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <p className="text-xs sm:text-sm md:text-base lg:text-lg font-medium tracking-wide drop-shadow-sm">Signature Cocktails</p>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 drop-shadow-sm">Private Events</p>
          </motion.div>
          <motion.div
            className="top-right"
            whileHover={{ scale: 1.05, x: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <p className="text-xs sm:text-sm md:text-base lg:text-lg font-medium tracking-wide drop-shadow-sm">Live Music</p>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 drop-shadow-sm">Venue Rental</p>
          </motion.div>
        </motion.div>
      </motion.div>


    </section>
  );
};

export default Hero;