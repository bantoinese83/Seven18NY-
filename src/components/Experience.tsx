import React, { useState, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useScroll } from '../contexts/ScrollContext';
import TextReveal from './TextReveal';
// Using public asset path



const Experience: React.FC = () => {
    const [ref, isVisible] = useScrollAnimation<HTMLElement>();
    const { scrollY } = useScroll();
    const [elementTop, setElementTop] = useState(0);

    useEffect(() => {
        if (isVisible && ref.current && elementTop === 0) {
            setElementTop(ref.current.offsetTop);
        }
    }, [isVisible, ref, elementTop]);

    const parallaxOffset = elementTop > 0 ? (scrollY - elementTop) * 0.15 : 0;

    return (
        <>
            <section id="experience" ref={ref} className="py-24 md:py-40 bg-black/50 overflow-hidden relative">
                <div className={`container mx-auto px-6`}>
                    {/* Hero Section with Venue Story */}
                    <div className="text-center mb-24">
                        <div className="relative">
                            <h2 className="text-6xl md:text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-white to-brand-gold mb-8 tracking-wide">
                                Seven18BK
                            </h2>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-gold/10 to-transparent blur-3xl" />
                        </div>
                        <div className="max-w-4xl mx-auto relative z-10">
                            <TextReveal
                                text="Brooklyn's premier bar & lounge with venue rental"
                                isVisible={isVisible}
                                className="text-2xl md:text-3xl text-gray-300 mb-8 leading-relaxed font-light"
                            />
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 mt-12">
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                    <span className="text-sm text-gray-300 tracking-wide">Brooklyn Born</span>
                                </div>
                                <div className="hidden sm:block w-px h-6 bg-gray-700" />
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                    <span className="text-sm text-gray-300 tracking-wide">Woman Led</span>
                                </div>
                                <div className="hidden sm:block w-px h-6 bg-gray-700" />
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                    </svg>
                                    <span className="text-sm text-gray-300 tracking-wide">Black Owned</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Venue Story + Image */}
                    <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
                        <div
                            className="text-center md:text-left transition-all duration-1000 ease-out"
                            style={{
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateX(0)' : 'translateX(-30px)'
                            }}
                        >
                            <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-wide">
                                Bar, Lounge & Events
                            </h3>
                            <TextReveal
                                text="Experience Brooklyn's finest cocktails in our stylish lounge, or transform the space for your private events and celebrations."
                                isVisible={isVisible}
                                className="text-lg text-gray-300 mb-6 leading-relaxed"
                            />
                            <TextReveal
                                text="From signature cocktails to full venue rental, Seven18BK offers the perfect blend of bar culture and event hosting."
                                isVisible={isVisible}
                                className="text-gray-400 leading-relaxed"
                            />
                        </div>
                        <div
                            className="relative h-96 md:h-[500px] transition-opacity duration-1000 ease-out"
                            style={{
                                opacity: isVisible ? 1 : 0,
                                transform: `translateY(${parallaxOffset}px)`,
                                willChange: 'transform',
                                transitionDelay: '200ms'
                            }}
                        >
                             <div className="absolute -bottom-5 -right-5 w-full h-full border-4 border-brand-green rounded-lg transition-all duration-700 ease-out" style={{ transform: isVisible ? 'translate(0, 0)' : 'translate(10px, 10px)' }} />
                            <img
                                src="/gallery/7-2.jpg"
                                alt="Stylish interior of Seven18BK"
                                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-2xl"
                                loading="lazy"
                            />
                        </div>
                    </div>


                </div>
            </section>
        </>
    );
}

export default Experience;