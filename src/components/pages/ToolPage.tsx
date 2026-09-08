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

  return (
    <div className="min-h-screen py-6 sm:py-10">
      {/* Dynamic SEO Head with canonical, meta, and JSON-LD */}
      <SeoHead
        title={tool.seoTitle}
        description={tool.metaDescription}
        path={canonicalPath}
        structuredData={[webAppSchema, breadcrumbSchema, faqSchema]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumbs (Semantic HTML) */}
        <div className="flex items-center justify-between">
          <Breadcrumbs
            items={[
              { label: 'Tools', href: '/tools' },
              {
                label: categoryInfo ? categoryInfo.name : 'Category',
                href: categoryInfo ? `/category/${categoryInfo.id}` : '/tools',
              },
              { label: tool.name },
            ]}
          />

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
            How to use {tool.name}
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
