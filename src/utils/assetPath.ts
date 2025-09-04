/**
 * Utility function to handle asset paths correctly in both development and production
 * This ensures assets load properly on Vercel and other deployment platforms
 */
export const getAssetPath = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // In development, serve from root
  if (process.env.NODE_ENV === 'development') {
    return `/${cleanPath}`;
  }

  // In production, ensure proper path resolution
  // Vercel serves static assets from the root
  return `/${cleanPath}`;
};

/**
 * Get the full URL for assets in production
 */
export const getAssetUrl = (path: string): string => {
  if (typeof window === 'undefined') {
    // Server-side rendering
    return getAssetPath(path);
  }

  // Client-side: construct full URL
  const baseUrl = window.location.origin;
  return `${baseUrl}${getAssetPath(path)}`;
};
