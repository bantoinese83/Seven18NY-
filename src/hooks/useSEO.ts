import { useEffect } from 'react';

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
}

export const useSEO = (seoData: SEOData) => {
  useEffect(() => {
    // Update document title
    if (seoData.title) {
      document.title = seoData.title;
    }

    // Update meta description
    if (seoData.description) {
      updateMetaTag('description', seoData.description);
    }

    // Update meta keywords
    if (seoData.keywords) {
      updateMetaTag('keywords', seoData.keywords);
    }

    // Update Open Graph tags
    if (seoData.ogTitle) {
      updateMetaTag('og:title', seoData.ogTitle, 'property');
    }
    if (seoData.ogDescription) {
      updateMetaTag('og:description', seoData.ogDescription, 'property');
    }
    if (seoData.ogImage) {
      updateMetaTag('og:image', seoData.ogImage, 'property');
    }
    if (seoData.ogUrl) {
      updateMetaTag('og:url', seoData.ogUrl, 'property');
    }

    // Update Twitter Card tags
    if (seoData.twitterTitle) {
      updateMetaTag('twitter:title', seoData.twitterTitle);
    }
    if (seoData.twitterDescription) {
      updateMetaTag('twitter:description', seoData.twitterDescription);
    }
    if (seoData.twitterImage) {
      updateMetaTag('twitter:image', seoData.twitterImage);
    }

    // Update canonical URL
    if (seoData.canonical) {
      updateCanonical(seoData.canonical);
    }
  }, [seoData]);
};

const updateMetaTag = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
};

const updateCanonical = (url: string) => {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  
  canonical.setAttribute('href', url);
};
