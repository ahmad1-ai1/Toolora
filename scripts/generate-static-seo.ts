import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOLS, CATEGORIES } from '../src/data/tools.js';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, getCanonicalUrl } from '../src/config/seo.js';
import { ToolCategory } from '../src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

interface RouteSeo {
  path: string;
  title: string;
  description: string;
  canonical: string;
  ogType: 'website' | 'article';
  ogImage: string;
  structuredData?: object | object[];
}

function getRoutes(): RouteSeo[] {
  const routes: RouteSeo[] = [];

  // 1. Homepage (/)
  const homeFaqs = [
    {
      q: 'Are Toolora online tools completely free to use?',
      a: 'Yes, 100% free with no hidden paywalls, no watermarks, and no sign-up or credit card requirements.',
    },
    {
      q: 'How does client-side file processing protect my privacy?',
      a: 'When you compress an image or convert a PDF, processing occurs inside your web browser’s local memory utilizing modern WebAssembly and HTML5 Canvas APIs. Your files are never transmitted to our servers or any cloud database.',
    },
    {
      q: 'Can I use Toolora on my smartphone or tablet?',
      a: 'Yes. Toolora is designed mobile-first with adaptive touch gestures, fluid layouts, and responsive interfaces tested across iOS and Android.',
    },
    {
      q: 'Do you keep copies of my uploaded or converted files?',
      a: 'Never. Because your files are never received by our servers, it is technically impossible for anyone else to view, store, or share your documents.',
    },
  ];

  routes.push({
    path: '/',
    title: 'Toolora — Free Online Tools for Images, PDFs, Text & More',
    description:
      'Free, fast and privacy-friendly online tools for compressing images and PDFs, converting files, calculating percentages and age, formatting JSON, generating QR codes, and more.',
    canonical: `${SITE_URL}/`,
    ogType: 'website',
    ogImage: `${SITE_URL}/og-image.png`,
    structuredData: [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/favicon.svg`,
        },
        description:
          'Free, fast and privacy-friendly online tools for compressing images and PDFs, converting files, calculating percentages and age, formatting JSON, generating QR codes, and more.',
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/tools?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faq`,
        mainEntity: homeFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
    ],
  });

  // 2. All Tools Catalog (/tools)
  routes.push({
    path: '/tools',
    title: 'All Free Online Tools — Images, PDFs, Text & More | Toolora',
    description: `Explore our collection of ${TOOLS.length} free, fast, and privacy-friendly utilities for images, PDFs, text, developer tasks, and calculations.`,
    canonical: `${SITE_URL}/tools`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    structuredData: {
      '@type': 'BreadcrumbList',
      '@id': `${SITE_URL}/tools#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Tools',
          item: `${SITE_URL}/tools`,
        },
      ],
    },
  });

  // 3. Individual Tools (/tools/:slug)
  for (const tool of TOOLS) {
    const canonicalUrl = getCanonicalUrl(`/tools/${tool.slug}`);
    const categoryInfo = CATEGORIES.find((c) => c.id === tool.category);

    const webAppSchema = {
      '@type': 'WebApplication',
      '@id': `${canonicalUrl}#webapp`,
      name: tool.h1Title,
      url: canonicalUrl,
      description: tool.metaDescription,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All modern operating systems (Windows, macOS, Linux, iOS, Android)',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: `${SITE_URL}/`,
      },
    };

    const breadcrumbSchema = {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Tools',
          item: `${SITE_URL}/tools`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: tool.name,
          item: canonicalUrl,
        },
      ],
    };

    const faqSchema = {
      '@type': 'FAQPage',
      '@id': `${canonicalUrl}#faq`,
      mainEntity: tool.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };

    routes.push({
      path: `/tools/${tool.slug}`,
      title: tool.seoTitle,
      description: tool.metaDescription,
      canonical: canonicalUrl,
      ogType: 'article',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData: [webAppSchema, breadcrumbSchema, faqSchema],
    });
  }

  // 4. Categories (/category/:id)
  for (const category of CATEGORIES) {
    const canonicalUrl = `${SITE_URL}/category/${category.id}`;
    routes.push({
      path: `/category/${category.id}`,
      title: `Free ${category.name} Tools Online — Fast & Private | Toolora`,
      description: category.description,
      canonical: canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData: {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: `${category.name} Tools`,
            item: canonicalUrl,
          },
        ],
      },
    });
  }

  // 5. Informational Pages
  // /about
  routes.push({
    path: '/about',
    title: 'About Toolora — Free, Fast & Privacy-Friendly Online Utilities',
    description:
      "Learn more about Toolora's mission to provide fast, completely free, and zero-server client-side utilities for images, PDFs, text, and calculators.",
    canonical: `${SITE_URL}/about`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    structuredData: {
      '@type': 'BreadcrumbList',
      '@id': `${SITE_URL}/about#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'About Toolora',
          item: `${SITE_URL}/about`,
        },
      ],
    },
  });

  // /contact
  routes.push({
    path: '/contact',
    title: 'Contact Us — Toolora Support & Feedback',
    description:
      'Have feedback, bug reports, or feature requests for Toolora? Get in touch with our team directly. We are always eager to improve our free utilities.',
    canonical: `${SITE_URL}/contact`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    structuredData: {
      '@type': 'BreadcrumbList',
      '@id': `${SITE_URL}/contact#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Contact Toolora',
          item: `${SITE_URL}/contact`,
        },
      ],
    },
  });

  // /privacy-policy
  routes.push({
    path: '/privacy-policy',
    title: 'Privacy Policy — Toolora Zero-Retention Guarantee',
    description:
      'Read the Toolora Privacy Policy. We do not store, view, or upload your files to any remote server. 100% client-side data privacy guarantee.',
    canonical: `${SITE_URL}/privacy-policy`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    structuredData: {
      '@type': 'BreadcrumbList',
      '@id': `${SITE_URL}/privacy-policy#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Privacy Policy',
          item: `${SITE_URL}/privacy-policy`,
        },
      ],
    },
  });

  // /terms
  routes.push({
    path: '/terms',
    title: 'Terms of Service — Toolora Free Online Utilities',
    description:
      'Read the Toolora Terms of Service. Clear, fair terms governing the use of our free browser-based suite of online utilities.',
    canonical: `${SITE_URL}/terms`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    structuredData: {
      '@type': 'BreadcrumbList',
      '@id': `${SITE_URL}/terms#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Terms of Service',
          item: `${SITE_URL}/terms`,
        },
      ],
    },
  });

  // /disclaimer
  routes.push({
    path: '/disclaimer',
    title: 'Legal Disclaimer — Toolora Calculations & Conversions',
    description:
      'Toolora Legal Disclaimer. Disclosures concerning file conversions, percentage calculations, and chronological age estimates.',
    canonical: `${SITE_URL}/disclaimer`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    structuredData: {
      '@type': 'BreadcrumbList',
      '@id': `${SITE_URL}/disclaimer#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Legal Disclaimer',
          item: `${SITE_URL}/disclaimer`,
        },
      ],
    },
  });

  return routes;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateHtmlForRoute(templateHtml: string, route: RouteSeo): string {
  let html = templateHtml;

  // 1. Replace <title>
  html = html.replace(
    /<title>.*?<\/title>/i,
    `<title>${escapeHtml(route.title)}</title>`
  );

  // 2. Replace <meta name="description">
  html = html.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(route.description)}" />`
  );

  // 3. Replace <link rel="canonical">
  html = html.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
    `<link rel="canonical" href="${route.canonical}" />`
  );

  // 4. Replace Open Graph
  html = html.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(route.title)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(route.description)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:url" content="${route.canonical}" />`
  );
  html = html.replace(
    /<meta\s+property="og:type"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:type" content="${route.ogType}" />`
  );
  html = html.replace(
    /<meta\s+property="og:image"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:image" content="${route.ogImage}" />`
  );

  // 5. Replace Twitter
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:image" content="${route.ogImage}" />`
  );

  // 6. Inject or Replace JSON-LD structured data
  if (route.structuredData) {
    const payload = Array.isArray(route.structuredData)
      ? {
          '@context': 'https://schema.org',
          '@graph': route.structuredData,
        }
      : {
          '@context': 'https://schema.org',
          ...route.structuredData,
        };

    const scriptTag = `<script id="dynamic-json-ld" type="application/ld+json">${JSON.stringify(payload)}</script>`;

    // If route is homepage, replace the global structured data script in index.html
    if (route.path === '/') {
      html = html.replace(
        /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
        scriptTag
      );
    } else {
      // Replace existing global script with route-specific script
      html = html.replace(
        /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
        scriptTag
      );
    }
  }

  return html;
}

export function prerender() {
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    throw new Error(`dist/index.html not found at ${indexHtmlPath}. Run vite build first.`);
  }

  const baseTemplate = fs.readFileSync(indexHtmlPath, 'utf8');
  const routes = getRoutes();

  console.log(`Prerendering SEO metadata for ${routes.length} static routes...`);

  for (const route of routes) {
    const routeHtml = generateHtmlForRoute(baseTemplate, route);

    if (route.path === '/') {
      // Overwrite dist/index.html with homepage-specific SEO tags
      fs.writeFileSync(indexHtmlPath, routeHtml, 'utf8');
    } else {
      // Clean path: e.g. /tools/image-compressor -> tools/image-compressor
      const cleanPath = route.path.replace(/^\//, '');
      const routeDir = path.join(distDir, cleanPath);

      // 1. Create directory and index.html (e.g. dist/tools/image-compressor/index.html)
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      fs.writeFileSync(path.join(routeDir, 'index.html'), routeHtml, 'utf8');

      // 2. Also create static .html file (e.g. dist/tools/image-compressor.html)
      // This guarantees instant static serving across all Vercel cleanUrls/trailingSlash settings
      fs.writeFileSync(`${routeDir}.html`, routeHtml, 'utf8');
    }
  }

  console.log(`Successfully generated static SEO files for all ${routes.length} routes.`);
}

prerender();
