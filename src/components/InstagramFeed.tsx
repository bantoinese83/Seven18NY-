import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { posts } from '../data/instagram-posts';

const InstagramFeed: React.FC = () => {
    const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();

    return (
        <section id="vibe" className="py-24 md:py-40 bg-black/50 overflow-hidden">
            <div ref={ref} className={`container mx-auto px-6 fade-in-section ${isVisible ? 'is-visible' : ''}`}>
                <div className="text-center mb-12 sm:mb-16 px-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-brand-gold tracking-wide leading-tight">
                        Our Vibe
                    </h2>
                    <p className="text-base sm:text-lg text-gray-300 mt-3 max-w-2xl mx-auto leading-relaxed px-2">
                        Follow the latest from <a href="https://www.instagram.com/seven18bk" target="_blank" rel="noopener noreferrer" className="text-brand-green hover:underline transition-colors">@Seven18BK</a> on Instagram.
                    </p>
                </div>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 max-w-4xl mx-auto">
                    {posts.map((post, index) => (
                        <a
                            href="https://www.instagram.com/seven18ny"
                            target="_blank"
                            rel="noopener noreferrer"
                            key={post.id}
                            className="group relative block w-full aspect-square overflow-hidden rounded-lg shadow-lg active:scale-95 transition-transform duration-150"
                            style={{
                                transitionDelay: `${index * 80}ms`,
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                            }}
                        >
                            <img
                                src={post.imageUrl}
                                alt={post.caption}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300 ease-out"
                                loading="lazy"
                            />
                            {/* Mobile-optimized overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2 sm:p-4">
                                <p className="text-white text-center text-xs sm:text-sm leading-tight px-1">
                                    {post.caption}
                                </p>
                            </div>
                            {/* Mobile touch indicator */}
                            <div className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:hidden">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default InstagramFeed;