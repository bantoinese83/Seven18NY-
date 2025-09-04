
import { useEffect, useRef } from 'react';

interface PageVisibilityOptions {
  originalTitle: string;
  awayTitle: string;
  originalFavicon: string;
  awayFavicon: string;
}

export const usePageVisibility = (options: PageVisibilityOptions) => {
  const { originalTitle, awayTitle, originalFavicon, awayFavicon } = options;
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const faviconElement = document.getElementById('favicon') as HTMLLinkElement | null;
    if (!faviconElement) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isVisibleRef.current) {
          document.title = awayTitle;
          faviconElement.href = awayFavicon;
          isVisibleRef.current = false;
        }
      } else {
        if (!isVisibleRef.current) {
          document.title = originalTitle;
          faviconElement.href = originalFavicon;
          isVisibleRef.current = true;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Reset to original on unmount
      document.title = originalTitle;
      faviconElement.href = originalFavicon;
    };
  }, [originalTitle, awayTitle, originalFavicon, awayFavicon]);
};
