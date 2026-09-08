import React, { useState } from 'react';
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
import { NotFoundPage } from './components/pages/NotFoundPage';
import { TOOLS, CATEGORIES } from './data/tools';
import { ToolCategory } from './types';

const AppContent: React.FC = () => {
  const { currentPath } = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchOpen, setSearchOpen] = useState(false);

  // Route Dispatcher
  const renderRoute = () => {
    // 1. Home
    if (currentPath === '/' || currentPath === '') {
      return <HomePage onOpenSearch={() => setSearchOpen(true)} />;
    }

    // 2. All Tools catalog
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
    return <NotFoundPage />;
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        isDark ? 'bg-[#0b0d11] text-[#f4f5f7]' : 'bg-[#fafbfe] text-[#0f172a]'
      }`}
    >
      {/* Global Header */}
      <Header onOpenSearch={() => setSearchOpen(true)} />

      {/* Main Routed Page Content */}
      <div className="flex-1">{renderRoute()}</div>

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
