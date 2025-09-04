import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import Logo from './Logo';

const WifiModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    // WIFI:T:<authentication type>;S:<SSID>;P:<password>;;
    const wifiString = 'WIFI:T:WPA;S:Seven18BK Guest WiFi;P:celebrate718;;';
    QRCode.toDataURL(wifiString, {
      width: 256,
      margin: 2,
      color: {
        dark: '#D4AF37', // brand-gold
        light: '#00000000' // transparent
      }
    })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error(err));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  return (
    <>
      <div className="modal-backdrop animate-fade-in" onClick={onClose}></div>
      <div className="modal-content bg-gray-800/80 p-8 rounded-lg shadow-2xl backdrop-blur-sm border border-gray-700/50 animate-pop-in">
          <h3 className="text-2xl font-bold text-center text-brand-gold mb-4">Connect to Guest Wi-Fi</h3>
          <p className="text-center text-gray-300 mb-6">Scan this QR code with your phone's camera to instantly connect to our network.</p>
          <div className="bg-gray-900/50 p-4 rounded-lg flex justify-center items-center">
            {qrCodeUrl ? <img src={qrCodeUrl} alt="WiFi QR Code" /> : <div className="w-64 h-64 animate-pulse bg-gray-700 rounded-lg"></div>}
          </div>
          <div className="text-center mt-6 text-sm text-gray-400">
            <p><span className="font-semibold">Network:</span> Seven18BK Guest WiFi</p>
            <p><span className="font-semibold">Password:</span> celebrate718</p>
          </div>
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
      </div>
    </>
  );
};


const amenities = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><line x1="14" y1="14" x2="14" y2="21"></line><line x1="21" y1="14" x2="21" y2="21"></line><line x1="14" y1="14" x2="17" y2="14"></line><line x1="19" y1="19" x2="21" y2="19"></line><line x1="14" y1="17" x2="17" y2="17"></line></svg>,
        title: "Instant Wi-Fi Access",
        description: "Scan a QR code for immediate, password-free access to our guest network.",
        isInteractive: true,
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>,
        title: "Sound System",
        description: "Professional-grade sound system ready for your DJ, live band, or playlist."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>,
        title: "Projector & Screen",
        description: "A/V equipment available for presentations, slideshows, and video screenings."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
        title: "Full-Service Bar",
        description: "Our fully-stocked bar and professional bartenders can craft the perfect drinks for your event."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>,
        title: "Modular Layout",
        description: "Flexible seating and furniture arrangements to perfectly match your event's theme."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>,
        title: "Custom Lighting",
        description: "State-of-the-art lighting system to set the perfect mood and ambiance."
    }
]

const Amenities: React.FC = () => {
    const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <section id="amenities" className="py-24 md:py-40 bg-black/0 overflow-hidden">
                <div ref={ref} className={`container mx-auto px-6 fade-in-section ${isVisible ? 'is-visible' : ''}`}>
                    <div className="text-center mb-20">
                        <div className="flex justify-center items-center mb-8">
                            <Logo size="large" variant="section" className="opacity-90" />
                        </div>
                        <div className="w-24 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto"></div>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                            {amenities.map((item: any, index) => (
                                <div
                                    key={item.title}
                                    onClick={item.isInteractive ? () => setIsModalOpen(true) : undefined}
                                    className={`group ${item.isInteractive ? 'cursor-pointer' : ''}`}
                                    style={{
                                        transitionDelay: `${index * 100}ms`,
                                        opacity: isVisible ? 1 : 0,
                                        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                                        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
                                    }}
                                >
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-display font-light text-white tracking-wide group-hover:text-brand-gold transition-colors duration-500 leading-tight">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-300 leading-relaxed text-base font-light">
                                            {item.description}
                                        </p>
                                        {item.isInteractive && (
                                            <div className="pt-2">
                                                <span className="text-sm font-medium text-brand-gold tracking-wider uppercase opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                                                    Click to connect
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            {isModalOpen && <WifiModal onClose={() => setIsModalOpen(false)} />}
        </>
    );
}

export default Amenities;