import { useRef, useEffect, RefObject } from 'react';

export const useMagneticEffect = <T extends HTMLElement>(): RefObject<T> => {
    const ref = useRef<T>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const onMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = element.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;
            
            const deltaX = clientX - centerX;
            const deltaY = clientY - centerY;
            
            element.style.transition = 'transform 0.1s ease-out';
            element.style.transform = `translate(${deltaX * 0.2}px, ${deltaY * 0.2}px)`;
        };

        const onMouseLeave = () => {
            element.style.transition = 'none';
            element.style.transform = `translate(0px, 0px)`;
        };

        element.addEventListener('mousemove', onMouseMove);
        element.addEventListener('mouseleave', onMouseLeave);

        return () => {
            element.removeEventListener('mousemove', onMouseMove);
            element.removeEventListener('mouseleave', onMouseLeave);
        };
    }, []);

    return ref;
};
