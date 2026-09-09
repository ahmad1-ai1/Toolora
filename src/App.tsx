import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CommandPalette } from './components/common/CommandPalette';
import { HomePage } from './components/pages/HomePage';
import { ToolPage } from './components/pages/ToolPage';
import { ToolsPage } from './components/pages/ToolsPage';
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

  // Direct return for Google Search Console verification if ever routed client-side
  if (currentPath === '/google63909bce1f342ce4.html') {
    return <>google-site-verification: google63909bce1f342ce4.html</>;
  }

  // Route Dispatcher
  const renderRoute = () => {
    // Normalize path by stripping trailing slash (except root '/')
    const normPath =
      currentPath.length > 1 && currentPath.endsWith('/')
        ? currentPath.slice(0, -1)
        : currentPath || '/';

    // 1. Home
    if (normPath === '/' || normPath === '') {
      return <HomePage onOpenSearch={() => setSearchOpen(true)} />;
    }

    // 2. All Tools catalog
    if (normPath === '/tools') {
      return <ToolsPage />;
    }

    // 3. Category Page: /category/:id
    if (normPath.startsWith('/category/')) {
      const catId = normPath.replace('/category/', '') as ToolCategory;
      const validCategory = CATEGORIES.find((c) => c.id === catId);
      if (validCategory) {
        return <CategoryPage categoryId={catId} />;
      }
    }

    // 4. Tool Page: matches /tools/:slug, /tool/:slug, or /:slug
    const toolSlug = normPath
      .replace(/^\/tools\//, '')
      .replace(/^\/tool\//, '')
      .replace(/^\//, '');

    const matchedTool = TOOLS.find(
      (t) =>
        t.slug === toolSlug ||
        `/tools/${t.slug}` === normPath ||
        `/tool/${t.slug}` === normPath ||
        `/${t.slug}` === normPath
    );

    if (matchedTool) {
      return <ToolPage tool={matchedTool} />;
    }

    // 5. Static & Legal Pages
    if (normPath === '/about') return <AboutPage />;
    if (normPath === '/contact') return <ContactPage />;
    if (normPath === '/privacy-policy') return <LegalPage type="privacy" />;
    if (normPath === '/terms') return <LegalPage type="terms" />;
    if (normPath === '/disclaimer') return <LegalPage type="disclaimer" />;

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
