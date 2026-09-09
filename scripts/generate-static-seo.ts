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

const TOOLS_FAQS = [
  {
    q: 'Are all the online tools on Toolora completely free to use?',
    a: 'Yes. Every utility available on Toolora is 100% free with no hidden paywalls, no monthly subscription fees, and no feature locks. You never have to enter credit card information or worry about free trial expirations.',
  },
  {
    q: 'Do I need to download or install any software to use these tools?',
    a: 'No. Toolora works entirely online in your web browser. You do not need to download executables, run desktop installers, or configure browser extensions. Simply open any tool page on desktop or mobile and begin working immediately.',
  },
  {
    q: 'How does client-side browser processing protect my privacy?',
    a: 'Where technically accurate—such as our image compression, resizing, and PDF utilities—file processing takes place directly in your device’s browser memory via modern HTML5 Canvas, JavaScript, and WebAssembly APIs. Your files are not transmitted across the internet to our servers or stored in cloud databases, guaranteeing complete data privacy.',
  },
  {
    q: 'Can I use these free online tools on mobile phones and tablets?',
    a: 'Yes. Toolora is engineered mobile-first with responsive interfaces, touch-friendly controls, and adaptive layouts tested across iOS Safari, Android Chrome, and all major tablet platforms.',
  },
  {
    q: 'Are there any usage limits, task countdowns, or conversion caps?',
    a: 'No. There are no artificial daily limits, hourly queues, or conversion quotas. You can compress as many photos, convert as many documents, and format as many payloads as your daily workflow requires.',
  },
  {
    q: 'What formats do the image and PDF tools support?',
    a: 'Our image utilities support widespread digital formats including standard JPG/JPEG, transparent PNG, and modern WebP. Our document tools handle standard PDF documents, enabling effortless conversion between image galleries and PDF files.',
  },
  {
    q: 'What is the difference between client-side tools and traditional cloud tools?',
    a: 'Traditional web tools require uploading your sensitive files across the internet to a third-party server, waiting in conversion queues, and downloading the finished file back. Client-side tools like Toolora perform calculations and transformations directly on your device’s local CPU and GPU, eliminating network lag, server queues, and remote data leaks.',
  },
];

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
    title: 'Free Online Tools — Images, PDFs, Text & Calculators | Toolora',
    description:
      'Explore our collection of free, fast, and privacy-friendly online tools for image compression, PDF conversion, text analysis, developer formatting, and math calculations.',
    canonical: `${SITE_URL}/tools`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    structuredData: [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}/tools#collection`,
        url: `${SITE_URL}/tools`,
        name: 'Free Online Tools — Images, PDFs, Text & More | Toolora',
        description: `Explore Toolora’s directory of ${TOOLS.length} free online tools for image compression, PDF editing, text analysis, developer formatting, and everyday calculations. 100% private and browser-based.`,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
        },
        mainEntity: {
          '@type': 'ItemList',
          '@id': `${SITE_URL}/tools#itemlist`,
          name: 'Toolora Free Online Tools Catalog',
          description: 'Comprehensive directory of free client-side online tools.',
          numberOfItems: TOOLS.length,
          itemListElement: TOOLS.map((tool, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: tool.name,
            url: `${SITE_URL}/tools/${tool.slug}`,
            description: tool.shortDescription,
          })),
        },
      },
      {
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
            name: 'Free Online Tools',
            item: `${SITE_URL}/tools`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/tools#faq`,
        mainEntity: TOOLS_FAQS.map((faq) => ({
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

    const howToSchema =
      tool.slug === 'image-compressor'
        ? {
            '@type': 'HowTo',
            '@id': `${canonicalUrl}#howto`,
            name: 'How to Compress an Image Online',
            description:
              'Step-by-step guide to compressing JPG, PNG, and WebP images online for free using Toolora.',
            step: [
              {
                '@type': 'HowToStep',
                position: 1,
                name: 'Upload or select an image',
                text: 'Drag and drop your JPG, PNG, or WebP picture into the upload box, or click browse files to select an image from your computer or mobile phone.',
              },
              {
                '@type': 'HowToStep',
                position: 2,
                name: 'Adjust compression settings',
                text: 'Use the interactive quality slider between 10% and 100% to find your ideal balance between file size reduction and visual clarity.',
              },
              {
                '@type': 'HowToStep',
                position: 3,
                name: 'Preview and check resulting file size',
                text: 'Review the real-time calculated output file size in kilobytes (KB) and savings percentage alongside the visual preview.',
              },
              {
                '@type': 'HowToStep',
                position: 4,
                name: 'Download the compressed image',
                text: 'Click the "Download Compressed Image" button to immediately save your optimized file directly to your device storage.',
              },
            ],
          }
        : tool.slug === 'pdf-compressor'
        ? {
            '@type': 'HowTo',
            '@id': `${canonicalUrl}#howto`,
            name: 'How to Compress a PDF Online',
            description:
              'Step-by-step guide to compressing PDF documents online for free using Toolora.',
            step: [
              {
                '@type': 'HowToStep',
                position: 1,
                name: 'Upload your PDF document',
                text: 'Drag and drop your PDF file into the upload zone, or click browse files to select a document from your computer or mobile device (up to 80MB).',
              },
              {
                '@type': 'HowToStep',
                position: 2,
                name: 'Choose optimization level',
                text: 'Select Standard compression to retain document metadata, or choose Aggressive mode to strip non-essential title, author, and producer tags for maximum size reduction.',
              },
              {
                '@type': 'HowToStep',
                position: 3,
                name: 'Compress and check resulting file size',
                text: 'Toolora cleans redundant object dictionaries and packs streams, displaying your before-and-after size in KB/MB, exact bytes saved, and savings percentage with diagnostic feedback.',
              },
              {
                '@type': 'HowToStep',
                position: 4,
                name: 'Download the smaller PDF',
                text: 'Click the "Download Compressed PDF" button to immediately save your optimized document directly to your device storage.',
              },
            ],
          }
        : null;

    routes.push({
      path: `/tools/${tool.slug}`,
      title: tool.seoTitle,
      description: tool.metaDescription,
      canonical: canonicalUrl,
      ogType: tool.slug === 'image-compressor' || tool.slug === 'pdf-compressor' ? 'website' : 'article',
      ogImage: DEFAULT_OG_IMAGE,
      structuredData: [
        webAppSchema,
        breadcrumbSchema,
        ...(howToSchema ? [howToSchema] : []),
        faqSchema,
      ],
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

function generatePreRenderedBody(route: RouteSeo): string {
  const isHome = route.path === '/';
  const isToolsCatalog = route.path === '/tools';
  const isTool = route.path.startsWith('/tools/');
  const isCategory = route.path.startsWith('/category/');

  const navLinks = [
    { label: 'All Tools', href: '/tools' },
    { label: 'Images', href: '/category/images' },
    { label: 'PDF', href: '/category/pdf' },
    { label: 'Text', href: '/category/text' },
    { label: 'Developer', href: '/category/developer' },
    { label: 'Calculators', href: '/category/calculators' },
  ];

  let mainContent = '';

  if (isHome) {
    mainContent = `
      <section class="mb-12 text-center">
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">Toolora — Free Online Tools for Images, PDFs, Text &amp; More</h1>
        <p class="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">Fast, privacy-friendly online utilities processed 100% locally in your web browser. Zero server uploads, zero subscriptions, zero limits.</p>
      </section>
      <section class="mb-16">
        <h2 class="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Popular Free Online Tools</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${TOOLS.map(
            (t) => `
            <a href="/tools/${t.slug}" class="block p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:shadow-lg transition">
              <h3 class="text-lg font-bold mb-2 text-slate-900 dark:text-white">${escapeHtml(t.name)}</h3>
              <p class="text-sm text-slate-600 dark:text-slate-400">${escapeHtml(t.shortDescription)}</p>
            </a>
          `
          ).join('')}
        </div>
      </section>
    `;
  } else if (isToolsCatalog) {
    const imageTools = TOOLS.filter(
      (t) => t.slug === 'image-compressor' || t.slug === 'image-resizer'
    );
    const pdfTools = TOOLS.filter(
      (t) =>
        t.slug === 'pdf-compressor' ||
        t.slug === 'jpg-to-pdf' ||
        t.slug === 'pdf-to-jpg'
    );
    const textDevTools = TOOLS.filter(
      (t) =>
        t.slug === 'word-counter' ||
        t.slug === 'json-formatter' ||
        t.slug === 'qr-code-generator'
    );
    const calcTools = TOOLS.filter(
      (t) =>
        t.slug === 'percentage-calculator' || t.slug === 'age-calculator'
    );

    mainContent = `
      <nav aria-label="Breadcrumb" class="mb-6 text-sm text-slate-500">
        <ol class="flex items-center gap-2">
          <li><a href="/" class="hover:underline">Home</a></li>
          <li>/</li>
          <li class="font-semibold text-slate-800 dark:text-slate-200">Free Online Tools</li>
        </ol>
      </nav>

      <header class="mb-10">
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">Free Online Tools</h1>
        <p class="text-lg text-indigo-600 dark:text-indigo-400 font-medium mb-6">High-performance, browser-based utilities engineered for everyday productivity.</p>
        
        <div class="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 mb-8">
          <p>
            Welcome to <strong>Toolora</strong>, your comprehensive suite of free online tools engineered for modern web productivity, digital media preparation, and rapid data processing. We created Toolora to remove the friction, paywalls, and intrusive software installations that too often complicate routine digital tasks. Whether you need to compress high-resolution photographs for a website, merge scanned receipts into a clean PDF, format deeply nested JSON payloads, count words for an editorial submission, or calculate exact percentages, Toolora delivers lightning-fast, high-precision results directly in your web browser.
          </p>
          <p>
            Every utility in our collection is <strong>100% free to use</strong> with no hidden fees, no subscription tiers, no usage caps, and no user registration required. Because our tools operate online as lightweight, responsive web applications, there is zero software to download or install. You never have to worry about operating system incompatibilities, administrative permissions, or bulky background executables consuming your device’s memory. Toolora runs smoothly across desktop workstations, laptops, tablets, and smartphones running any modern web browser.
          </p>
          <p>
            Our suite is organized into specialized modules designed to address distinct workflows:
          </p>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li>
              <strong>Image and PDF Tools:</strong> Optimize your digital documents and visual media with tools like our Image Compressor, Image Resizer, PDF Compressor, JPG to PDF Converter, and PDF to JPG Extractor. These utilities help creators, students, and professionals meet strict file size limits for email attachments and upload portals without sacrificing visual fidelity.
            </li>
            <li>
              <strong>Text and Developer Tools:</strong> Streamline writing, coding, and communication tasks. Use the Word Counter to analyze character counts, syllable distribution, and estimated reading times, validate and beautify complex payloads with the JSON Formatter, or produce scannable barcodes with the QR Code Generator.
            </li>
            <li>
              <strong>Calculators and Utilities:</strong> Solve everyday mathematical, calendar, and chronological problems with ease. Quickly calculate percentages, discounts, and margin shifts with our Percentage Calculator, or determine your exact age in years, months, and days using the Age Calculator.
            </li>
          </ul>
          <p>
            Privacy and security are foundational to our architectural design. Wherever technically feasible, Toolora utilities perform processing <strong>strictly inside your local web browser</strong> using client-side HTML5 Canvas, WebAssembly, and JavaScript APIs. Your private photographs, personal identity documents, financial statements, and proprietary code remain securely on your device—never uploaded to external cloud servers, stored in remote databases, or viewed by third parties.
          </p>
        </div>

        <nav aria-label="Tool Categories" class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold text-slate-500 mr-1">Jump to Category:</span>
          <a href="#image-tools" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:text-indigo-600 dark:hover:text-indigo-400">Image Tools</a>
          <a href="#pdf-tools" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:text-indigo-600 dark:hover:text-indigo-400">PDF Tools</a>
          <a href="#text-developer-tools" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:text-indigo-600 dark:hover:text-indigo-400">Text &amp; Developer Tools</a>
          <a href="#calculators-utilities" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:text-indigo-600 dark:hover:text-indigo-400">Calculators &amp; Utilities</a>
          <a href="#tools-faq" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:text-indigo-600 dark:hover:text-indigo-400">Frequently Asked Questions</a>
        </nav>
      </header>

      <!-- Category 1: Image Tools -->
      <section id="image-tools" class="mb-14">
        <h2 class="text-2xl sm:text-3xl font-bold mb-2 text-slate-900 dark:text-white">Image Tools</h2>
        <p class="text-slate-600 dark:text-slate-400 mb-6">Compress, resize, and optimize JPG, PNG, and WebP graphics client-side with zero loss in visual clarity.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
          ${imageTools.map((t) => `
            <a href="/tools/${t.slug}" class="block p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:shadow-lg transition">
              <h3 class="text-lg font-bold mb-2 text-slate-900 dark:text-white">${escapeHtml(t.name)}</h3>
              <p class="text-sm text-slate-600 dark:text-slate-400">${escapeHtml(t.shortDescription)}</p>
            </a>
          `).join('')}
        </div>
        <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <strong>Connected Image Workflow:</strong> After reducing file weight with the <a href="/tools/image-compressor" class="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Free Image Compressor</a>, adjust pixel dimensions using the <a href="/tools/image-resizer" class="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Free Image Resizer</a>, or bundle multiple resized graphics into a single document with our <a href="/tools/jpg-to-pdf" class="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">JPG to PDF Converter</a>.
        </div>
      </section>

      <!-- Category 2: PDF Tools -->
      <section id="pdf-tools" class="mb-14">
        <h2 class="text-2xl sm:text-3xl font-bold mb-2 text-slate-900 dark:text-white">PDF Tools</h2>
        <p class="text-slate-600 dark:text-slate-400 mb-6">Compress PDF documents, merge photos into professional PDFs, and extract high-resolution JPG pages securely.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
          ${pdfTools.map((t) => `
            <a href="/tools/${t.slug}" class="block p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:shadow-lg transition">
              <h3 class="text-lg font-bold mb-2 text-slate-900 dark:text-white">${escapeHtml(t.name)}</h3>
              <p class="text-sm text-slate-600 dark:text-slate-400">${escapeHtml(t.shortDescription)}</p>
            </a>
          `).join('')}
        </div>
        <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <strong>Connected Document Workflow:</strong> After combining images into a new file with the <a href="/tools/jpg-to-pdf" class="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">JPG to PDF Converter</a>, shrink final attachment weight using the <a href="/tools/pdf-compressor" class="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Free PDF Compressor</a>, or convert pages back into standalone pictures with the <a href="/tools/pdf-to-jpg" class="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">PDF to JPG Converter</a>.
        </div>
      </section>

      <!-- Category 3: Text & Developer Tools -->
      <section id="text-developer-tools" class="mb-14">
        <h2 class="text-2xl sm:text-3xl font-bold mb-2 text-slate-900 dark:text-white">Text &amp; Developer Tools</h2>
        <p class="text-slate-600 dark:text-slate-400 mb-6">Analyze word counts and reading metrics, validate and beautify JSON objects, and generate scannable QR codes.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
          ${textDevTools.map((t) => `
            <a href="/tools/${t.slug}" class="block p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:shadow-lg transition">
              <h3 class="text-lg font-bold mb-2 text-slate-900 dark:text-white">${escapeHtml(t.name)}</h3>
              <p class="text-sm text-slate-600 dark:text-slate-400">${escapeHtml(t.shortDescription)}</p>
            </a>
          `).join('')}
        </div>
        <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <strong>Connected Coding &amp; Text Workflow:</strong> Inspect string lengths and token metrics with the <a href="/tools/word-counter" class="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Online Word Counter</a>, parse and format structured API payloads with the <a href="/tools/json-formatter" class="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Online JSON Formatter &amp; Validator</a>, or publish links to digital assets using the <a href="/tools/qr-code-generator" class="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Dynamic QR Code Generator</a>.
        </div>
      </section>

      <!-- Category 4: Calculators & Utilities -->
      <section id="calculators-utilities" class="mb-14">
        <h2 class="text-2xl sm:text-3xl font-bold mb-2 text-slate-900 dark:text-white">Calculators &amp; Utilities</h2>
        <p class="text-slate-600 dark:text-slate-400 mb-6">Calculate percentage increases, discounts, and margins, or determine exact chronological age across dates.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
          ${calcTools.map((t) => `
            <a href="/tools/${t.slug}" class="block p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:shadow-lg transition">
              <h3 class="text-lg font-bold mb-2 text-slate-900 dark:text-white">${escapeHtml(t.name)}</h3>
              <p class="text-sm text-slate-600 dark:text-slate-400">${escapeHtml(t.shortDescription)}</p>
            </a>
          `).join('')}
        </div>
        <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <strong>Connected Calculator Workflow:</strong> Determine numerical growth or margin shifts with the <a href="/tools/percentage-calculator" class="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Online Percentage Calculator</a>, calculate precise milestone time spans with the <a href="/tools/age-calculator" class="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Online Age Calculator</a>, or generate direct mobile shortcuts to your calculations with the <a href="/tools/qr-code-generator" class="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Dynamic QR Code Generator</a>.
        </div>
      </section>

      <!-- FAQ Section -->
      <section id="tools-faq" class="mb-12">
        <h2 class="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-white">Frequently Asked Questions About Free Online Tools</h2>
        <div class="space-y-4">
          ${TOOLS_FAQS.map((f) => `
            <div class="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">${escapeHtml(f.q)}</h3>
              <p class="text-slate-600 dark:text-slate-400">${escapeHtml(f.a)}</p>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  } else if (isTool) {
    const slug = route.path.replace('/tools/', '');
    const tool = TOOLS.find((t) => t.slug === slug);
    if (tool && tool.slug === 'image-compressor') {
      mainContent = `
        <nav aria-label="Breadcrumb" class="mb-6 text-sm text-slate-500">
          <ol class="flex items-center gap-2">
            <li><a href="/" class="hover:underline">Home</a></li>
            <li>/</li>
            <li><a href="/tools" class="hover:underline">Tools</a></li>
            <li>/</li>
            <li class="font-semibold text-slate-800 dark:text-slate-200">${escapeHtml(tool.name)}</li>
          </ol>
        </nav>
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">${escapeHtml(tool.h1Title)}</h1>
        <p class="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">${escapeHtml(tool.longDescription)}</p>

        <div class="p-8 mb-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-center">
          <p class="font-medium text-slate-700 dark:text-slate-300">Toolora interactive ${escapeHtml(tool.name)} is loaded in your browser with 100% client-side privacy.</p>
        </div>

        <!-- Section 1: What is Image Compressor? -->
        <section id="what-is-tool" class="mb-12">
          <h2 class="text-2xl font-bold mb-4 text-slate-900 dark:text-white">What is ${escapeHtml(tool.name)}?</h2>
          ${tool.whatIsParagraphs.map((p) => `<p class="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">${escapeHtml(p)}</p>`).join('')}
        </section>

        <!-- Section 2: How to Compress an Image Online -->
        <section id="how-to-use" class="mb-12">
          <h2 class="text-2xl font-bold mb-4 text-slate-900 dark:text-white">How to Compress an Image Online</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${tool.howToSteps.map((step, idx) => `
              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex items-start gap-3.5">
                <div class="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">${idx + 1}</div>
                <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">${escapeHtml(step)}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Section 3: Target File Size Guide -->
        <section id="target-file-size" class="mb-12">
          <h2 class="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Compress Images to a Specific File Size</h2>
          <p class="mb-6 text-slate-700 dark:text-slate-300 leading-relaxed">
            Whether you are submitting documents to an official job or visa application portal, attaching assets to an email, or optimizing images for web performance, you often need to reduce image size in KB to satisfy strict file size caps. Because compression algorithms analyze color variance, high-frequency textures, and original pixel dimensions, no single quality setting will produce an identical file size across different photos. However, you can easily hit common thresholds like 200KB, 100KB, or 50KB by using a systematic approach.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2">Compress Photo to 50KB or 20KB</h3>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                Strict caps between 20KB and 50KB are customary for passport pictures, visa applications, digital signatures, and government exam upload forms. Because camera sensors record photos at 12 to 48 megapixels (often 4MB to 10MB), compressing a photo to 50KB through compression quality alone may cause severe blurriness.
              </p>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Practical method:</strong> First scale down pixel dimensions (for example, to 600×600 or 800×600 pixels) using our <a href="/tools/image-resizer" class="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Resize an image online</a> tool. Then select JPG or WebP format with quality set between 55% and 65% until your file satisfies the required limit.
              </p>
            </div>
            <div class="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2">Compress Image to 100KB</h3>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                A 100KB limit is the most popular benchmark for email newsletter headers, blog thumbnail graphics, and customer support ticket attachments. This target maintains vibrant colors without bloating inbox transfer sizes.
              </p>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Practical method:</strong> Upload your picture and adjust the quality slider to around 70%–75%. If your file remains slightly above 100KB, nudge the quality slider down in 5% increments or moderately trim excess pixel dimensions.
              </p>
            </div>
            <div class="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2">Compress Image to 200KB</h3>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                Webmasters and e-commerce designers regularly aim to compress image to 200KB for full-width website hero banners, landing page illustrations, and product zoom galleries. This delivers a crisp visual presentation on high-DPI Retina screens while comfortably passing Google Core Web Vitals Largest Contentful Paint (LCP) performance audits.
              </p>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Practical method:</strong> Select 80%–85% quality in JPG or WebP mode. For standard 1920×1080 web images, this easily reduces raw camera files from 5MB down to approximately 150KB–200KB.
              </p>
            </div>
            <div class="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2">500KB to 1MB Targets</h3>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                For architectural galleries, photography lookbooks, client proof sheets, and presentation decks, retaining fine textures and smooth gradients is critical.
              </p>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Practical method:</strong> Set the quality slider to 90% in JPG or WebP. This preserves near-lossless pixel fidelity while stripping bloated EXIF camera metadata and color profiles.
              </p>
            </div>
          </div>
          <div class="p-5 rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20">
            <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2">Practical Steps for Hitting an Exact File Size Target</h3>
            <ol class="list-decimal list-inside space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
              <li><strong>Choose JPG or WebP for photographs:</strong> Avoid raw PNG for photographs because PNG uses lossless compression, producing files 3x to 5x larger than JPG.</li>
              <li><strong>Reduce image dimensions when needed:</strong> If starting from a high-resolution camera photo (e.g. 4000px wide), downsize dimensions first using our <a href="/tools/image-resizer" class="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Free Image Resizer</a>.</li>
              <li><strong>Lower compression quality gradually:</strong> Adjust the slider in 5% to 10% increments rather than jumping directly to the lowest value.</li>
              <li><strong>Check resulting file size:</strong> Examine the real-time calculated size badge and repeat until the required KB ceiling is reached.</li>
            </ol>
          </div>
        </section>

        <!-- Section 4: JPG vs PNG vs WebP Comparison Table -->
        <section id="format-comparison" class="mb-12">
          <h2 class="text-2xl font-bold mb-4 text-slate-900 dark:text-white">JPG vs PNG vs WebP: Which Format Should You Use?</h2>
          <p class="mb-6 text-slate-700 dark:text-slate-300 leading-relaxed">
            Selecting the appropriate image format is just as important as adjusting the compression slider. Each format relies on distinct encoding algorithms tailored for specific image types and web use cases.
          </p>
          <div class="overflow-x-auto mb-6">
            <table class="w-full text-left text-sm border-collapse border border-slate-200 dark:border-slate-800">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th class="py-3 px-4 font-bold text-slate-900 dark:text-white">Format</th>
                  <th class="py-3 px-4 font-bold text-slate-900 dark:text-white">Best For</th>
                  <th class="py-3 px-4 font-bold text-slate-900 dark:text-white">Compression</th>
                  <th class="py-3 px-4 font-bold text-slate-900 dark:text-white">Transparency</th>
                  <th class="py-3 px-4 font-bold text-slate-900 dark:text-white">Typical Use</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                <tr>
                  <td class="py-3 px-4 font-semibold text-slate-900 dark:text-white">JPG / JPEG</td>
                  <td class="py-3 px-4 text-slate-700 dark:text-slate-300">Photographs & complex scenery</td>
                  <td class="py-3 px-4 text-slate-700 dark:text-slate-300">Lossy (discrete cosine transform)</td>
                  <td class="py-3 px-4 text-slate-700 dark:text-slate-300">No (fills with solid white)</td>
                  <td class="py-3 px-4 text-slate-700 dark:text-slate-300">Web articles, camera photos, social media uploads, email attachments</td>
                </tr>
                <tr>
                  <td class="py-3 px-4 font-semibold text-slate-900 dark:text-white">PNG</td>
                  <td class="py-3 px-4 text-slate-700 dark:text-slate-300">Logos, icons, text & screenshots</td>
                  <td class="py-3 px-4 text-slate-700 dark:text-slate-300">Lossless (DEFLATE algorithm)</td>
                  <td class="py-3 px-4 text-slate-700 dark:text-slate-300">Yes (full alpha channel)</td>
                  <td class="py-3 px-4 text-slate-700 dark:text-slate-300">Brand logos, transparent website assets, UI mockups, infographics</td>
                </tr>
                <tr>
                  <td class="py-3 px-4 font-semibold text-slate-900 dark:text-white">WebP</td>
                  <td class="py-3 px-4 text-slate-700 dark:text-slate-300">Modern web publishing & Core Web Vitals</td>
                  <td class="py-3 px-4 text-slate-700 dark:text-slate-300">Lossy & Lossless options</td>
                  <td class="py-3 px-4 text-slate-700 dark:text-slate-300">Yes (in lossy and lossless)</td>
                  <td class="py-3 px-4 text-slate-700 dark:text-slate-300">High-speed websites, e-commerce storefronts, progressive web apps</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
            <p><strong>When to choose JPG:</strong> JPG is generally suitable for photographs and continuous-tone imagery because gradual color transitions compress efficiently without conspicuous visual artifacts. Note that JPG does not support alpha transparency; transparent areas are filled with solid white during export.</p>
            <p><strong>When to choose PNG:</strong> PNG is useful when transparency or lossless quality matters. Company emblems, transparent navigation badges, and screenshots containing crisp text stay sharp without blurry compression halos. However, saving photographic imagery as PNG results in substantially heavier file sizes.</p>
            <p><strong>When to choose WebP:</strong> Developed by Google, WebP can provide efficient compression for supported web workflows, reducing file sizes by 25%–35% compared to JPG at equivalent perceptual quality while supporting transparency. Although universally supported in contemporary web browsers, some legacy image viewers or specialized document submission portals still mandate traditional JPG or PNG files.</p>
          </div>
        </section>

        <!-- Section 5: Why use Toolora's Image Compressor? -->
        <section id="why-use-toolora" class="mb-12">
          <h2 class="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Why use Toolora's ${escapeHtml(tool.name)}?</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            ${(tool.whyUseDetailed || []).map((b) => `
              <div class="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
                <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2">${escapeHtml(b.title)}</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">${escapeHtml(b.description)}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Section 6: Client-Side Privacy & In-Browser Processing -->
        <section id="privacy-security" class="mb-12">
          <h2 class="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Client-Side Privacy & In-Browser Processing</h2>
          <div class="p-6 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/10 space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>Conventional online converters upload your personal files over public networks to remote web servers, where pictures are queued, compressed, and stored in temporary cloud buckets. This model introduces latency and potential data privacy concerns.</p>
            <p>Toolora operates on a purely client-side architecture: when you select an image, it is decoded into local memory inside your web browser via standard HTML5 Canvas APIs (<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs">drawImage</code> and <code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs">toBlob</code>). Compression is calculated using your device's own hardware resources.</p>
            <p>No image data is ever transmitted across the internet to our servers or third-party cloud services. Because your files never leave your device, Toolora is safe for compressing sensitive identification records, passports, contracts, and confidential personal photographs.</p>
          </div>
        </section>

        <!-- Section 7: Frequently Asked Questions -->
        <section id="faq" class="mb-12">
          <h2 class="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <div class="space-y-4">
            ${tool.faqs.map((f) => `
              <div class="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">${escapeHtml(f.question)}</h3>
                <p class="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">${escapeHtml(f.answer)}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Section 8: Related Online Tools -->
        <section id="related-tools" class="mb-12">
          <h2 class="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Related Online Tools</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-6">Explore complementary utilities that pair seamlessly with ${escapeHtml(tool.name)}.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${(tool.relatedLinks || []).map((link) => `
              <a href="/tools/${link.slug}" class="block p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-indigo-500 transition group">
                <h3 class="text-base font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline mb-1">${escapeHtml(link.anchorText)}</h3>
                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400">${escapeHtml(link.description)}</p>
              </a>
            `).join('')}
          </div>
        </section>
      `;
    } else if (tool && tool.slug === 'pdf-compressor') {
      mainContent = `
        <nav aria-label="Breadcrumb" class="mb-6 text-sm text-slate-500">
          <ol class="flex items-center gap-2">
            <li><a href="/" class="hover:underline">Home</a></li>
            <li>/</li>
            <li><a href="/tools" class="hover:underline">Tools</a></li>
            <li>/</li>
            <li class="font-semibold text-slate-800 dark:text-slate-200">${escapeHtml(tool.name)}</li>
          </ol>
        </nav>
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">${escapeHtml(tool.h1Title)}</h1>
        <p class="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">${escapeHtml(tool.longDescription)}</p>

        <div class="p-8 mb-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-center">
          <p class="font-medium text-slate-700 dark:text-slate-300">Toolora interactive ${escapeHtml(tool.h1Title)} is loaded in your browser with 100% client-side privacy. Process files up to 80MB directly on your device with zero server uploads.</p>
        </div>

        <!-- Section 1: What is a PDF Compressor? -->
        <section id="what-is-tool" class="mb-12">
          <h2 class="text-2xl font-bold mb-4 text-slate-900 dark:text-white">What is a PDF Compressor?</h2>
          ${tool.whatIsParagraphs.map((p) => `<p class="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">${escapeHtml(p)}</p>`).join('')}
        </section>

        <!-- Section 2: How to Compress a PDF Online -->
        <section id="how-to-use" class="mb-12">
          <h2 class="text-2xl font-bold mb-4 text-slate-900 dark:text-white">How to Compress a PDF Online</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${tool.howToSteps.map((step, idx) => `
              <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex items-start gap-3.5">
                <div class="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">${idx + 1}</div>
                <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">${escapeHtml(step)}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Section 3: Target File Size Guide -->
        <section id="target-file-size" class="mb-12">
          <h2 class="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Compress PDF to a Specific File Size</h2>
          <p class="mb-6 text-slate-700 dark:text-slate-300 leading-relaxed">
            Whether you need to reduce PDF file size for application upload portals, satisfy strict email attachment quotas, or optimize heavy reports for fast web viewing, achieving an exact file size target requires understanding document composition. Because PDF documents combine text layers, embedded fonts, vector linework, and raster graphics, no automated tool can guarantee an exact byte weight without analyzing internal elements. However, by applying the right optimization workflow, you can reliably compress PDF to 1MB, 500KB, or 200KB.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <div class="flex items-center justify-between gap-2 mb-2">
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Compress PDF to 1MB</h3>
                <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">Email &amp; Job Applications</span>
              </div>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                A 1MB file size limit is standard for corporate applicant tracking systems (such as Workday, Taleo, and Greenhouse), university submission portals, and email attachments. Multi-page resumes, academic research papers, and pitch decks exported from Microsoft Word, Google Docs, or InDesign frequently weigh 3MB to 8MB due to uncompressed internal object streams.
              </p>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Practical method:</strong> Upload your document and select Aggressive mode to strip non-essential metadata and repack object streams. For clean vector documents, this almost always brings files well beneath 1MB.
              </p>
            </div>
            <div class="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <div class="flex items-center justify-between gap-2 mb-2">
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Compress PDF to 500KB</h3>
                <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">Visa &amp; Government Portals</span>
              </div>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                Immigration portals, visa application services, tax authorities, and legal filing systems frequently enforce a strict 500KB cap per uploaded document. When documents contain scanned receipts or identity card photos, reaching 500KB requires minimizing image payload.
              </p>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Practical method:</strong> If your PDF is an image scan that remains over 500KB after compression, extract the pages using our <a href="/tools/pdf-to-jpg" class="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">PDF to JPG</a> tool, downscale pixel dimensions or reduce quality with our <a href="/tools/image-resizer" class="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Image Resizer</a> or <a href="/tools/image-compressor" class="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Image Compressor</a>, then reassemble with <a href="/tools/jpg-to-pdf" class="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">JPG to PDF</a>.
              </p>
            </div>
            <div class="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <div class="flex items-center justify-between gap-2 mb-2">
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Compress PDF to 200KB</h3>
                <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">Strict Upload Limits</span>
              </div>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                Public recruitment exams, civil service portals, and digital certificate systems sometimes mandate ultra-compact PDF files under 200KB or even 100KB for single-page documents.
              </p>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Practical method:</strong> For 1- to 3-page text PDFs, Standard or Aggressive compression easily satisfies 200KB. For scanned certificates, ensure the scanning resolution was 150 DPI rather than 600 DPI, and convert color pages to grayscale if permissible.
              </p>
            </div>
            <div class="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <div class="flex items-center justify-between gap-2 mb-2">
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Reduce PDF Size for Upload &amp; Email</h3>
                <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">Sharing &amp; Bandwidth</span>
              </div>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                Standard email providers (including Gmail, Outlook, and Yahoo) bounce attachments exceeding 20MB–25MB, while corporate firewalls may restrict files over 10MB. Shrinking PDFs prevents failed deliveries and ensures recipients can review files instantly on mobile devices.
              </p>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Practical method:</strong> Run your file through Toolora's in-browser compressor to deflate internal streams before sending, saving bandwidth for both sender and recipient.
              </p>
            </div>
          </div>
          <div class="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
            <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2">Factors Determining How Much a PDF Can Shrink</h3>
            <ul class="list-disc pl-5 space-y-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <li><strong>Native vector text vs. scanned images:</strong> Pure text and vector typography compress rapidly with negligible overhead, whereas 300+ DPI photographic scans require image-level optimization.</li>
              <li><strong>Embedded fonts:</strong> Documents embedding entire font families rather than font subsets add substantial weight.</li>
              <li><strong>Existing stream compression:</strong> Files already processed with FlateDecode or exported with "Smallest File Size" presets leave little redundant structural data to strip.</li>
              <li><strong>Metadata &amp; revision histories:</strong> Aggressive mode cleans accumulated edit logs, author tags, and thumbnail caches.</li>
            </ul>
          </div>
        </section>

        <!-- Section 4: Compression Expectations & Quality -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <section id="compression-expectations" class="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">How Much Can a PDF Be Compressed?</h2>
            <div class="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Because PDF files vary widely in construction, compression ratios differ significantly depending on the document type:</p>
              <p><strong>Text-heavy PDFs:</strong> Documents created in Word or Docs typically experience 15% to 40% reduction through dictionary cleaning and stream deflating, though their starting size is already relatively compact.</p>
              <p><strong>Scanned &amp; image-heavy PDFs:</strong> If scanner software stored raw, uncompressed bitmaps (such as TIFF or uncompressed streams), savings can exceed 50% to 75%. However, if pages were already stored as compressed JPEGs, container repackaging saves 5% to 15% without re-sampling image pixels.</p>
              <p><strong>Already-optimized PDFs:</strong> If a document was previously compressed or exported using web presets in Adobe Acrobat, internal streams are already minimized. Toolora transparently provides diagnostic feedback when a document is already optimized.</p>
            </div>
          </section>

          <section id="quality-preservation" class="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">PDF Compression Without Losing Quality</h2>
            <div class="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Toolora employs lossless-style stream compression and object table optimization. Unlike crude online rasterizers that convert every page into a low-resolution JPEG image, our algorithm preserves the vector geometry of your document:</p>
              <p><strong>Razor-sharp vector text:</strong> Typography is rendered from embedded font outlines and vector coordinates, never blurred into pixels. Text remains selectable, copy-pasteable, and fully searchable.</p>
              <p><strong>High-resolution printing:</strong> Lines, diagrams, and corporate letterheads stay razor-sharp at any zoom level and print cleanly at 300+ DPI.</p>
              <p><strong>Safe for legal &amp; formal use:</strong> Digital signatures, form fields, and exact typographic layouts remain completely unaltered.</p>
            </div>
          </section>
        </div>

        <!-- Section 5: Why Compress a PDF? -->
        <section id="why-compress-pdf" class="mb-12">
          <h2 class="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Why Compress a PDF File?</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <h3 class="font-bold text-sm text-slate-900 dark:text-white mb-2">Email Attachment Limits</h3>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Avoid rejected emails and 25MB delivery bounce-backs by shrinking document attachments before sending.</p>
            </div>
            <div class="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <h3 class="font-bold text-sm text-slate-900 dark:text-white mb-2">Portal &amp; ATS Compliance</h3>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Satisfy strict 500KB, 1MB, or 2MB upload ceilings on job application portals, visa services, and tax forms.</p>
            </div>
            <div class="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <h3 class="font-bold text-sm text-slate-900 dark:text-white mb-2">Academic Submissions</h3>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Upload term papers, theses, and scanned assignments smoothly into Canvas, Blackboard, or Google Classroom.</p>
            </div>
            <div class="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <h3 class="font-bold text-sm text-slate-900 dark:text-white mb-2">Cloud &amp; Mobile Economy</h3>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Conserve storage quotas on Google Drive or iCloud and allow clients to view files rapidly on cellular data.</p>
            </div>
          </div>
        </section>

        <!-- Section 6: Why use Toolora's PDF Compressor? -->
        <section id="why-use-toolora" class="mb-12">
          <h2 class="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Why use Toolora's ${escapeHtml(tool.name)}?</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            ${(tool.whyUseDetailed || []).map((b) => `
              <div class="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
                <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2">${escapeHtml(b.title)}</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">${escapeHtml(b.description)}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Section 7: Client-Side Privacy & In-Browser Processing -->
        <section id="privacy-security" class="mb-12">
          <h2 class="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Is PDF Compression Safe and Private?</h2>
          <div class="p-6 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/10 space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>Conventional PDF converter websites upload your files over public networks to remote web servers, where documents are queued, decompressed, and temporarily stored in cloud storage buckets. For confidential financial tax filings, legal agreements, medical charts, or corporate resumes, remote processing creates significant security and privacy concerns.</p>
            <p>Toolora operates on a 100% client-side architecture: when you select a PDF, the binary document is parsed directly into an ArrayBuffer within your web browser's local memory using <code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs">pdf-lib</code> and WebAssembly / JavaScript. Stream optimization, cross-reference table rebuilds, and metadata stripping execute strictly on your device's CPU.</p>
            <p>No document data is ever transmitted across the internet to Toolora's servers or any third-party cloud infrastructure. Because your files never leave your device, Toolora provides guaranteed security for confidential tax returns, NDA-protected business plans, and personal records.</p>
          </div>
        </section>

        <!-- Section 8: Frequently Asked Questions -->
        <section id="faq" class="mb-12">
          <h2 class="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <div class="space-y-4">
            ${tool.faqs.map((f) => `
              <div class="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">${escapeHtml(f.question)}</h3>
                <p class="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">${escapeHtml(f.answer)}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Section 9: Related Online Tools -->
        <section id="related-tools" class="mb-12">
          <h2 class="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Related Online Tools</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-6">Explore complementary utilities that pair seamlessly with ${escapeHtml(tool.name)}.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${(tool.relatedLinks || []).map((link) => `
              <a href="/tools/${link.slug}" class="block p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-indigo-500 transition group">
                <h3 class="text-base font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline mb-1">${escapeHtml(link.anchorText)}</h3>
                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400">${escapeHtml(link.description)}</p>
              </a>
            `).join('')}
          </div>
        </section>
      `;
    } else if (tool) {
      mainContent = `
        <nav aria-label="Breadcrumb" class="mb-6 text-sm text-slate-500">
          <ol class="flex items-center gap-2">
            <li><a href="/" class="hover:underline">Home</a></li>
            <li>/</li>
            <li><a href="/tools" class="hover:underline">Tools</a></li>
            <li>/</li>
            <li class="font-semibold text-slate-800 dark:text-slate-200">${escapeHtml(tool.name)}</li>
          </ol>
        </nav>
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">${escapeHtml(tool.h1Title)}</h1>
        <p class="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">${escapeHtml(tool.longDescription)}</p>
        <div class="p-8 mb-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-center">
          <p class="font-medium text-slate-700 dark:text-slate-300">Toolora interactive ${escapeHtml(tool.name)} is loaded in your browser.</p>
        </div>
        <section class="mb-12">
          <h2 class="text-2xl font-bold mb-4 text-slate-900 dark:text-white">What is ${escapeHtml(tool.name)}?</h2>
          ${tool.whatIsParagraphs.map((p) => `<p class="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">${escapeHtml(p)}</p>`).join('')}
        </section>
        <section class="mb-12">
          <h2 class="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <div class="space-y-4">
            ${tool.faqs.map((f) => `
              <div class="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">${escapeHtml(f.question)}</h3>
                <p class="text-slate-600 dark:text-slate-400">${escapeHtml(f.answer)}</p>
              </div>
            `).join('')}
          </div>
        </section>
      `;
    }
  } else if (isCategory) {
    const catId = route.path.replace('/category/', '');
    const cat = CATEGORIES.find((c) => c.id === catId);
    const categoryTools = TOOLS.filter((t) => t.category === catId);
    mainContent = `
      <nav aria-label="Breadcrumb" class="mb-6 text-sm text-slate-500">
        <ol class="flex items-center gap-2">
          <li><a href="/" class="hover:underline">Home</a></li>
          <li>/</li>
          <li class="font-semibold text-slate-800 dark:text-slate-200">${cat ? escapeHtml(cat.name) : 'Category'}</li>
        </ol>
      </nav>
      <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">Free ${cat ? escapeHtml(cat.name) : ''} Tools Online</h1>
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-8">${cat ? escapeHtml(cat.description) : ''}</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${categoryTools.map(
          (t) => `
          <a href="/tools/${t.slug}" class="block p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:shadow-lg transition">
            <h2 class="text-lg font-bold mb-2 text-slate-900 dark:text-white">${escapeHtml(t.name)}</h2>
            <p class="text-sm text-slate-600 dark:text-slate-400">${escapeHtml(t.shortDescription)}</p>
          </a>
        `
        ).join('')}
      </div>
    `;
  } else {
    // Informational page (/about, /privacy-policy, etc.)
    const cleanHeading = route.title.split('—')[0].trim();
    mainContent = `
      <nav aria-label="Breadcrumb" class="mb-6 text-sm text-slate-500">
        <ol class="flex items-center gap-2">
          <li><a href="/" class="hover:underline">Home</a></li>
          <li>/</li>
          <li class="font-semibold text-slate-800 dark:text-slate-200">${escapeHtml(cleanHeading)}</li>
        </ol>
      </nav>
      <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">${escapeHtml(cleanHeading)}</h1>
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">${escapeHtml(route.description)}</p>
    `;
  }

  return `
    <header class="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur sticky top-0 z-10 py-4 px-6">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <a href="/" class="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">Toolora</a>
        <nav class="hidden md:flex items-center gap-6 text-sm font-medium">
          ${navLinks.map((l) => `<a href="${l.href}" class="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">${l.label}</a>`).join('')}
        </nav>
      </div>
    </header>
    <main class="max-w-6xl mx-auto px-6 py-10">${mainContent}</main>
    <footer class="border-t border-slate-200 dark:border-slate-800 mt-20 py-10 px-6 bg-slate-50 dark:bg-slate-950 text-slate-500 text-sm">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p>&copy; ${new Date().getFullYear()} Toolora. 100% Client-Side Privacy Guaranteed.</p>
        <div class="flex items-center gap-6">
          <a href="/about" class="hover:underline">About</a>
          <a href="/privacy-policy" class="hover:underline">Privacy Policy</a>
          <a href="/terms" class="hover:underline">Terms</a>
          <a href="/contact" class="hover:underline">Contact</a>
          <a href="/disclaimer" class="hover:underline">Disclaimer</a>
        </div>
      </div>
    </footer>
  `;
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

    html = html.replace(
      /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
      scriptTag
    );
  }

  // 7. Inject pre-rendered semantic body inside <div id="root"> so search crawlers and lynx/curl get full content & visible H1
  const bodyHtml = generatePreRenderedBody(route);
  html = html.replace(
    /<div id="root"><\/div>/i,
    `<div id="root">${bodyHtml}</div>`
  );

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
