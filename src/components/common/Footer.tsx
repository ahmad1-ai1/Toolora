import React from 'react';
import { Wrench, ShieldCheck, Zap, Lock, Heart } from 'lucide-react';
import { Link } from '../../context/RouterContext';
import { useTheme } from '../../context/ThemeContext';
import { CATEGORIES, TOOLS } from '../../data/tools';

export const Footer: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer
      id="app-footer"
      className={`border-t transition-colors mt-auto ${
        isDark ? 'bg-[#0a0c0f] border-[#1c202a] text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'
      }`}
    >
      {/* Privacy Promise Banner */}
      <div className={`border-b ${isDark ? 'border-[#191d26] bg-[#0e1116]' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Zero-Server Privacy Promise: Your files are processed 100% locally in your browser.</span>
            </div>
            <div className="flex items-center gap-4 text-gray-400">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> No file storage
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> No upload queues
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">
                Toolora
              </span>
            </Link>
            <p className="text-sm max-w-sm leading-relaxed">
              Free online tools built for everyday work. Fast, simple, and privacy-friendly utilities for images, PDFs, text formatting, developer testing, and calculations.
            </p>
            <div className="text-xs text-gray-400 pt-2">
              Built with mathematical precision &amp; modern WebAssembly / HTML5 canvas standards.
            </div>
          </div>

          {/* Popular Tools Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">
              Popular Tools
            </h3>
            <ul className="space-y-2 text-sm">
              {TOOLS.slice(0, 5).map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="hover:text-indigo-500 transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Utilities Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">
              More Utilities
            </h3>
            <ul className="space-y-2 text-sm">
              {TOOLS.slice(5).map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="hover:text-indigo-500 transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories & Legal Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">
              Company &amp; Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-indigo-500 transition-colors">
                  About Toolora
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-500 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-indigo-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-indigo-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-indigo-500 transition-colors">
                  Legal Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs border-gray-200 dark:border-[#1e232e]">
          <p>© {new Date().getFullYear()} Toolora. All rights reserved. Free, fast and privacy-friendly online tools.</p>
          <div className="flex items-center gap-1 text-gray-400">
            <span>Crafted for high-performance productivity</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/30" />
          </div>
        </div>
      </div>
    </footer>
  );
};
