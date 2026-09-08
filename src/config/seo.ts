/**
 * Global SEO Configuration for Toolora
 * https://tooloraa.muhammadahmad60713.workers.dev
 */

const getEnvSiteUrl = (): string | undefined => {
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.VITE_SITE_URL) return process.env.VITE_SITE_URL;
    if (process.env.SITE_URL) return process.env.SITE_URL;
  }
  try {
    // @ts-expect-error import.meta.env may be populated by Vite
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) {
      // @ts-expect-error
      return import.meta.env.VITE_SITE_URL;
    }
  } catch (_) {}
  return undefined;
};

export const SITE_URL = getEnvSiteUrl() || 'https://tooloraa.muhammadahmad60713.workers.dev';
export const SITE_NAME = 'Toolora';
export const DEFAULT_TITLE = 'Toolora — Free Online Tools for Images, PDFs, Text & More';
export const DEFAULT_DESCRIPTION =
  'Free, fast and privacy-friendly online tools for compressing images and PDFs, converting files, calculating percentages and age, formatting JSON, generating QR codes, and more.';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

/**
 * Returns a standardized canonical URL without inconsistent trailing slashes
 * @param path - e.g. '/tools/image-compressor'
 */
export function getCanonicalUrl(path: string): string {
  // Normalize leading slash and strip trailing slash (except root '/')
  let clean = path.trim();
  if (!clean.startsWith('/')) {
    clean = `/${clean}`;
  }
  if (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }
  return clean === '/' ? `${SITE_URL}/` : `${SITE_URL}${clean}`;
}
