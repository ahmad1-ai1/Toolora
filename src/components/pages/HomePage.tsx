import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
  Globe,
  ArrowRight,
  CheckCircle2,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { TOOLS, CATEGORIES } from '../../data/tools';
import { ToolCard } from '../common/ToolCard';
import { AdSlot } from '../common/AdSlot';
import { ToolCategory } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Link } from '../../context/RouterContext';

interface HomePageProps {
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenSearch }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Filter tools based on category & inline search
  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.shortDescription.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const popularTools = TOOLS.filter((t) => t.isPopular);

  const homeFaqs = [
    {
      q: 'Are these tools completely free to use?',
      a: 'Yes, 100% free with no hidden paywalls, no watermarks, and no sign-up or credit card requirements.',
    },
    {
      q: 'How does client-side file processing protect my privacy?',
      a: 'When you upload an image or PDF, processing occurs inside your web browser’s local memory utilizing modern WebAssembly and Canvas APIs. The files are never transmitted to our servers or any cloud database.',
    },
    {
      q: 'Can I use OmniTools on my smartphone or tablet?',
      a: 'Yes. OmniTools is designed mobile-first with adaptive touch gestures, fluid layouts, and responsive interfaces tested across iOS and Android.',
    },
    {
      q: 'Do you keep copies of my converted files?',
      a: 'Never. Because the files are never received by our servers, it is technically impossible for us to view, store, or share your documents.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-gray-200/60 dark:border-[#1a1f29]">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast, Private &amp; Free Utilities</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white font-display">
            Everyday online tools,{' '}
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400 bg-clip-text text-transparent">
              built with privacy first.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Compress images, merge PDFs, generate QR codes, analyze text, and solve calculations in seconds — right inside your browser without uploading your files.
          </p>

          {/* Quick Search Bar */}
          <div className="max-w-xl mx-auto pt-2">
            <div
              className={`relative flex items-center rounded-2xl border shadow-sm transition-all ${
                isDark
                  ? 'bg-[#12151c] border-[#252c38] focus-within:border-indigo-500'
                  : 'bg-white border-gray-200 focus-within:border-indigo-500'
              }`}
            >
              <Search className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools (e.g. compress pdf, resize image, qr code)..."
                className="w-full px-3.5 py-3.5 bg-transparent text-sm sm:text-base outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
              />
              <button
                onClick={onOpenSearch}
                className="mr-3 px-2 py-1 text-[11px] font-mono text-gray-400 bg-gray-100 dark:bg-[#1a1f28] rounded-md border border-gray-200 dark:border-[#262c3a] hidden sm:block"
                title="Open command search"
              >
                ⌘K
              </button>
            </div>
          </div>

          {/* Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400 pt-3">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Client-Side
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Zap className="w-4 h-4 text-amber-500" />
              Zero Wait Queues
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Lock className="w-4 h-4 text-indigo-500" />
              No Account Required
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Popular Spotlight (if not searching) */}
        {!searchQuery && selectedCategory === 'all' && (
          <section id="popular-tools" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white font-display">
                  Most Popular Tools
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  The utilities used most frequently by professionals and students worldwide.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* Category Filter Tabs & All Tools Grid */}
        <section id="all-tools" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white font-display">
                All Utilities
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Showing {filteredTools.length} {filteredTools.length === 1 ? 'utility' : 'utilities'}
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : isDark
                    ? 'border-[#222733] bg-[#12151c] text-gray-300 hover:bg-[#181c25]'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                All Tools
              </button>
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : isDark
                        ? 'border-[#222733] bg-[#12151c] text-gray-300 hover:bg-[#181c25]'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tools Grid */}
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className={`p-12 rounded-3xl border text-center space-y-3 ${
              isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-gray-50 border-gray-200'
            }`}>
              <Search className="w-8 h-8 text-gray-400 mx-auto" />
              <h3 className="font-bold text-gray-900 dark:text-white">No tools found</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                No utilities match your search term "{searchQuery}". Try searching for something else or reset the filter.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="text-xs text-indigo-500 font-semibold hover:underline pt-2"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>

        {/* Reserved Placement Ad Banner */}
        <AdSlot id="home-inline-banner" label="Featured Partner" />

        {/* Why Choose OmniTools Section */}
        <section id="why-choose-us" className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-display">
              Why people choose OmniTools
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Built from the ground up to solve everyday file tasks without the frustrations of modern internet tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-3xl border space-y-3 ${
              isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
            }`}>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                Private by Architecture
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Your files never touch our servers. Processing takes place locally in your device’s browser memory. Ideal for tax returns, contracts, and personal photos.
              </p>
            </div>

            <div className={`p-6 rounded-3xl border space-y-3 ${
              isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
            }`}>
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                Near-Instant Processing
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                No waiting for uploads over slow connections or standing in server conversion queues. Client-side execution produces immediate results.
              </p>
            </div>

            <div className={`p-6 rounded-3xl border space-y-3 ${
              isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
            }`}>
              <div className="w-10 h-10 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                No Subscriptions or Limits
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Enjoy complete access without creating an account, watching timer countdowns, or hitting arbitrary daily conversion limits.
              </p>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section id="home-faq" className={`p-6 sm:p-10 rounded-3xl border ${
          isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'
        }`}>
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white font-display">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Everything you need to know about our free browser-based suite.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {homeFaqs.map((faq, idx) => {
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
