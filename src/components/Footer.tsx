import React, { useState, useEffect } from 'react';
import Logo from './Logo';

const SocialIcon: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-brand-gold transition-all duration-300 transform hover:scale-110 active:scale-95 p-2 rounded-full hover:bg-gray-800/50 touch-manipulation"
        aria-label="Social media link"
    >
        {children}
    </a>
);

const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const EmailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;

const MapPinIcon = () => (
    <svg viewBox="0 0 24 24" width="48" height="48" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full text-red-500 drop-shadow-lg transition-transform group-hover:scale-110">
        <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
    </svg>
);

// Location distance calculation
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959; // Radius of Earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

const LocationDistance: React.FC = () => {
    const [distance, setDistance] = useState<number | null>(null);
    const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt' | 'unavailable'>('prompt');
    const [loading, setLoading] = useState(false);

    // Seven18NY coordinates (593 3rd Avenue, South Slope, Brooklyn)
    const venueLat = 40.6700;
    const venueLng = -73.9870;

    useEffect(() => {
        // Check if geolocation is available
        if (!navigator.geolocation) {
            setPermission('unavailable');
            return;
        }

        // Check permission status
        if ('permissions' in navigator) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                setPermission(result.state as any);

                result.addEventListener('change', () => {
                    setPermission(result.state as any);
                });
            });
        }
    }, []);

    const getLocation = () => {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                const dist = calculateDistance(userLat, userLng, venueLat, venueLng);
                setDistance(Math.round(dist * 10) / 10); // Round to 1 decimal place
                setPermission('granted');
                setLoading(false);
            },
            (error) => {
                console.error('Geolocation error:', error);
                setPermission('denied');
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    };

    if (permission === 'unavailable') {
        return (
            <div className="text-xs text-gray-500 mt-2">
                📍 Location services unavailable
            </div>
        );
    }

    if (permission === 'denied') {
        return (
            <div className="text-xs text-gray-500 mt-2">
                📍 Location access denied
            </div>
        );
    }

    if (distance !== null) {
        return (
            <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <span>📍</span>
                <span>{distance} miles away</span>
                <button
                    onClick={getLocation}
                    className="text-brand-gold hover:text-brand-gold/80 transition-colors underline"
                    disabled={loading}
                >
                    {loading ? '...' : 'refresh'}
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={getLocation}
            disabled={loading}
            className="text-xs text-gray-500 mt-2 hover:text-brand-gold transition-colors flex items-center gap-1 disabled:opacity-50"
        >
            <span>📍</span>
            <span>{loading ? 'Getting location...' : 'Show distance'}</span>
        </button>
    );
};

const Footer: React.FC = () => {
    const mapUrl = "https://www.google.com/maps/search/?api=1&query=593+3rd+Avenue,+South+Slope,+Brooklyn";
    
    return (
        <footer id="footer-contact" className="bg-black/0 border-t border-gray-800/50">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 text-center sm:text-left">
                    <div>
                        <div className="flex justify-center md:justify-start mb-4">
                            <Logo size="medium" />
                        </div>
                        <p className="text-gray-400 mb-4 text-center md:text-left">Brooklyn's premier bar & lounge with venue rental.</p>
                         <div className="flex justify-center md:justify-start space-x-6">
                            <SocialIcon href="https://www.instagram.com/seven18ny"><InstagramIcon /></SocialIcon>
                            <SocialIcon href="https://www.facebook.com/seven18ny"><FacebookIcon /></SocialIcon>
                            <SocialIcon href="mailto:Seven18NY@gmail.com"><EmailIcon /></SocialIcon>
                        </div>
                    </div>
                     <div>
                        <h4 className="font-bold text-lg text-white mb-4">Bar & Lounge Hours</h4>
                        <ul className="text-gray-400 space-y-1">
                            <li><span className="font-semibold text-gray-300">Mon/Tues:</span> CLOSED</li>
                            <li><span className="font-semibold text-gray-300">Wed/Thurs:</span> 5pm - 11pm</li>
                            <li><span className="font-semibold text-gray-300">Fri/Sat:</span> 5pm - 12am</li>
                            <li><span className="font-semibold text-gray-300">Sun:</span> 12pm - 6pm</li>
                        </ul>
                        <p className="text-xs text-gray-500 mt-3">Private events available outside regular hours</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-white mb-4">Location & Contact</h4>
                        <a
                            href={mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-gray-400 hover:text-brand-gold transition-colors active:scale-95 touch-manipulation p-2 -m-2 rounded-lg hover:bg-gray-800/30"
                        >
                            <span className="block sm:inline">593 3rd Avenue</span>
                            <span className="block sm:inline sm:ml-1">South Slope, Brooklyn</span>
                        </a>
                        <a
                            href="mailto:Seven18NY@gmail.com"
                            className="block text-gray-400 hover:text-brand-gold transition-colors active:scale-95 touch-manipulation p-2 -m-2 rounded-lg hover:bg-gray-800/30 mt-2"
                        >
                            Seven18NY@gmail.com
                        </a>
                        <a
                            href="tel:718-555-0187"
                            className="block text-gray-400 hover:text-brand-gold transition-colors active:scale-95 touch-manipulation p-2 -m-2 rounded-lg hover:bg-gray-800/30 mt-1"
                        >
                            (718) 555-0187
                        </a>

                        {/* Nearest Landmarks */}
                        <div className="mt-4">
                            <h5 className="text-sm font-semibold text-gray-300 mb-2">Nearby Landmarks</h5>
                            <ul className="text-xs text-gray-500 space-y-1">
                                <li>• Prospect Park (0.5 miles)</li>
                                <li>• Brooklyn Museum (0.8 miles)</li>
                                <li>• Brooklyn Botanic Garden (1.2 miles)</li>
                                <li>• 7th Avenue Shopping (0.3 miles)</li>
                                <li>• Brooklyn Bridge (1.5 miles)</li>
                            </ul>
                        </div>

                        {/* Public Transportation */}
                        <div className="mt-4">
                            <h5 className="text-sm font-semibold text-gray-300 mb-2">Public Transportation</h5>
                            <ul className="text-xs text-gray-500 space-y-1">
                                <li>• <strong>Subway:</strong> F/G at 7th Ave (2 min walk)</li>
                                <li>• <strong>Subway:</strong> R at 9th St/4th Ave (5 min walk)</li>
                                <li>• <strong>Bus:</strong> B61, B63, B65 (multiple stops)</li>
                                <li>• <strong>Citi Bike:</strong> 3rd Ave & 7th St (1 min walk)</li>
                                <li>• <strong>Parking:</strong> Street parking available</li>
                            </ul>
                        </div>

                        {/* Distance Calculator */}
                        <LocationDistance />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-white mb-4">Find Us</h4>
                        <div className="block relative w-full h-48 sm:h-56 md:h-48 bg-gray-800/60 rounded-lg overflow-hidden group border border-gray-700/50 shadow-md touch-manipulation">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2586394329996!2d-73.987!3d40.670!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25b6c6d8e4b5f%3A0x1234567890abcdef!2s593%203rd%20Ave%2C%20Brooklyn%2C%20NY%2011215!5e0!3m2!1sen!2sus!4v1635000000000!5m2!1sen!2sus"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="rounded-lg"
                                title="Seven18NY Location Map"
                            ></iframe>
                            <a
                                href={mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0 z-10"
                                aria-label="Open in Google Maps"
                            >
                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm text-center text-xs text-white/90 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Open in Google Maps
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="text-center text-gray-500 mt-16 pt-8 border-t border-gray-800/50">
                    <p>&copy; {new Date().getFullYear()} Seven18NY. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;