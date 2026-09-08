import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { Link, useRouter } from '../../context/RouterContext';
import { useTheme } from '../../context/ThemeContext';
import { CATEGORIES, TOOLS } from '../../data/tools';
import { ToolIcon } from './ToolIcon';

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const { theme, toggleTheme } = useTheme();
  const { navigate, currentPath } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const isDark = theme === 'dark';

  // Listen for keyboard shortcut Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  // Handle Surprise Me random tool
  const handleRandomTool = () => {
    const randomTool = TOOLS[Math.floor(Math.random() * TOOLS.length)];
    navigate(`/tools/${randomTool.slug}`);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="app-header"
      className={`sticky top-0 z-40 w-full border-b transition-colors backdrop-blur-md ${
        isDark
          ? 'bg-[#0c0e12]/90 border-[#1f242e]'
          : 'bg-white/90 border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight font-display flex items-center gap-1.5">
                Toolora
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  Free
                </span>
              </span>
              <span className="text-[11px] text-gray-500 -mt-0.5 hidden sm:inline">100% Free &amp; Private</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/tools"
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentPath.startsWith('/tools') && currentPath === '/tools'
                  ? isDark ? 'text-white bg-white/10' : 'text-indigo-600 bg-indigo-50'
                  : isDark ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              All Tools
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  isDark ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>Categories</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {categoriesOpen && (
                <div
                  className={`absolute left-0 top-full mt-1 w-64 rounded-xl border shadow-xl p-2 z-50 animate-in fade-in-50 duration-150 ${
                    isDark ? 'bg-[#14171e] border-[#252b37]' : 'bg-white border-gray-200'
                  }`}
                >
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.id}`}
                      onClick={() => setCategoriesOpen(false)}
                      className={`flex items-start gap-3 p-2 rounded-lg transition-colors ${
                        isDark ? 'hover:bg-[#1e232e]' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className={`p-1.5 rounded-md mt-0.5 ${isDark ? 'bg-[#222733] text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                        <ToolIcon name={cat.icon} className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-xs">{cat.name}</div>
                        <div className={`text-[11px] line-clamp-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {cat.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/about"
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentPath === '/about'
                  ? isDark ? 'text-white bg-white/10' : 'text-indigo-600 bg-indigo-50'
                  : isDark ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              About
            </Link>
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2">
          {/* Quick Surprise Me Button */}
          <button
            onClick={handleRandomTool}
            title="Open a random useful tool"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              isDark
                ? 'border-amber-500/20 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                : 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Random Tool</span>
          </button>

          {/* Search Trigger Button (Desktop & Mobile) */}
          <button
            onClick={onOpenSearch}
            className={`flex items-center gap-3 px-3 py-1.5 text-xs rounded-xl border transition-all h-10 ${
              isDark
                ? 'border-[#222733] bg-[#14171d] text-gray-400 hover:border-gray-600 hover:text-gray-200'
                : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Quick search...</span>
            <kbd className={`hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono rounded border ${
              isDark ? 'border-[#2a3140] bg-[#1a1f28] text-gray-400' : 'border-gray-200 bg-white text-gray-500'
            }`}>
              ⌘K
            </kbd>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors border ${
              isDark
                ? 'border-[#222733] bg-[#14171d] text-amber-400 hover:bg-[#1a1f28]'
                : 'border-gray-200 bg-gray-50 text-indigo-600 hover:bg-gray-100'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className={`md:hidden w-10 h-10 rounded-xl flex items-center justify-center border ${
              isDark
                ? 'border-[#222733] bg-[#14171d] text-gray-300'
                : 'border-gray-200 bg-gray-50 text-gray-700'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-t px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-150 ${
            isDark ? 'bg-[#0e1117] border-[#1e232e]' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex flex-col space-y-1">
            <Link
              href="/tools"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg font-medium text-sm"
            >
              <span>Explore All Tools</span>
              <span className="text-xs text-indigo-500 font-semibold">{TOOLS.length} Available</span>
            </Link>
            <div className="pt-2 pb-1 px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Categories
            </div>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm"
              >
                <ToolIcon name={cat.icon} className="w-4 h-4 text-indigo-500" />
                <span>{cat.name}</span>
              </Link>
            ))}
            <div className="pt-2 border-t my-2 border-gray-800" />
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm"
            >
              About Toolora
            </Link>
            <Link
              href="/privacy-policy"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm text-emerald-500 font-medium"
            >
              Privacy Policy (100% Client-Side)
            </Link>
          </div>

          <button
            onClick={handleRandomTool}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow"
          >
            <Sparkles className="w-4 h-4" />
            <span>Surprise Me With a Tool</span>
          </button>
        </div>
      )}
    </header>
  );
};
