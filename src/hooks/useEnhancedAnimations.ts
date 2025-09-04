import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useInView } from 'react-intersection-observer';

gsap.registerPlugin(ScrollTrigger);

interface AnimationConfig {
  trigger?: string | HTMLElement;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

interface MicroInteractionConfig {
  scale?: number;
  rotate?: number;
  duration?: number;
  ease?: string;
  stagger?: number;
}

export const useEnhancedAnimations = () => {

  // Scroll-triggered animations
  const useScrollAnimation = (config: AnimationConfig = {}) => {
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      const {
        trigger = element,
        start = 'top 80%',
        end = 'bottom 20%',
        scrub = false,
        pin = false,
        markers = false,
        onEnter,
        onLeave,
        onEnterBack,
        onLeaveBack
      } = config;

      ScrollTrigger.create({
        trigger,
        start,
        end,
        scrub,
        pin,
        markers,
        onEnter,
        onLeave,
        onEnterBack,
        onLeaveBack
      });

      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }, [config]);

    return elementRef;
  };

  // Magnetic effect for interactive elements
  const useMagneticEffect = (config: MicroInteractionConfig = {}) => {
    const elementRef = useRef<HTMLElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      const {
        scale = 1.05,
        rotate = 0,
        duration = 0.3,
        ease = 'power2.out'
      } = config;

      const handleMouseEnter = () => {
        setIsHovered(true);
        gsap.to(element, {
          scale,
          rotate,
          duration,
          ease
        });
      };

      const handleMouseLeave = () => {
        setIsHovered(false);
        gsap.to(element, {
          scale: 1,
          rotate: 0,
          duration,
          ease
        });
      };

      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, [config]);

    return { elementRef, isHovered };
  };

  // Staggered entrance animation
  const useStaggerAnimation = (items: any[], config: MicroInteractionConfig = {}) => {
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
      const container = containerRef.current;
      if (!container || !items.length) return;

      const {
        stagger = 0.1,
        duration = 0.6,
        ease = 'power2.out'
      } = config;

      gsap.fromTo(container.children,
        {
          opacity: 0,
          y: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration,
          ease,
          stagger,
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }, [items, config]);

    return containerRef;
  };

  // Parallax effect
  const useParallax = (speed: number = 0.5) => {
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      gsap.to(element, {
        yPercent: -50 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }, [speed]);

    return elementRef;
  };

  // Floating animation
  const useFloatingAnimation = (config: MicroInteractionConfig = {}) => {
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      const {
        duration = 3,
        ease = 'power1.inOut'
      } = config;

      gsap.to(element, {
        y: '+=10',
        duration,
        ease,
        yoyo: true,
        repeat: -1
      });

      return () => {
        gsap.killTweensOf(element);
      };
    }, [config]);

    return elementRef;
  };

  // Pulse glow effect
  const usePulseGlow = (color: string = '#D4AF37', intensity: number = 0.5) => {
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      gsap.to(element, {
        boxShadow: `0 0 20px ${color}${Math.floor(intensity * 255).toString(16)}`,
        duration: 2,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1
      });

      return () => {
        gsap.killTweensOf(element);
      };
    }, [color, intensity]);

    return elementRef;
  };

  // Text reveal animation
  const useTextReveal = (config: MicroInteractionConfig = {}) => {
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      const {
        duration = 1,
        stagger = 0.05,
        ease = 'power2.out'
      } = config;

      // Split text into spans for animation
      const text = element.textContent || '';
      element.innerHTML = text.split('').map(char =>
        `<span style="display: inline-block; opacity: 0; transform: translateY(20px);">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('');

      gsap.to(element.children, {
        opacity: 1,
        y: 0,
        duration,
        ease,
        stagger,
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }, [config]);

    return elementRef;
  };

  // Intersection observer with custom animations
  const useIntersectionAnimation = (config: {
    threshold?: number;
    triggerOnce?: boolean;
    animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'bounceIn';
    duration?: number;
    delay?: number;
  } = {}) => {
    const {
      threshold = 0.1,
      triggerOnce = true,
      animation = 'fadeIn',
      duration = 0.6,
      delay = 0
    } = config;

    const { ref, inView } = useInView({
      threshold,
      triggerOnce
    });

    const animationVariants = {
      fadeIn: { opacity: 0, y: 0 },
      slideUp: { opacity: 0, y: 50 },
      slideLeft: { opacity: 0, x: -50 },
      slideRight: { opacity: 0, x: 50 },
      scaleIn: { opacity: 0, scale: 0.8 },
      bounceIn: { opacity: 0, scale: 0.3, y: 50 }
    };

    const initial = animationVariants[animation];
    const animate = { opacity: 1, x: 0, y: 0, scale: 1 };

    return {
      ref,
      inView,
      initial,
      animate: inView ? animate : initial,
      transition: { duration, delay }
    };
  };

  return {
    useScrollAnimation,
    useMagneticEffect,
    useStaggerAnimation,
    useParallax,
    useFloatingAnimation,
    usePulseGlow,
    useTextReveal,
    useIntersectionAnimation
  };
};

export default useEnhancedAnimations;
