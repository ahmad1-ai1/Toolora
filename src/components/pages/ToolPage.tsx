import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Share2,
  Sparkles,
  Link as LinkIcon,
} from 'lucide-react';
import { ToolMetadata } from '../../types';
import { TOOLS, CATEGORIES } from '../../data/tools';
import { ToolIcon } from '../common/ToolIcon';
import { ToolCard } from '../common/ToolCard';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { AdSlot } from '../common/AdSlot';
import { useTheme } from '../../context/ThemeContext';
import { Link } from '../../context/RouterContext';
import { SeoHead } from '../seo/SeoHead';
import { SITE_URL, getCanonicalUrl } from '../../config/seo';

// Import all 10 tools
import { ImageCompressor } from '../tools/ImageCompressor';
import { PdfCompressor } from '../tools/PdfCompressor';
import { JpgToPdf } from '../tools/JpgToPdf';
import { PdfToJpg } from '../tools/PdfToJpg';
import { ImageResizer } from '../tools/ImageResizer';
import { WordCounter } from '../tools/WordCounter';
import { QrCodeGenerator } from '../tools/QrCodeGenerator';
import { JsonFormatter } from '../tools/JsonFormatter';
import { PercentageCalculator } from '../tools/PercentageCalculator';
import { AgeCalculator } from '../tools/AgeCalculator';

interface ToolPageProps {
  tool: ToolMetadata;
}

export const ToolPage: React.FC<ToolPageProps> = ({ tool }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Find category info
  const categoryInfo = CATEGORIES.find((c) => c.id === tool.category);

  // Related tools
  const relatedTools = TOOLS.filter((t) =>
    tool.relatedToolSlugs.includes(t.slug)
  );

  const canonicalPath = `/tools/${tool.slug}`;
  const canonicalUrl = getCanonicalUrl(canonicalPath);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: tool.seoTitle,
          text: tool.metaDescription,
          url: canonicalUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(canonicalUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const renderToolComponent = () => {
    switch (tool.slug) {
      case 'image-compressor':
        return <ImageCompressor />;
      case 'pdf-compressor':
        return <PdfCompressor />;
      case 'jpg-to-pdf':
        return <JpgToPdf />;
      case 'pdf-to-jpg':
        return <PdfToJpg />;
      case 'image-resizer':
        return <ImageResizer />;
      case 'word-counter':
        return <WordCounter />;
      case 'qr-code-generator':
        return <QrCodeGenerator />;
      case 'json-formatter':
        return <JsonFormatter />;
      case 'percentage-calculator':
        return <PercentageCalculator />;
      case 'age-calculator':
        return <AgeCalculator />;
      default:
        return (
          <div className="p-8 text-center text-gray-400">
            Tool under maintenance. Please try again in a moment.
          </div>
        );
    }
  };

  // Structured Data (JSON-LD)
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
      name: 'Toolora',
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

  const breadcrumbItems =
    tool.slug === 'image-compressor' || tool.slug === 'pdf-compressor'
      ? [
          { label: 'Tools', href: '/tools' },
          { label: tool.name },
        ]
      : [
          { label: 'Tools', href: '/tools' },
          {
            label: categoryInfo ? categoryInfo.name : 'Category',
            href: categoryInfo ? `/category/${categoryInfo.id}` : '/tools',
          },
          { label: tool.name },
        ];

  return (
    <div className="min-h-screen py-6 sm:py-10">
      {/* Dynamic SEO Head with canonical, meta, and JSON-LD */}
      <SeoHead
        title={tool.seoTitle}
        description={tool.metaDescription}
        path={canonicalPath}
        ogType="website"
        structuredData={[
          webAppSchema,
          breadcrumbSchema,
          ...(howToSchema ? [howToSchema] : []),
          faqSchema,
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumbs (Semantic HTML) */}
        <div className="flex items-center justify-between">
          <Breadcrumbs items={breadcrumbItems} />

          <button
            onClick={handleShare}
            aria-label={`Share ${tool.name}`}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isDark
                ? 'border-[#262c3a] bg-[#12151c] text-gray-300 hover:bg-[#181c25]'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>{copiedLink ? 'Link Copied!' : 'Share Tool'}</span>
          </button>
        </div>

        {/* Tool Header Section: Exactly ONE Primary H1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <ToolIcon name={tool.iconName} className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white font-display">
                  {tool.h1Title}
                </h1>
                {tool.isPopular && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Sparkles className="w-3 h-3" />
                    Popular
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-0.5">
                {tool.shortDescription}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              100% Client-Side Privacy
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              Instant Browser Processing
            </span>
            <span>•</span>
            <span>Zero Server Uploads</span>
          </div>
        </div>

        {/* Interactive Tool Main Workbench */}
        <main
          id={`tool-workbench-${tool.slug}`}
          className={`p-4 sm:p-8 rounded-3xl border shadow-sm ${
            isDark ? 'bg-[#0f1117] border-[#1f2430]' : 'bg-white border-gray-200'
          }`}
        >
          {renderToolComponent()}
        </main>

        {/* Reserved Ad Slot Between Workbench and SEO Content */}
        <AdSlot id="tool-mid-banner" label="Sponsored Resource" />

        {/* SEO SECTION 1: What is [Tool Name]? */}
        <section
          id="what-is-tool"
          className={`p-6 sm:p-8 rounded-3xl border ${
            isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
          }`}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
            What is {tool.name}?
          </h2>
          <div className="space-y-3.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {tool.whatIsParagraphs && tool.whatIsParagraphs.length > 0 ? (
              tool.whatIsParagraphs.map((para, i) => <p key={i}>{para}</p>)
            ) : (
              <p>{tool.longDescription}</p>
            )}
          </div>
        </section>

        {/* SEO SECTION 2: How to use [Tool Name] */}
        <section
          id="how-to-use"
          className={`p-6 sm:p-8 rounded-3xl border ${
            isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
          }`}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {tool.slug === 'image-compressor'
              ? 'How to Compress an Image Online'
              : `How to use ${tool.name}`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tool.howToSteps.map((step, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                  isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                  {idx + 1}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed pt-0.5">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* IMAGE COMPRESSOR SPECIALIZED SECTION: Target File Size Guide */}
        {tool.slug === 'image-compressor' && (
          <section
            id="target-file-size"
            className={`p-6 sm:p-8 rounded-3xl border ${
              isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
            }`}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Compress Images to a Specific File Size
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-6">
              Whether you are submitting documents to an official job or visa application portal, attaching assets to an email, or optimizing images for web performance, you often need to reduce image size in KB to satisfy strict file size caps. Because compression algorithms analyze color variance, high-frequency textures, and original pixel dimensions, no single quality setting will produce an identical file size across different photos. However, you can easily hit common thresholds like 200KB, 100KB, or 50KB by using a systematic approach.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div
                className={`p-5 rounded-2xl border flex flex-col justify-between ${
                  isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                      Compress Photo to 50KB or 20KB
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      Portals & Visas
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                    Strict caps between 20KB and 50KB are customary for passport pictures, visa applications, digital signatures, and government exam upload forms. Because camera sensors record photos at 12 to 48 megapixels (often 4MB to 10MB), compressing a photo to 50KB through compression quality alone may cause severe blurriness.
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    <strong className="text-gray-900 dark:text-white">Practical method:</strong> First scale down pixel dimensions (for example, to 600×600 or 800×600 pixels) using our{' '}
                    <Link
                      href="/tools/image-resizer"
                      className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                      Resize an image online
                    </Link>{' '}
                    tool. Then select JPG or WebP format with quality set between 55% and 65% until your file satisfies the required limit.
                  </p>
                </div>
              </div>

              <div
                className={`p-5 rounded-2xl border flex flex-col justify-between ${
                  isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                      Compress Image to 100KB
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      Web & Newsletters
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                    A 100KB limit is the most popular benchmark for email newsletter headers, blog thumbnail graphics, and customer support ticket attachments. This target maintains vibrant colors without bloating inbox transfer sizes.
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    <strong className="text-gray-900 dark:text-white">Practical method:</strong> Upload your picture and adjust the quality slider to around 70%–75%. If your file remains slightly above 100KB, nudge the quality slider down in 5% increments or moderately trim excess pixel dimensions.
                  </p>
                </div>
              </div>

              <div
                className={`p-5 rounded-2xl border flex flex-col justify-between ${
                  isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                      Compress Image to 200KB
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      Hero Banners & Storefronts
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                    Webmasters and e-commerce designers regularly aim to compress image to 200KB for full-width website hero banners, landing page illustrations, and product zoom galleries. This delivers a crisp visual presentation on high-DPI Retina screens while comfortably passing Google Core Web Vitals Largest Contentful Paint (LCP) performance audits.
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    <strong className="text-gray-900 dark:text-white">Practical method:</strong> Select 80%–85% quality in JPG or WebP mode. For standard 1920×1080 web images, this easily reduces raw camera files from 5MB down to approximately 150KB–200KB.
                  </p>
                </div>
              </div>

              <div
                className={`p-5 rounded-2xl border flex flex-col justify-between ${
                  isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                      500KB to 1MB Targets
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
                      Portfolios & Prints
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                    For architectural galleries, photography lookbooks, client proof sheets, and presentation decks, retaining fine textures and smooth gradients is critical.
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    <strong className="text-gray-900 dark:text-white">Practical method:</strong> Set the quality slider to 90% in JPG or WebP. This preserves near-lossless pixel fidelity while stripping bloated EXIF camera metadata and color profiles.
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`p-5 rounded-2xl border ${
                isDark ? 'bg-[#141720] border-[#222733]' : 'bg-indigo-50/50 border-indigo-100'
              }`}
            >
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">
                Practical Steps for Hitting an Exact File Size Target
              </h3>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                <li>
                  <strong>Choose JPG or WebP for photographs:</strong> Avoid raw PNG for photographs because PNG uses lossless compression, producing files 3x to 5x larger than JPG.
                </li>
                <li>
                  <strong>Reduce image dimensions when needed:</strong> If starting from a high-resolution camera photo (e.g. 4000px wide), downsize dimensions first using our{' '}
                  <Link
                    href="/tools/image-resizer"
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    Free Image Resizer
                  </Link>.
                </li>
                <li>
                  <strong>Lower compression quality gradually:</strong> Adjust the slider in 5% to 10% increments rather than jumping directly to the lowest value.
                </li>
                <li>
                  <strong>Check resulting file size:</strong> Examine the real-time calculated size badge and repeat until the required KB ceiling is reached.
                </li>
              </ol>
            </div>
          </section>
        )}

        {/* IMAGE COMPRESSOR SPECIALIZED SECTION: Format Comparison Table */}
        {tool.slug === 'image-compressor' && (
          <section
            id="format-comparison"
            className={`p-6 sm:p-8 rounded-3xl border ${
              isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
            }`}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
              JPG vs PNG vs WebP: Which Format Should You Use?
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-6">
              Selecting the appropriate image format is just as important as adjusting the compression slider. Each format relies on distinct encoding algorithms tailored for specific image types and web use cases.
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr
                    className={`border-b ${
                      isDark ? 'border-gray-800 text-gray-300' : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <th className="py-3 px-3 sm:px-4 font-bold">Format</th>
                    <th className="py-3 px-3 sm:px-4 font-bold">Best For</th>
                    <th className="py-3 px-3 sm:px-4 font-bold">Compression</th>
                    <th className="py-3 px-3 sm:px-4 font-bold">Transparency</th>
                    <th className="py-3 px-3 sm:px-4 font-bold">Typical Use</th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    isDark ? 'divide-gray-800 text-gray-400' : 'divide-gray-100 text-gray-600'
                  }`}
                >
                  <tr>
                    <td className="py-3 px-3 sm:px-4 font-semibold text-gray-900 dark:text-white">
                      JPG / JPEG
                    </td>
                    <td className="py-3 px-3 sm:px-4">Photographs & complex scenery</td>
                    <td className="py-3 px-3 sm:px-4">Lossy (discrete cosine transform)</td>
                    <td className="py-3 px-3 sm:px-4">No (fills with solid white)</td>
                    <td className="py-3 px-3 sm:px-4">
                      Web articles, camera photos, social media uploads, email attachments
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 sm:px-4 font-semibold text-gray-900 dark:text-white">
                      PNG
                    </td>
                    <td className="py-3 px-3 sm:px-4">Logos, icons, text & screenshots</td>
                    <td className="py-3 px-3 sm:px-4">Lossless (DEFLATE algorithm)</td>
                    <td className="py-3 px-3 sm:px-4">Yes (full alpha channel)</td>
                    <td className="py-3 px-3 sm:px-4">
                      Brand logos, transparent website assets, UI mockups, infographics
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 sm:px-4 font-semibold text-gray-900 dark:text-white">
                      WebP
                    </td>
                    <td className="py-3 px-3 sm:px-4">Modern web publishing & Core Web Vitals</td>
                    <td className="py-3 px-3 sm:px-4">Lossy & Lossless options</td>
                    <td className="py-3 px-3 sm:px-4">Yes (in lossy and lossless)</td>
                    <td className="py-3 px-3 sm:px-4">
                      High-speed websites, e-commerce storefronts, progressive web apps
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                <strong className="text-gray-900 dark:text-white">When to choose JPG:</strong> JPG is generally suitable for photographs and continuous-tone imagery because gradual color transitions compress efficiently without conspicuous visual artifacts. Note that JPG does not support alpha transparency; transparent areas are filled with solid white during export.
              </p>
              <p>
                <strong className="text-gray-900 dark:text-white">When to choose PNG:</strong> PNG is useful when transparency or lossless quality matters. Company emblems, transparent navigation badges, and screenshots containing crisp text stay sharp without blurry compression halos. However, saving photographic imagery as PNG results in substantially heavier file sizes.
              </p>
              <p>
                <strong className="text-gray-900 dark:text-white">When to choose WebP:</strong> Developed by Google, WebP can provide efficient compression for supported web workflows, reducing file sizes by 25%–35% compared to JPG at equivalent perceptual quality while supporting transparency. Although universally supported in contemporary web browsers, some legacy image viewers or specialized document submission portals still mandate traditional JPG or PNG files.
              </p>
            </div>
          </section>
        )}

        {/* PDF COMPRESSOR SPECIALIZED SECTION 1: Target File Size Guide */}
        {tool.slug === 'pdf-compressor' && (
          <section
            id="target-file-size"
            className={`p-6 sm:p-8 rounded-3xl border ${
              isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
            }`}
          >
            <div className="max-w-3xl mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Compress PDF to a Specific File Size
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Whether you need to reduce PDF file size for application upload portals, satisfy strict email attachment quotas, or optimize heavy reports for fast web viewing, achieving an exact file size target requires understanding document composition. Because PDF documents combine text layers, embedded fonts, vector linework, and raster graphics, no automated tool can guarantee an exact byte weight without analyzing internal elements. However, by applying the right optimization workflow, you can reliably compress PDF to 1MB, 500KB, or 200KB.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div
                className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                    Compress PDF to 1MB
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    Email &amp; Job Applications
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                  A 1MB file size limit is standard for corporate applicant tracking systems (such as Workday, Taleo, and Greenhouse), university submission portals, and email attachments. Multi-page resumes, academic research papers, and pitch decks exported from Microsoft Word, Google Docs, or InDesign frequently weigh 3MB to 8MB due to uncompressed internal object streams.
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  <strong>Practical method:</strong> Upload your document and select Aggressive mode to strip non-essential metadata and repack object streams. For clean vector documents, this almost always brings files well beneath 1MB.
                </p>
              </div>

              <div
                className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                    Compress PDF to 500KB
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    Visa &amp; Government Portals
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                  Immigration portals, visa application services, tax authorities, and legal filing systems frequently enforce a strict 500KB cap per uploaded document. When documents contain scanned receipts or identity card photos, reaching 500KB requires minimizing image payload.
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  <strong>Practical method:</strong> If your PDF is an image scan that remains over 500KB after compression, extract the pages using our <Link href="/tools/pdf-to-jpg" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">PDF to JPG</Link> tool, downscale pixel dimensions or reduce quality with our <Link href="/tools/image-resizer" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Image Resizer</Link> or <Link href="/tools/image-compressor" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Image Compressor</Link>, then reassemble with <Link href="/tools/jpg-to-pdf" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">JPG to PDF</Link>.
                </p>
              </div>

              <div
                className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                    Compress PDF to 200KB
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    Strict Upload Limits
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                  Public recruitment exams, civil service portals, and digital certificate systems sometimes mandate ultra-compact PDF files under 200KB or even 100KB for single-page documents.
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  <strong>Practical method:</strong> For 1- to 3-page text PDFs, Standard or Aggressive compression easily satisfies 200KB. For scanned certificates, ensure the scanning resolution was 150 DPI rather than 600 DPI, and convert color pages to grayscale if permissible.
                </p>
              </div>

              <div
                className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                    Reduce PDF Size for Upload &amp; Email
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    Sharing &amp; Bandwidth
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                  Standard email providers (including Gmail, Outlook, and Yahoo) bounce attachments exceeding 20MB–25MB, while corporate firewalls may restrict files over 10MB. Shrinking PDFs prevents failed deliveries and ensures recipients can review files instantly on mobile devices.
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  <strong>Practical method:</strong> Run your file through Toolora's in-browser compressor to deflate internal streams before sending, saving bandwidth for both sender and recipient.
                </p>
              </div>
            </div>

            <div
              className={`p-5 rounded-2xl border ${
                isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">
                Factors Determining How Much a PDF Can Shrink
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <li>
                  <strong>Native vector text vs. scanned images:</strong> Pure text and vector typography compress rapidly with negligible overhead, whereas 300+ DPI photographic scans require image-level optimization.
                </li>
                <li>
                  <strong>Embedded fonts:</strong> Documents embedding entire font families rather than font subsets add substantial weight.
                </li>
                <li>
                  <strong>Existing stream compression:</strong> Files already processed with FlateDecode or exported with "Smallest File Size" presets leave little redundant structural data to strip.
                </li>
                <li>
                  <strong>Metadata &amp; revision histories:</strong> Aggressive mode cleans accumulated edit logs, author tags, and thumbnail caches.
                </li>
              </ul>
            </div>
          </section>
        )}

        {/* PDF COMPRESSOR SPECIALIZED SECTION 2: Compression Expectations & Quality */}
        {tool.slug === 'pdf-compressor' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section
              id="compression-expectations"
              className={`p-6 sm:p-8 rounded-3xl border flex flex-col justify-between ${
                isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
              }`}
            >
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  How Much Can a PDF Be Compressed?
                </h2>
                <div className="space-y-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p>
                    Because PDF files vary widely in construction, compression ratios differ significantly depending on the document type:
                  </p>
                  <p>
                    <strong>Text-heavy PDFs:</strong> Documents created in Word or Docs typically experience 15% to 40% reduction through dictionary cleaning and stream deflating, though their starting size is already relatively compact.
                  </p>
                  <p>
                    <strong>Scanned &amp; image-heavy PDFs:</strong> If scanner software stored raw, uncompressed bitmaps (such as TIFF or uncompressed streams), savings can exceed 50% to 75%. However, if pages were already stored as compressed JPEGs, container repackaging saves 5% to 15% without re-sampling image pixels.
                  </p>
                  <p>
                    <strong>Already-optimized PDFs:</strong> If a document was previously compressed or exported using web presets in Adobe Acrobat, internal streams are already minimized. Toolora transparently provides diagnostic feedback when a document is already optimized.
                  </p>
                </div>
              </div>
            </section>

            <section
              id="quality-preservation"
              className={`p-6 sm:p-8 rounded-3xl border flex flex-col justify-between ${
                isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
              }`}
            >
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  PDF Compression Without Losing Quality
                </h2>
                <div className="space-y-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p>
                    Toolora employs lossless-style stream compression and object table optimization. Unlike crude online rasterizers that convert every page into a low-resolution JPEG image, our algorithm preserves the vector geometry of your document:
                  </p>
                  <p>
                    <strong>Razor-sharp vector text:</strong> Typography is rendered from embedded font outlines and vector coordinates, never blurred into pixels. Text remains selectable, copy-pasteable, and fully searchable.
                  </p>
                  <p>
                    <strong>High-resolution printing:</strong> Lines, diagrams, and corporate letterheads stay razor-sharp at any zoom level and print cleanly at 300+ DPI.
                  </p>
                  <p>
                    <strong>Safe for legal &amp; formal use:</strong> Digital signatures, form fields, and exact typographic layouts remain completely unaltered.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* PDF COMPRESSOR SPECIALIZED SECTION 3: Why Compress a PDF? */}
        {tool.slug === 'pdf-compressor' && (
          <section
            id="why-compress-pdf"
            className={`p-6 sm:p-8 rounded-3xl border ${
              isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
            }`}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Why Compress a PDF File?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">
                  Email Attachment Limits
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  Avoid rejected emails and 25MB delivery bounce-backs by shrinking document attachments before sending.
                </p>
              </div>

              <div
                className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">
                  Portal &amp; ATS Compliance
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  Satisfy strict 500KB, 1MB, or 2MB upload ceilings on job application portals, visa services, and tax forms.
                </p>
              </div>

              <div
                className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">
                  Academic Submissions
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  Upload term papers, theses, and scanned assignments smoothly into Canvas, Blackboard, or Google Classroom.
                </p>
              </div>

              <div
                className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">
                  Cloud &amp; Mobile Economy
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  Conserve storage quotas on Google Drive or iCloud and allow clients to view files rapidly on cellular data.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* SEO SECTION 3: Why use Toolora's [Tool Name]? */}
        <section
          id="why-use-toolora"
          className={`p-6 sm:p-8 rounded-3xl border ${
            isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
          }`}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Why use Toolora's {tool.name}?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {tool.whyUseDetailed && tool.whyUseDetailed.length > 0 ? (
              tool.whyUseDetailed.map((benefit, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border flex flex-col justify-between ${
                    isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                        {benefit.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              tool.whyUse.map((reason, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border flex items-start gap-2.5 ${
                    isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    {reason}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* IMAGE COMPRESSOR SPECIALIZED SECTION: Client-Side Privacy & In-Browser Processing */}
        {tool.slug === 'image-compressor' && (
          <section
            id="privacy-security"
            className={`p-6 sm:p-8 rounded-3xl border ${
              isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Client-Side Privacy & In-Browser Processing
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  How Toolora safeguards your private photos and scanned documents.
                </p>
              </div>
            </div>
            <div className="space-y-3.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                Conventional online converters upload your personal files over public networks to remote web servers, where pictures are queued, compressed, and stored in temporary cloud buckets. This model introduces latency and potential data privacy concerns.
              </p>
              <p>
                Toolora operates on a purely client-side architecture: when you select an image, it is decoded into local memory inside your web browser via standard HTML5 Canvas APIs (<code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-indigo-500 text-xs font-mono">drawImage</code> and <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-indigo-500 text-xs font-mono">toBlob</code>). Compression is calculated using your device's own hardware resources.
              </p>
              <p>
                No image data is ever transmitted across the internet to our servers or third-party cloud services. Because your files never leave your device, Toolora is safe for compressing sensitive identification records, passports, contracts, and confidential personal photographs.
              </p>
            </div>
          </section>
        )}

        {/* PDF COMPRESSOR SPECIALIZED SECTION: Client-Side Privacy & In-Browser Processing */}
        {tool.slug === 'pdf-compressor' && (
          <section
            id="privacy-security"
            className={`p-6 sm:p-8 rounded-3xl border ${
              isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Is PDF Compression Safe and Private?
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  100% In-Browser Execution — Zero Server Uploads
                </p>
              </div>
            </div>
            <div className="space-y-3.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                Conventional PDF converter websites upload your files over public networks to remote web servers, where documents are queued, decompressed, and temporarily stored in cloud storage buckets. For confidential financial tax filings, legal agreements, medical charts, or corporate resumes, remote processing creates significant security and privacy concerns.
              </p>
              <p>
                Toolora operates on a 100% client-side architecture: when you select a PDF, the binary document is parsed directly into an ArrayBuffer within your web browser's local memory using <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-indigo-500 text-xs font-mono">pdf-lib</code> and WebAssembly / JavaScript. Stream optimization, cross-reference table rebuilds, and metadata stripping execute strictly on your device's CPU.
              </p>
              <p>
                No document data is ever transmitted across the internet to Toolora's servers or any third-party cloud infrastructure. Because your files never leave your device, Toolora provides guaranteed security for confidential tax returns, NDA-protected business plans, and personal records.
              </p>
            </div>
          </section>
        )}

        {/* SEO SECTION 4: Frequently Asked Questions (FAQ) */}
        {tool.faqs.length > 0 && (
          <section
            id="faq"
            className={`p-6 sm:p-8 rounded-3xl border ${
              isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
            }`}
          >
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Common questions regarding {tool.name} capabilities, privacy, and output quality.
              </p>
            </div>

            <div className="space-y-3">
              {tool.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all ${
                      isOpen
                        ? isDark
                          ? 'border-indigo-500/30 bg-[#141720]'
                          : 'border-indigo-200 bg-indigo-50/20'
                        : isDark
                        ? 'border-[#1f242f] bg-[#12151c]'
                        : 'border-gray-200 bg-gray-50/50'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                    >
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-indigo-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-[#1c202a] pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SEO SECTION 5: Internal Linking & Related Tools */}
        <section id="related-tools" className="space-y-6 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Related Online Tools
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Explore complementary utilities that pair seamlessly with {tool.name}.
              </p>
            </div>
            <Link
              href="/tools"
              className="text-xs font-semibold text-indigo-500 hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Explore all {TOOLS.length} tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Descriptive Contextual Links */}
          {tool.relatedLinks && tool.relatedLinks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {tool.relatedLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={`/tools/${link.slug}`}
                  className={`p-4 rounded-2xl border transition-all hover:border-indigo-500/40 hover:-translate-y-0.5 ${
                    isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs sm:text-sm mb-1">
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>{link.anchorText}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {link.description}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {/* Related Tool Cards Grid */}
          {relatedTools.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTools.map((relTool) => (
                <ToolCard key={relTool.id} tool={relTool} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
