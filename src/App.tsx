import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CommandPalette } from './components/common/CommandPalette';
import { HomePage } from './components/pages/HomePage';
import { ToolPage } from './components/pages/ToolPage';
import { CategoryPage } from './components/pages/CategoryPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { LegalPage } from './components/pages/LegalPage';
import { TOOLS, CATEGORIES } from './data/tools';
import { ToolCategory } from './types';
import { Wrench } from 'lucide-react';
import { Link } from './context/RouterContext';

const AppContent: React.FC = () => {
  const { currentPath } = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchOpen, setSearchOpen] = useState(false);

  // Dynamic Title & Meta tags synchronization
  useEffect(() => {
    let title = 'Free Online Tools - Image, PDF & Utility Suite';
    let desc = 'Fast, simple, privacy-friendly online utilities for images, PDFs, text, calculations and everyday productivity.';

    // Check if path is a tool page
    const cleanPath = currentPath.replace(/^\/tools\//, '').replace(/^\/tool\//, '').replace(/^\//, '');
    const tool = TOOLS.find((t) => t.slug === cleanPath || `/tools/${t.slug}` === currentPath || `/${t.slug}` === currentPath);

    if (tool) {
      title = `${tool.name} - Free Online Tool | OmniTools`;
      desc = tool.shortDescription;
    } else if (currentPath === '/tools') {
      title = 'All Online Tools - Free Image, PDF & Math Utilities | OmniTools';
      desc = 'Browse our complete catalog of free online tools. Compress photos, merge PDFs, generate QR codes, and more.';
    } else if (currentPath.startsWith('/category/')) {
      const catId = currentPath.replace('/category/', '') as ToolCategory;
      const cat = CATEGORIES.find((c) => c.id === catId);
      if (cat) {
        title = `${cat.name} Tools - Free Online Utilities | OmniTools`;
        desc = cat.description;
      }
    } else if (currentPath === '/about') {
      title = 'About Us - Privacy-First Architecture | OmniTools';
      desc = 'Learn about OmniTools and our client-side zero-server privacy architecture.';
    } else if (currentPath === '/contact') {
      title = 'Contact Support & Feedback | OmniTools';
      desc = 'Get in touch with the OmniTools team for feedback, bug reports, and new tool requests.';
    } else if (currentPath === '/privacy-policy') {
      title = 'Privacy Policy - 100% Client-Side Guarantee | OmniTools';
      desc = 'Read our privacy policy and zero-server retention guarantee.';
    } else if (currentPath === '/terms') {
      title = 'Terms of Service | OmniTools';
    } else if (currentPath === '/disclaimer') {
      title = 'Legal Disclaimer | OmniTools';
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', desc);
    }
  }, [currentPath]);

  // Route Dispatcher
  const renderRoute = () => {
    // 1. Home
    if (currentPath === '/' || currentPath === '') {
      return <HomePage onOpenSearch={() => setSearchOpen(true)} />;
    }

    // 2. All Tools
    if (currentPath === '/tools') {
      return <CategoryPage categoryId="all" />;
    }

    // 3. Category Page: /category/:id
    if (currentPath.startsWith('/category/')) {
      const catId = currentPath.replace('/category/', '') as ToolCategory;
      const validCategory = CATEGORIES.find((c) => c.id === catId);
      if (validCategory) {
        return <CategoryPage categoryId={catId} />;
      }
    }

    // 4. Tool Page: matches /tools/:slug, /tool/:slug, or /:slug
    const toolSlug = currentPath
      .replace(/^\/tools\//, '')
      .replace(/^\/tool\//, '')
      .replace(/^\//, '');

    const matchedTool = TOOLS.find(
      (t) =>
        t.slug === toolSlug ||
        `/tools/${t.slug}` === currentPath ||
        `/tool/${t.slug}` === currentPath ||
        `/${t.slug}` === currentPath
    );

    if (matchedTool) {
      return <ToolPage tool={matchedTool} />;
    }

    // 5. Static & Legal Pages
    if (currentPath === '/about') return <AboutPage />;
    if (currentPath === '/contact') return <ContactPage />;
    if (currentPath === '/privacy-policy') return <LegalPage type="privacy" />;
    if (currentPath === '/terms') return <LegalPage type="terms" />;
    if (currentPath === '/disclaimer') return <LegalPage type="disclaimer" />;

    // 6. 404 Fallback
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
          <Wrench className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display mb-2">
          Page Not Found
        </h1>
        <p className="text-sm text-gray-500 max-w-sm mb-6">
          The tool or page you are looking for might have been moved or doesn’t exist.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
        >
          Return to All Tools
        </Link>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isDark ? 'bg-[#0b0d11] text-[#f4f5f7]' : 'bg-[#fafbfe] text-[#0f172a]'
    }`}>
      {/* Global Header */}
      <Header onOpenSearch={() => setSearchOpen(true)} />

      {/* Main Routed Page Content */}
      <div className="flex-1">
        {renderRoute()}
      </div>

      {/* Global Footer */}
      <Footer />

      {/* Global Command Palette / Search Modal */}
      <CommandPalette
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </ThemeProvider>
  );
}
