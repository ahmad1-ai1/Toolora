import React, { useEffect } from 'react';
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE, getCanonicalUrl } from '../../config/seo';

export interface SeoHeadProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  structuredData?: object | object[];
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  structuredData,
}) => {
  const canonicalUrl = getCanonicalUrl(path);

  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // Helper to set or create meta tag by name
    const setMetaName = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Helper to set or create meta tag by property
    const setMetaProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // 2. Meta Description
    setMetaName('description', description);

    // 3. Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // 4. Open Graph Tags
    setMetaProperty('og:title', title);
    setMetaProperty('og:description', description);
    setMetaProperty('og:url', canonicalUrl);
    setMetaProperty('og:site_name', SITE_NAME);
    setMetaProperty('og:type', path === '/' ? 'website' : 'article');
    setMetaProperty('og:image', ogImage);

    // 5. Twitter Card Tags
    setMetaName('twitter:card', 'summary_large_image');
    setMetaName('twitter:title', title);
    setMetaName('twitter:description', description);
    setMetaName('twitter:image', ogImage);

    // 6. Dynamic JSON-LD injection
    const existingScript = document.getElementById('dynamic-json-ld');
    if (existingScript) {
      existingScript.remove();
    }

    if (structuredData) {
      const script = document.createElement('script');
      script.id = 'dynamic-json-ld';
      script.type = 'application/ld+json';
      
      const payload = Array.isArray(structuredData)
        ? {
            '@context': 'https://schema.org',
            '@graph': structuredData,
          }
        : {
            '@context': 'https://schema.org',
            ...structuredData,
          };

      script.text = JSON.stringify(payload);
      document.head.appendChild(script);
    }

    return () => {
      // Clean up dynamic script when unmounting or changing route
      const s = document.getElementById('dynamic-json-ld');
      if (s) {
        s.remove();
      }
    };
  }, [title, description, canonicalUrl, ogImage, structuredData, path]);

  return null;
};
