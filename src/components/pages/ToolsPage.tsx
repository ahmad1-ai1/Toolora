import React, { useState } from 'react';
import {
  ImageIcon,
  FileText,
  Code2,
  Calculator,
  ShieldCheck,
  Zap,
  Lock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Link as LinkIcon,
  CheckCircle2,
} from 'lucide-react';
import { TOOLS } from '../../data/tools';
import { ToolCard } from '../common/ToolCard';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { AdSlot } from '../common/AdSlot';
import { useTheme } from '../../context/ThemeContext';
import { Link } from '../../context/RouterContext';
import { SeoHead } from '../seo/SeoHead';
import { SITE_URL } from '../../config/seo';

export const ToolsPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Group tools into 4 semantic categories
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

  // 7 Search-Intent Targeted FAQs
  const toolsFaqs = [
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

  // Structured Data (JSON-LD)
  const canonicalUrl = `${SITE_URL}/tools`;

  const collectionSchema = {
    '@type': 'CollectionPage',
    '@id': `${canonicalUrl}#collection`,
    url: canonicalUrl,
    name: 'Free Online Tools — Images, PDFs, Text & More | Toolora',
    description:
      'Explore Toolora’s directory of free online tools for image compression, PDF editing, text analysis, developer formatting, and everyday calculations. 100% private and browser-based.',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
    },
    mainEntity: {
      '@type': 'ItemList',
      '@id': `${canonicalUrl}#itemlist`,
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
        name: 'Free Online Tools',
        item: canonicalUrl,
      },
    ],
  };

  const faqSchema = {
    '@type': 'FAQPage',
    '@id': `${canonicalUrl}#faq`,
    mainEntity: toolsFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <div className="min-h-screen py-8 sm:py-12">
      {/* Dynamic SEO Meta Header */}
      <SeoHead
        title="Free Online Tools — Images, PDFs, Text & Calculators | Toolora"
        description="Explore our collection of free, fast, and privacy-friendly online tools for image compression, PDF conversion, text analysis, developer formatting, and math calculations."
        path="/tools"
        structuredData={[collectionSchema, breadcrumbSchema, faqSchema]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Free Online Tools' }]} />

        {/* Hero & Intro Section */}
        <header className="space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Tool Directory</span>
            </div>

            {/* Exactly ONE visible H1 on the page */}
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white font-display">
              Free Online Tools
            </h1>

            <p className="text-base sm:text-lg text-indigo-600 dark:text-indigo-400 font-medium">
              High-performance, browser-based utilities engineered for everyday productivity.
            </p>
          </div>

          {/* 300–500 Word Substantial SEO Introductory Guide */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border text-sm sm:text-base leading-relaxed space-y-4 ${
              isDark
                ? 'bg-[#10131a] border-[#1e232e] text-gray-300'
                : 'bg-white border-gray-200 text-gray-700'
            }`}
          >
            <p>
              Welcome to <strong>Toolora</strong>, your comprehensive suite of free online tools engineered for modern web productivity, digital media preparation, and rapid data processing. We created Toolora to remove the friction, paywalls, and intrusive software installations that too often complicate routine digital tasks. Whether you need to compress high-resolution photographs for a website, merge scanned receipts into a clean PDF, format deeply nested JSON payloads, count words for an editorial submission, or calculate exact percentages, Toolora delivers lightning-fast, high-precision results directly in your web browser.
            </p>
            <p>
              Every utility in our collection is <strong>100% free to use</strong> with no hidden fees, no subscription tiers, no usage caps, and no user registration required. Because our tools operate online as lightweight, responsive web applications, there is zero software to download or install. You never have to worry about operating system incompatibilities, administrative permissions, or bulky background executables consuming your device’s memory. Toolora runs smoothly across desktop workstations, laptops, tablets, and smartphones running any modern web browser.
            </p>
            <p>
              Our suite is organized into specialized modules designed to address distinct workflows:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
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

          {/* Quick Category Anchor Navigation */}
          <nav
            aria-label="Tool Categories"
            className="flex flex-wrap items-center gap-2 pt-2"
          >
            <span className="text-xs font-semibold text-gray-500 mr-1">
              Jump to Category:
            </span>
            <a
              href="#image-tools"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                isDark
                  ? 'border-[#222733] bg-[#12151c] text-gray-300 hover:bg-[#181c25] hover:text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
              <span>Image Tools</span>
            </a>
            <a
              href="#pdf-tools"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                isDark
                  ? 'border-[#222733] bg-[#12151c] text-gray-300 hover:bg-[#181c25] hover:text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>PDF Tools</span>
            </a>
            <a
              href="#text-developer-tools"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                isDark
                  ? 'border-[#222733] bg-[#12151c] text-gray-300 hover:bg-[#181c25] hover:text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Text &amp; Developer Tools</span>
            </a>
            <a
              href="#calculators-utilities"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                isDark
                  ? 'border-[#222733] bg-[#12151c] text-gray-300 hover:bg-[#181c25] hover:text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-indigo-500" />
              <span>Calculators &amp; Utilities</span>
            </a>
            <a
              href="#tools-faq"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                isDark
                  ? 'border-[#222733] bg-[#12151c] text-gray-300 hover:bg-[#181c25] hover:text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
              }`}
            >
              <span>Frequently Asked Questions</span>
            </a>
          </nav>
        </header>

        {/* CATEGORY 1: Image Tools */}
        <section id="image-tools" className="space-y-6 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-display">
                Image Tools
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Compress, resize, and optimize JPG, PNG, and WebP graphics client-side with zero loss in visual clarity.
              </p>
            </div>
          </div>

          {/* Tool Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {imageTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          {/* Strong Contextual Internal Links Between Tools */}
          <div
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5" />
                Connected Image Workflow
              </span>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                After reducing file weight with the{' '}
                <Link
                  href="/tools/image-compressor"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Free Image Compressor
                </Link>
                , adjust pixel dimensions using the{' '}
                <Link
                  href="/tools/image-resizer"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Free Image Resizer
                </Link>
                , or bundle multiple resized graphics into a single document with our{' '}
                <Link
                  href="/tools/jpg-to-pdf"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  JPG to PDF Converter
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Reserved Mid-Page Ad Slot */}
        <AdSlot id="tools-catalog-mid-banner" label="Sponsored Partner" />

        {/* CATEGORY 2: PDF Tools */}
        <section id="pdf-tools" className="space-y-6 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-display">
                PDF Tools
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Compress PDF documents, merge photos into professional PDFs, and extract high-resolution JPG pages securely.
              </p>
            </div>
          </div>

          {/* Tool Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pdfTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          {/* Strong Contextual Internal Links Between Tools */}
          <div
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5" />
                Connected Document Workflow
              </span>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                After combining images into a new file with the{' '}
                <Link
                  href="/tools/jpg-to-pdf"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  JPG to PDF Converter
                </Link>
                , shrink final attachment weight using the{' '}
                <Link
                  href="/tools/pdf-compressor"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Free PDF Compressor
                </Link>
                , or convert pages back into standalone pictures with the{' '}
                <Link
                  href="/tools/pdf-to-jpg"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  PDF to JPG Converter
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* CATEGORY 3: Text & Developer Tools */}
        <section id="text-developer-tools" className="space-y-6 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-display">
                Text &amp; Developer Tools
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Analyze word counts and reading metrics, validate and beautify JSON objects, and generate scannable QR codes.
              </p>
            </div>
          </div>

          {/* Tool Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {textDevTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          {/* Strong Contextual Internal Links Between Tools */}
          <div
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5" />
                Connected Coding &amp; Text Workflow
              </span>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                Inspect string lengths and token metrics with the{' '}
                <Link
                  href="/tools/word-counter"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Online Word Counter
                </Link>
                , parse and format structured API payloads with the{' '}
                <Link
                  href="/tools/json-formatter"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Online JSON Formatter &amp; Validator
                </Link>
                , or publish links to digital assets using the{' '}
                <Link
                  href="/tools/qr-code-generator"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Dynamic QR Code Generator
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* CATEGORY 4: Calculators & Utilities */}
        <section id="calculators-utilities" className="space-y-6 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-display">
                Calculators &amp; Utilities
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Calculate percentage increases, discounts, and margins, or determine exact chronological age across dates.
              </p>
            </div>
          </div>

          {/* Tool Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {calcTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          {/* Strong Contextual Internal Links Between Tools */}
          <div
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5" />
                Connected Calculator Workflow
              </span>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                Determine numerical growth or margin shifts with the{' '}
                <Link
                  href="/tools/percentage-calculator"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Online Percentage Calculator
                </Link>
                , calculate precise milestone time spans with the{' '}
                <Link
                  href="/tools/age-calculator"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Online Age Calculator
                </Link>
                , or generate direct mobile shortcuts to your calculations with the{' '}
                <Link
                  href="/tools/qr-code-generator"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Dynamic QR Code Generator
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section
          id="tools-faq"
          className={`p-6 sm:p-10 rounded-3xl border ${
            isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
          }`}
        >
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-display">
              Frequently Asked Questions About Free Online Tools
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Everything you need to know about our free, privacy-first web utilities suite.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {toolsFaqs.map((faq, idx) => {
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
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-indigo-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-[#1c202a] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
