
import { useState, useEffect, useRef, RefObject } from 'react';

export const useScrollAnimation = <T extends HTMLElement,>(): [RefObject<T>, boolean] => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        // Disconnect after the animation is triggered once.
        observer.disconnect();
      }
    });

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return [domRef, isVisible];
};
