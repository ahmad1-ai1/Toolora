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

  const categoryLabel = tool.category === 'pdf' ? 'PDF Tools' : categoryInfo ? categoryInfo.name : 'Tools';
  const categoryPath = categoryInfo ? `/category/${categoryInfo.id}` : '/tools';

  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    itemListElement:
      tool.slug === 'image-compressor' || tool.slug === 'pdf-compressor'
        ? [
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
          ]
        : [
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
              name: categoryLabel,
              item: `${SITE_URL}${categoryPath}`,
            },
            {
              '@type': 'ListItem',
              position: 4,
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
      : tool.slug === 'jpg-to-pdf'
      ? {
          '@type': 'HowTo',
          '@id': `${canonicalUrl}#howto`,
          name: 'How to Convert JPG to PDF Online',
          description:
            'Step-by-step guide to converting and combining JPG, PNG, and WebP images into a single PDF document online for free using Toolora.',
          step: [
            {
              '@type': 'HowToStep',
              position: 1,
              name: 'Add your JPG, PNG, or WebP images',
              text: 'Add your JPG, PNG, or WebP images by dragging them into the drop zone or browsing your device files.',
            },
            {
              '@type': 'HowToStep',
              position: 2,
              name: 'Arrange the pages using the available Move Up / Move Down controls',
              text: 'Arrange the pages using the available Move Up / Move Down controls on each image card.',
            },
            {
              '@type': 'HowToStep',
              position: 3,
              name: 'Choose page size, orientation, and margins',
              text: 'Choose page size (A4, US Letter, or Fit to Image), orientation, and margins.',
            },
            {
              '@type': 'HowToStep',
              position: 4,
              name: 'Create and download the PDF',
              text: 'Click "Generate PDF" to assemble your document in browser memory, then download the finished PDF.',
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
            label: categoryLabel,
            href: categoryPath,
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
              : tool.slug === 'pdf-compressor'
              ? 'How to Compress a PDF Online'
              : tool.slug === 'jpg-to-pdf'
              ? 'How to Convert JPG to PDF Online'
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
                Whether you need to reduce PDF file size for application upload portals, email attachments, or web viewing, achieving a specific file-size target depends on the document's original contents. Because PDF documents combine text layers, embedded fonts, vector linework, and raster graphics, no automated tool can guarantee an exact byte weight without analyzing or altering internal elements. If your destination requires a PDF under 1MB, 500KB, or 200KB, compress the file and check the resulting size. If it is still above the required limit, additional document optimization or reducing image resolution may be necessary.
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
                    Application &amp; Email Portals
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                  Some application, academic, government, and other online portals may impose their own file-size limits, with 1MB often recommended for resumes, academic papers, and application documents. Always check the requirements of the specific portal before uploading.
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  <strong>Practical method:</strong> If your destination requires a PDF under 1MB, compress the file and check the resulting size. Upload your document and select Aggressive mode to strip non-essential metadata and repack object streams. If the document originated from uncompressed scans and remains over 1MB, additional document optimization or downscaling image resolution may be necessary.
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
                    Form &amp; Portal Ceiling
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                  Certain online services, visa submission systems, and document upload forms specify a 500KB limit per attachment. When documents contain scanned receipts or identity cards, reaching 500KB may require optimizing embedded image data.
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  <strong>Practical method:</strong> If your destination requires a PDF under 500KB, compress the file and check the resulting size. If your PDF is an image scan that remains over 500KB after compression, extract the pages using our <Link href="/tools/pdf-to-jpg" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">PDF to JPG</Link> tool, downscale pixel dimensions or reduce quality with our <Link href="/tools/image-resizer" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Image Resizer</Link> or <Link href="/tools/image-compressor" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Image Compressor</Link>, then reassemble with <Link href="/tools/jpg-to-pdf" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">JPG to PDF</Link>.
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
                  Some specialized portals, recruitment systems, or certificate archives mandate ultra-compact PDF files under 200KB. Always check the requirements of the specific portal before uploading.
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  <strong>Practical method:</strong> If your destination requires a PDF under 200KB, compress the file and check the resulting size. For text-only PDFs, standard or aggressive stream compression can often help meet this target. For scanned documents that remain above 200KB, scanning at lower resolution (such as 150 DPI) or converting color pages to grayscale before assembly is typically necessary.
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
                  Email attachment limits vary by provider. Compressing a PDF can make it easier to send when the original file is too large. Reducing document size also prevents failed deliveries and ensures recipients can review files quickly on mobile devices.
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
                    Compression results vary significantly depending on the PDF's images, fonts, structure, and how well it was compressed originally. No tool can promise a specific percentage reduction without inspecting the document's internal assets.
                  </p>
                  <p>
                    <strong>Text-heavy PDFs:</strong> Documents generated from text editors or word processors may see reductions from dictionary cleaning and stream deflating, though their starting size is often already compact.
                  </p>
                  <p>
                    <strong>Scanned &amp; image-heavy PDFs:</strong> If scanner software stored raw, uncompressed bitmaps or inefficient container streams, savings can be substantial. However, if pages were already stored as compressed images (like JPEGs), container repackaging alone will yield modest reduction without re-sampling image pixels.
                  </p>
                  <p>
                    <strong>Already-optimized PDFs:</strong> If a document was previously compressed or exported using compact web presets, internal streams are already minimized. Toolora provides clear diagnostic feedback when a document is already well optimized.
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
                  Email attachment limits vary by provider. Compressing a PDF can make it easier to send when the original file is too large.
                </p>
              </div>

              <div
                className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">
                  Portal &amp; Application Limits
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  Some application, academic, government, and other online portals may impose their own file-size limits. Always check the requirements of the specific portal before uploading.
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
                  Upload term papers, theses, and scanned assignments smoothly into educational course portals and review systems.
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
                  Conserve cloud storage space and allow recipients to view files quickly on mobile data connections.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* JPG TO PDF SPECIALIZED SECTIONS */}
        {tool.slug === 'jpg-to-pdf' && (
          <div className="space-y-8">
            {/* 1. Convert Multiple JPGs into One PDF */}
            <section
              id="multiple-jpg-to-pdf"
              className={`p-6 sm:p-8 rounded-3xl border ${
                isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
              }`}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Convert Multiple JPGs into One PDF
              </h2>
              <div className="space-y-3.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                <p>
                  Whether compiling a multi-page school assignment, a contract draft, or a batch of photo receipts, Toolora makes it easy to <strong>convert multiple JPGs into one PDF</strong> file. You can select single photos or batch-upload dozens of images simultaneously using our drag-and-drop zone or device file browser.
                </p>
                <p>
                  Our tool supports mixed format batches: you can combine JPG, JPEG, PNG, and WebP files into the same PDF document without converting them beforehand. Each photo is rendered into its own page card displaying a thumbnail preview, file name, and dimensions.
                </p>
                <p>
                  To ensure your document flows in the intended sequence, use the vertical <strong>Move Up</strong> and <strong>Move Down</strong> arrow controls on each image card. The top-left card becomes page 1, followed sequentially by each subsequent card. Once arranged, our in-browser engine compiles all pages into a cohesive multi-page PDF ready for instant download.
                </p>
              </div>
            </section>

            {/* 2. JPG to PDF Page Size Guide */}
            <section
              id="page-size-guide"
              className={`p-6 sm:p-8 rounded-3xl border ${
                isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
              }`}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                JPG to PDF Page Size Guide
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Choose the page format that best fits how your PDF will be read, shared, or printed. Toolora provides three standard page geometry modes:
              </p>

              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-gray-800 bg-[#141720]' : 'border-gray-200 bg-gray-50'}`}>
                      <th className="py-3 px-4 font-bold text-gray-900 dark:text-white">Page Size</th>
                      <th className="py-3 px-4 font-bold text-gray-900 dark:text-white">Best For</th>
                      <th className="py-3 px-4 font-bold text-gray-900 dark:text-white">Notes</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-200'}`}>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">A4</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">General documents and international printing</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Common international document format (210 × 297 mm / 595 × 842 pt)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">US Letter</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">US-focused documents and printing</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Common North American format (8.5 × 11 in / 612 × 792 pt)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">Fit to Image</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Photos and images</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Uses image dimensions rather than forcing a standard paper size</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">Orientation: Portrait vs. Landscape</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    Select <strong>Portrait</strong> for standard vertical paperwork, letters, scanned notes, and phone-captured documents. Select <strong>Landscape</strong> for wide charts, spreadsheets, presentations, and landscape photography. When <em>Fit to Image</em> is selected, orientation is automatically matched to each image's native aspect ratio.
                  </p>
                </div>
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">Margins: None, Small, and Standard</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    Choose <strong>None (0 pt)</strong> for edge-to-edge full-bleed display without borders. Choose <strong>Small (20 pt)</strong> for clean, subtle white borders around photos. Choose <strong>Standard (40 pt)</strong> to provide generous margins that prevent text or graphics from being clipped by printer margins.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Convert Photos and Scanned Images to PDF */}
            <section
              id="photos-scans-to-pdf"
              className={`p-6 sm:p-8 rounded-3xl border ${
                isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
              }`}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Convert Photos and Scanned Images to PDF
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Turning physical paper and camera photos into standardized digital PDF documents solves real day-to-day workflow needs:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">Receipts &amp; Invoices</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    Photograph paper receipts or expense bills with your phone and compile them into a single, organized monthly expense report PDF.
                  </p>
                </div>
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">Assignments &amp; Coursework</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    Photograph handwritten homework, notebook equations, diagrams, and project pages to submit a neat, multi-page document to instructors.
                  </p>
                </div>
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">Forms &amp; Contracts</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    Convert snapshots of signed agreements, lease papers, government notices, and paper certificates into standardized archival PDF files.
                  </p>
                </div>
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">Documents Photographed with a Phone</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    High-resolution smartphone cameras can replace bulky flatbed scanners. Standardize your photo scans onto uniform A4 or Letter sheets in seconds.
                  </p>
                </div>
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">Collections of Images</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    Group collections of screenshots, property photos, design drafts, or event photos into an orderly document that opens cleanly on any operating system.
                  </p>
                </div>
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">Meeting Notes &amp; Whiteboards</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    Capture whiteboard diagrams and meeting notes, arrange them chronologically, and distribute them to your team in a universal format.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. JPG to PDF on Mobile */}
            <section
              id="jpg-to-pdf-mobile"
              className={`p-6 sm:p-8 rounded-3xl border ${
                isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
              }`}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                JPG to PDF on Mobile
              </h2>
              <div className="space-y-3.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                <p>
                  Toolora is fully responsive and functions smoothly directly inside modern mobile web browsers, including Safari on iOS (iPhone and iPad) and Chrome on Android devices. You do not need to install an app from an app store or grant unnecessary device permissions to convert images to PDF.
                </p>
                <p>
                  <strong>iPhone &amp; iPad Workflow (Safari):</strong> Tap the upload drop zone to select pictures directly from your Photo Library, take a live photo with your camera, or browse documents stored in iCloud Drive or the local Files app. Use the Move Up and Move Down arrow controls to sequence pages, then tap Generate PDF to save the file directly to your device Downloads or share it via AirDrop, Mail, or Messages.
                </p>
                <p>
                  <strong>Android Workflow (Chrome):</strong> Tap browse files to select multiple photos from Google Photos or your local gallery. Configure your desired page dimensions and margins, compile the document in memory, and download the finished PDF directly to your device storage.
                </p>
              </div>
            </section>

            {/* 5. Client-Side Privacy */}
            <section
              id="client-side-privacy"
              className={`p-6 sm:p-8 rounded-3xl border ${
                isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
              }`}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                JPG to PDF Without Uploading Files
              </h2>
              <div className="p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/10 space-y-3.5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  Traditional online file converters require you to send your photos over the Internet to remote conversion servers. For sensitive paperwork such as driver's licenses, passports, tax forms, financial statements, medical records, or confidential business proposals, uploading files to third-party servers presents understandable privacy concerns.
                </p>
                <p>
                  Toolora runs on a client-side architecture: image reading, bitmap embedding, Canvas conversion, and PDF file construction take place entirely within your browser memory using the open-source <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-indigo-500 text-xs font-mono">pdf-lib</code> engine.
                </p>
                <p>
                  Because file processing is performed locally on your device, your images do not need to be uploaded to a remote conversion server. This in-browser execution model provides enhanced privacy and avoids queue wait times.
                </p>
              </div>
            </section>

            {/* 6. Image Quality & Compression */}
            <section
              id="image-quality-explained"
              className={`p-6 sm:p-8 rounded-3xl border ${
                isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
              }`}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Does JPG to PDF Reduce Image Quality?
              </h2>
              <div className="space-y-3.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                <p>
                  No. When you compile pictures with Toolora, your JPG and JPEG files are embedded directly into the PDF structure using native JPEG stream embedding (<code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-indigo-500 text-xs font-mono">embedJpg</code>). PNG files are embedded directly as native PNG streams (<code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-indigo-500 text-xs font-mono">embedPng</code>). WebP and other supported image formats are converted to standard image buffers in browser memory and embedded without loss of resolution.
                </p>
                <p>
                  The converter embeds your original image bitmaps into vector page containers at their native resolution without applying lossy downsampling. Text outlines, handwriting, signatures, and photographic colors retain their original fidelity.
                </p>
                <p>
                  <strong>Important Note on File Size:</strong> This tool does not provide an image compression or downsampling control. Converting images to PDF does not automatically make the file smaller. If you upload multiple uncompressed camera photos (for instance, five 6MB photos), the resulting PDF will naturally be approximately 30MB in size.
                </p>
              </div>
            </section>

            {/* 7. How to Make a JPG-to-PDF File Smaller */}
            <section
              id="make-pdf-smaller"
              className={`p-6 sm:p-8 rounded-3xl border ${
                isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
              }`}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                How to Make a JPG-to-PDF File Smaller
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                <p>
                  Because this converter is designed for document compilation rather than aggressive image compression, large source images will produce a proportionally large PDF. If your finished document needs to fit under email attachment limits or submission portal caps, you can optimize your file size using Toolora's dedicated tools:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'}`}>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">1. Compress Images First</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                      Optimize high-resolution JPG, PNG, and WebP pictures before compiling them into a document.
                    </p>
                    <Link
                      href="/tools/image-compressor"
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Free Image Compressor</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'}`}>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">2. Downscale Large Photo Dimensions</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                      Modern phone photos are often 4,000+ pixels wide. Resize them to standard document dimensions to save megabytes.
                    </p>
                    <Link
                      href="/tools/image-resizer"
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Resize an Image Online</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#141720] border-[#222733]' : 'bg-gray-50 border-gray-200'}`}>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">3. Compress the Finished PDF</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                      If your PDF has already been generated, optimize redundant internal structures and streams with our PDF compressor.
                    </p>
                    <Link
                      href="/tools/pdf-compressor"
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Free PDF Compressor</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
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
                  In-Browser Processing — No Remote Server Uploads
                </p>
              </div>
            </div>
            <div className="space-y-3.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                Conventional PDF converter websites upload your files over public networks to remote web servers, where documents are queued, decompressed, and temporarily stored in cloud storage buckets. For confidential financial tax filings, legal agreements, medical charts, or corporate resumes, remote processing creates significant security and privacy concerns.
              </p>
              <p>
                Toolora operates on a client-side architecture: when you select a PDF, the binary document is parsed directly into memory within your web browser using <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-indigo-500 text-xs font-mono">pdf-lib</code>. Stream optimization, cross-reference table rebuilds, and metadata stripping execute locally on your device.
              </p>
              <p>
                PDF processing takes place in your browser, so the PDF file does not need to be uploaded to a remote compression server. This in-browser approach provides enhanced privacy for tax forms, business documents, and personal records.
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
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${tool.relatedLinks.length === 4 ? 'lg:grid-cols-4' : 'md:grid-cols-3'} gap-3`}>
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
