import React, { useState, useEffect, useRef } from 'react';

const Cursor: React.FC = () => {
    const trailRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    const position = useRef({ x: 0, y: 0 });
    const target = useRef({ x: 0, y: 0 });
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            target.current.x = e.clientX;
            target.current.y = e.clientY;
        };

        const onMouseOver = (e: MouseEvent) => {
            if ((e.target as HTMLElement).closest('a, button')) {
                setIsHovering(true);
            }
        };
        
        const onMouseOut = (e: MouseEvent) => {
            if ((e.target as HTMLElement).closest('a, button')) {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        document.body.addEventListener('mouseover', onMouseOver);
        document.body.addEventListener('mouseout', onMouseOut);

        const animate = () => {
            const ease = 0.15;
            position.current.x += (target.current.x - position.current.x) * ease;
            position.current.y += (target.current.y - position.current.y) * ease;

            if (trailRef.current) {
                // Adjusting to center the element on the cursor
                trailRef.current.style.transform = `translate(${position.current.x}px, ${position.current.y}px) translate(-50%, -50%)`;
            }
            animationFrameId.current = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            document.body.removeEventListener('mouseover', onMouseOver);
            document.body.removeEventListener('mouseout', onMouseOut);
            if(animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    return <div ref={trailRef} className={`cursor-trail ${isHovering ? 'hovered' : ''}`}></div>;
};

export default Cursor;