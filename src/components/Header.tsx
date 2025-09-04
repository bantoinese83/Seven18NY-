import React, { useState, useEffect } from 'react';
import { useMagneticEffect } from '../hooks/useMagneticEffect';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import Logo from './Logo';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#experience', label: 'About' },
  { href: '#amenities', label: 'Amenities' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#drinks', label: 'Cocktails & Menu' },
  { href: '#vibe', label: 'Our Vibe' },
  { href: '#booking', label: 'Book Event' },
];

const HamburgerIcon: React.FC<{ open: boolean }> = ({ open }) => (
    <div className="w-7 h-6 flex flex-col justify-between items-center relative">
        <span className={`block w-full h-0.5 bg-current transform transition-all duration-300 ease-in-out rounded-full ${open ? 'rotate-45 translate-y-[10px] bg-brand-gold' : 'bg-gray-200'}`}></span>
        <span className={`block w-full h-0.5 bg-current transform transition-all duration-300 ease-in-out rounded-full ${open ? 'opacity-0 scale-0' : 'bg-gray-200'}`}></span>
        <span className={`block w-full h-0.5 bg-current transform transition-all duration-300 ease-in-out rounded-full ${open ? '-rotate-45 -translate-y-[10px] bg-brand-gold' : 'bg-gray-200'}`}></span>
    </div>
);

const MobileMenu: React.FC<{
    isOpen: boolean,
    closeMenu: () => void,
    onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>) => void
}> = ({ isOpen, closeMenu, onLinkClick }) => (
    <div className={`fixed inset-0 bg-black/95 backdrop-blur-lg z-50 transform transition-all duration-500 ease-in-out ${
        isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
        {/* Mobile Menu Header */}
        <div className="absolute top-0 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-gray-700/50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="text-brand-gold font-semibold text-lg">Menu</div>
                <button
                    onClick={closeMenu}
                    className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-700/50"
                    aria-label="Close menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>

        {/* Mobile Menu Content */}
        <div className="container mx-auto h-full pt-20 pb-8 px-6 flex flex-col justify-center items-center text-center">
            <nav className="flex flex-col space-y-6 w-full max-w-sm">
                {navLinks.map((link, index) => (
                    <a
                        key={link.href}
                        href={link.href}
                        onClick={(e) => {
                            onLinkClick(e);
                            closeMenu();
                        }}
                        className="group relative text-2xl sm:text-3xl text-gray-200 hover:text-brand-gold transition-all duration-300 py-3 px-4 rounded-lg hover:bg-gray-800/50 active:bg-gray-700/70 touch-manipulation"
                        style={{
                            animationDelay: `${200 + index * 100}ms`,
                            opacity: isOpen ? 1 : 0,
                            transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
                            transition: `all 0.5s ease-out ${index * 100}ms`
                        }}
                    >
                        <span className="relative z-10">{link.label}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    </a>
                ))}
            </nav>

            {/* Mobile Menu Footer */}
            <div className="mt-12 text-center">
                <p className="text-sm text-gray-500 mb-4">Follow us on social media</p>
                <div className="flex justify-center space-x-6">
                    <a href="https://www.instagram.com/seven18ny" target="_blank" rel="noopener noreferrer"
                       className="text-gray-400 hover:text-brand-gold transition-colors p-2 rounded-full hover:bg-gray-800/50">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                    </a>
                    <a href="https://www.facebook.com/seven18ny" target="_blank" rel="noopener noreferrer"
                       className="text-gray-400 hover:text-brand-gold transition-colors p-2 rounded-full hover:bg-gray-800/50">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </div>
);

const MagneticLink: React.FC<{
    href: string;
    label: string;
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}> = ({ href, label, onClick }) => {
    const magneticRef = useMagneticEffect<HTMLAnchorElement>();
    return (
        <a ref={magneticRef} href={href} onClick={onClick} className="relative text-gray-200 hover:text-brand-gold transition-colors duration-300 group pb-1">
            <span className="inline-block">{label}</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-gold transition-all duration-300 ease-out group-hover:w-full"></span>
        </a>
    );
};


const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const magneticLogoRef = useMagneticEffect<HTMLAnchorElement>();
  const magneticHamburgerRef = useMagneticEffect<HTMLButtonElement>();

  // Keyboard navigation for mobile menu
  useKeyboardNavigation({
    onEscape: () => setIsMenuOpen(false),
    enabled: isMenuOpen
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
  }, [isMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (!href) return;
    const targetId = href.substring(1);
    
    // Handle home link to scroll to top
    if (targetId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
        // Offset to account for the fixed header. 80px is a safe bet for its height.
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
  };


  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled
          ? 'bg-black/90 backdrop-blur-md shadow-lg border-b border-brand-green/20'
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          {/* Desktop & Tablet Layout */}
          <div className="hidden sm:flex justify-between items-center">
            <div className="flex flex-col items-start gap-2">
              <a ref={magneticLogoRef} href="#" className="flex items-center group" onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}>
                <Logo variant="header" size="medium" />
              </a>
              {/* Black Owned Identity - Hidden on very small screens */}
              <div className="hidden lg:flex items-center gap-3 text-xs text-gray-400 ml-6">
                <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse"></div>
                <span className="font-light tracking-wide">Black Owned • Woman Led • Brooklyn Born</span>
                <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse"></div>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-10">
              {navLinks.map((link) => (
                <MagneticLink key={link.href} href={link.href} label={link.label} onClick={handleNavClick} />
              ))}
            </nav>
          </div>

          {/* Mobile Layout */}
          <div className="flex sm:hidden justify-between items-center">
            <div className="flex items-center">
              <a ref={magneticLogoRef} href="#" className="flex items-center group" onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}>
                <Logo variant="header" size="small" />
              </a>
            </div>

            <button
              ref={magneticHamburgerRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-60 p-2 text-gray-200 hover:text-brand-gold transition-colors duration-300 rounded-lg hover:bg-gray-800/50 active:bg-gray-700/70 touch-manipulation"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <HamburgerIcon open={isMenuOpen} />
            </button>
          </div>

          {/* Mobile Tagline - Compact version */}
          <div className="flex sm:hidden justify-center mt-2">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-1 h-1 bg-brand-gold rounded-full animate-pulse"></div>
              <span className="font-light tracking-wide truncate">Black Owned • Woman Led • Brooklyn Born</span>
              <div className="w-1 h-1 bg-brand-gold rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenu isOpen={isMenuOpen} closeMenu={() => setIsMenuOpen(false)} onLinkClick={handleNavClick} />
    </>
  );
};

export default Header;