import React from 'react';
import {
  ShieldCheck,
  Zap,
  Lock,
  Heart,
  Globe,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { useTheme } from '../../context/ThemeContext';
import { Link } from '../../context/RouterContext';

export const AboutPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} />

        {/* Hero */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white font-display">
            Fast, private utilities built for everyone.
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            OmniTools was founded on a simple realization: performing basic everyday tasks like compressing a photo, converting a PDF, or generating a QR code shouldn’t require handing over personal documents to unknown remote servers or fighting through aggressive ads.
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className={`p-6 rounded-3xl border space-y-3 ${isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'}`}>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">
              Zero Server Uploads
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              We leverage browser memory, WebAssembly, and HTML5 Canvas so your data never touches our cloud.
            </p>
          </div>

          <div className={`p-6 rounded-3xl border space-y-3 ${isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'}`}>
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">
              Zero Waiting Time
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              No artificial timers, queues, captcha walls, or sign-up gates to slow you down.
            </p>
          </div>

          <div className={`p-6 rounded-3xl border space-y-3 ${isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'}`}>
            <div className="w-10 h-10 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">
              Globally Accessible
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Lightweight bundle sizes and responsive designs that perform smoothly across all devices and bandwidths.
            </p>
          </div>
        </div>

        {/* In-depth story */}
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-4 prose prose-sm dark:prose-invert max-w-none ${isDark ? 'bg-[#10131a] border-[#1e232e]' : 'bg-white border-gray-200'}`}>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Engineering for Trust and Speed
          </h2>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            Traditional free-tool websites monetize users by uploading their documents to remote servers, converting them asynchronously, and serving intrusive full-page popups. That architecture is dangerous for sensitive personal documents like contracts, medical paperwork, and personal photographs.
          </p>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            OmniTools embraces the modern capabilities of client browsers. By compiling robust algorithms into optimized JavaScript and WebAssembly, modern laptops and phones can process hundreds of megabytes of media in fractions of a second — completely offline and entirely in memory.
          </p>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            We are committed to maintaining these utilities as a free public resource. If you ever have questions, suggestions, or ideas for new tools, we would love to hear from you.
          </p>
        </div>

        {/* Call to action */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl border border-indigo-500/20 bg-indigo-500/5">
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Have feedback or a tool request?</h3>
            <p className="text-xs text-gray-500">We regularly implement tools suggested by our community.</p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-sm"
          >
            <span>Contact Us</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
