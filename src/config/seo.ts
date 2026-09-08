/**
 * Global SEO Configuration for Toolora
 * https://toolora-git-main-toolora-tools.vercel.app
 */

export const SITE_URL = 'https://toolora-git-main-toolora-tools.vercel.app';
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
