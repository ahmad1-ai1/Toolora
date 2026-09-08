import React from 'react';
import { Wrench, Home, ArrowRight, Search } from 'lucide-react';
import { Link } from '../../context/RouterContext';
import { SeoHead } from '../seo/SeoHead';
import { TOOLS } from '../../data/tools';
import { ToolCard } from '../common/ToolCard';
import { useTheme } from '../../context/ThemeContext';

export const NotFoundPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen py-12 sm:py-16">
      <SeoHead
        title="Page Not Found (404) | Toolora"
        description="The tool or page you are looking for does not exist or has been relocated. Explore our collection of free online tools."
        path="/404"
        noIndex={true}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
            <Wrench className="w-8 h-8" />
          </div>
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">
            Error 404
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white font-display">
            Page Not Found
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The page you requested could not be found. It may have been moved, renamed, or the link may be mistyped.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-sm transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <Link
              href="/tools"
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs border transition-colors flex items-center gap-2 ${
                isDark
                  ? 'border-[#262c3a] bg-[#12151c] text-gray-300 hover:bg-[#181c25]'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Browse All Tools</span>
            </Link>
          </div>
        </div>

        {/* Suggested Tools Grid */}
        <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-[#1e232e] text-left">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Popular Free Utilities
              </h2>
              <p className="text-xs text-gray-500">
                You might be looking for one of these everyday tools:
              </p>
            </div>
            <Link
              href="/tools"
              className="text-xs font-semibold text-indigo-500 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.slice(0, 3).map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
