import React from 'react';

interface StructuredDataProps {
  type: 'Organization' | 'Event' | 'LocalBusiness';
  data: any;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const getStructuredData = () => {
    const baseUrl = 'https://www.seven18ny.com';
    
    switch (type) {
      case 'Organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Seven18BK',
          description: 'A stylish and intimate event venue in the heart of Brooklyn, perfect for private gatherings, corporate events, and celebrations.',
          url: baseUrl,
          logo: `${baseUrl}/images/logoseven18.png`,
          address: {
            '@type': 'PostalAddress',
            streetAddress: '593 3rd Ave',
            addressLocality: 'Brooklyn',
            addressRegion: 'NY',
            postalCode: '11215',
            addressCountry: 'US'
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+1-555-SEVEN18',
            contactType: 'customer service',
            areaServed: 'US',
            availableLanguage: 'English'
          },
          sameAs: [
            'https://www.instagram.com/seven18ny',
            'https://www.facebook.com/seven18ny'
          ]
        };

      case 'LocalBusiness':
        return {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Seven18BK',
          description: 'Premium event venue rental in Brooklyn, NY. Black owned, woman led, Brooklyn born.',
          url: baseUrl,
          telephone: '+1-555-SEVEN18',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '593 3rd Ave',
            addressLocality: 'Brooklyn',
            addressRegion: 'NY',
            postalCode: '11215',
            addressCountry: 'US'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 40.670,
            longitude: -73.987
          },
          openingHours: 'Mo-Su 09:00-23:00',
          priceRange: '$$',
          paymentAccepted: 'Cash, Credit Card',
          currenciesAccepted: 'USD'
        };

      case 'Event':
        return {
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: data.name || 'Event at Seven18BK',
          description: data.description || 'Join us for an unforgettable event at Seven18BK',
          startDate: data.startDate,
          endDate: data.endDate,
          location: {
            '@type': 'Place',
            name: 'Seven18BK',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '593 3rd Ave',
              addressLocality: 'Brooklyn',
              addressRegion: 'NY',
              postalCode: '11215',
              addressCountry: 'US'
            }
          },
          organizer: {
            '@type': 'Organization',
            name: 'Seven18BK',
            url: baseUrl
          },
          offers: {
            '@type': 'Offer',
            price: data.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          }
        };

      default:
        return {};
    }
  };

  const structuredData = getStructuredData();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};
