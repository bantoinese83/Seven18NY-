import React, { useState, useMemo } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const testimonials = [
  {
    quote: "Seven18NY was the perfect spot for my 30th birthday. The vibe was immaculate, the staff was incredible, and everything went off without a hitch. Can't recommend it enough!",
    name: "Jessica L.",
    event: "Birthday Celebration",
    tags: ['Birthday'],
  },
  {
    quote: "We hosted our company's quarterly mixer here and it was a huge success. The space is stylish, versatile, and the A/V setup was seamless. Our team had a fantastic time.",
    name: "David Chen",
    event: "Corporate Mixer",
    tags: ['Corporate'],
  },
  {
    quote: "An absolutely beautiful and intimate venue for our engagement party. The team at Seven18NY helped us create a magical night we'll never forget. Five stars!",
    name: "Maria & Carlos",
    event: "Engagement Party",
    tags: ['Private Party'],
  },
  {
    quote: "Our pop-up was a massive hit thanks to this venue. Great foot traffic and a really cool, adaptable space. We'll be back for our next launch.",
    name: "Startup Collective",
    event: "Pop-Up Event",
    tags: ['Corporate', 'Pop-Up'],
  },
];

const QuoteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.983 3v7.391c0 2.9-2.35 5.258-5.238 5.258h-1.745v-7.391h1.745c1.801 0 3.238-1.44 3.238-3.258v-2zM21.983 3v7.391c0 2.9-2.35 5.258-5.238 5.258h-1.745v-7.391h1.745c1.801 0 3.238-1.44 3.238-3.258v-2z"/>
    </svg>
);


const Testimonials: React.FC = () => {
    const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();
    const [activeFilter, setActiveFilter] = useState('All');

    const filters = useMemo(() => ['All', ...Array.from(new Set(testimonials.flatMap(t => t.tags)))], []);
    
    const filteredTestimonials = useMemo(() => {
        if (activeFilter === 'All') return testimonials;
        return testimonials.filter(t => t.tags.includes(activeFilter));
    }, [activeFilter]);

    return (
        <section id="testimonials" className="py-24 md:py-40 bg-black/50 overflow-hidden">
            <div ref={ref} className={`container mx-auto px-6 fade-in-section ${isVisible ? 'is-visible' : ''}`}>
                <div className="text-center mb-12">
                    <h2 className="text-5xl md:text-6xl font-display font-bold text-brand-gold tracking-wide">
                        What Our Guests Are Saying
                    </h2>
                    <p className="text-lg text-gray-300 mt-3 max-w-2xl mx-auto">
                        Real stories from unforgettable events hosted at our venue.
                    </p>
                </div>

                <div className="flex justify-center flex-wrap gap-3 mb-12">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                                activeFilter === filter
                                ? 'bg-brand-gold text-black shadow-md'
                                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {filteredTestimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.name + activeFilter} // Key change forces re-render for animation
                            className="relative bg-gray-800/60 p-8 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700/50 flex flex-col animate-pop-in"
                            style={{
                                animationDelay: `${index * 100}ms`,
                            }}
                        >
                            <QuoteIcon className="absolute top-4 right-4 w-20 h-20 text-gray-700/30 -z-10" />
                            <p className="text-gray-300 italic flex-grow z-10">"{testimonial.quote}"</p>
                            <div className="mt-6 pt-6 border-t border-gray-700/50 z-10">
                                <p className="font-bold text-lg text-white">{testimonial.name}</p>
                                <p className="text-brand-green font-semibold">{testimonial.event}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;