import React from 'react';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { ToolCard } from '../common/ToolCard';
import { ToolIcon } from '../common/ToolIcon';
import { TOOLS, CATEGORIES, CategoryInfo } from '../../data/tools';
import { ToolCategory } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Link } from '../../context/RouterContext';

interface CategoryPageProps {
  categoryId?: ToolCategory | 'all';
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ categoryId = 'all' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const category = CATEGORIES.find((c) => c.id === categoryId);
  const tools = categoryId === 'all'
    ? TOOLS
    : TOOLS.filter((t) => t.category === categoryId);

  const pageTitle = category ? `${category.name} Tools` : 'All Online Tools';
  const pageDesc = category
    ? category.description
    : `Explore our collection of ${TOOLS.length} free, fast, and privacy-friendly utilities for images, PDFs, text, developer tasks, and calculations.`;

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: pageTitle },
          ]}
        />

        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {category && (
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <ToolIcon name={category.icon} className="w-6 h-6" />
              </div>
            )}
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white font-display">
                {pageTitle}
              </h1>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mt-1">
                {pageDesc}
              </p>
            </div>
          </div>

          {/* Category Switcher Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <Link
              href="/tools"
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                categoryId === 'all'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : isDark
                  ? 'border-[#222733] bg-[#12151c] text-gray-300 hover:bg-[#181c25]'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Tools ({TOOLS.length})
            </Link>
            {CATEGORIES.map((cat) => {
              const isActive = categoryId === cat.id;
              const count = TOOLS.filter((t) => t.category === cat.id).length;
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.id}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : isDark
                      ? 'border-[#222733] bg-[#12151c] text-gray-300 hover:bg-[#181c25]'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {cat.name} ({count})
                </Link>
              );
            })}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  );
};
