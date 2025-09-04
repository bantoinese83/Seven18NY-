
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Amenities from './components/Amenities';
import Gallery from './components/Gallery';
import Menu from './components/Menu';
import InstagramFeed from './components/InstagramFeed';
import Booking from './components/Booking';
import Seven18Section from './components/Seven18Section';
import VideoText from './components/VideoText';
import Footer from './components/Footer';
import BackToTopButton from './components/BackToTopButton';
import SEOHead from './components/SEOHead';
import DynamicOGImage from './components/DynamicOGImage';
import { ScrollProvider } from './contexts/ScrollContext';
import { usePageVisibility } from './hooks/usePageVisibility';
import { usePerformance } from './hooks/usePerformance';
import Cursor from './components/Cursor';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastContainer } from './components/ToastContainer';
import { StructuredData } from './components/StructuredData';
// Using public asset path for video fallback

const App: React.FC = () => {
  usePageVisibility({
    originalTitle: 'Seven18BK | Rent Our Venue in Brooklyn',
    awayTitle: '🎉 Planning an event? Come back!',
    originalFavicon: '/favicon.ico',
    awayFavicon: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎉</text></svg>`
  });

  usePerformance();

  return (
    <ErrorBoundary>
      <ScrollProvider>
        <SEOHead />
        <DynamicOGImage />
        <Cursor />
        <ToastContainer />
        <StructuredData type="Organization" data={{}} />
        <StructuredData type="LocalBusiness" data={{}} />
        <div className="bg-gray-900/0 text-gray-200 antialiased relative z-10">
          <Header />
          <main>
            <Hero />
            <Experience />
            <Amenities />
            <VideoText
            text="SEVEN18"
            videoSrc="/videos/brooklyn-sample-video.mp4"
            fallbackImage="/gallery/7-1.jpg"
            className="bg-black"
            textSize="7xl"
          />
            <Gallery />
            <Menu />
            <InstagramFeed />
            <Booking />
          </main>
          <VideoText
            text="SEVEN18"
            videoSrc="/videos/brooklyn-sample-video.mp4"
            fallbackImage="/gallery/7-1.jpg"
            className="bg-black"
            textSize="7xl"
          />
          <Footer />
          <BackToTopButton />
        </div>
      </ScrollProvider>
    </ErrorBoundary>
  );
};

export default App;