import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from '../../context/RouterContext';
import { SITE_URL } from '../../config/seo';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const allItems = [
    { label: 'Home', href: '/' },
    ...items,
  ];

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center text-xs text-gray-500 mb-4 overflow-x-auto whitespace-nowrap py-1"
    >
      <ol
        className="flex items-center"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const fullItemUrl = item.href === '/' ? `${SITE_URL}/` : `${SITE_URL}${item.href || ''}`;

          return (
            <li
              key={index}
              className="flex items-center"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index > 0 && (
                <ChevronRight className="w-3 h-3 mx-2 text-gray-400 shrink-0" aria-hidden="true" />
              )}

              {isLast || !item.href ? (
                <span
                  className="font-semibold text-gray-900 dark:text-gray-100 shrink-0"
                  aria-current="page"
                  itemProp="name"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0 flex items-center gap-1"
                  itemProp="item"
                >
                  {index === 0 && <Home className="w-3.5 h-3.5" aria-hidden="true" />}
                  <span itemProp="name">{item.label}</span>
                </Link>
              )}
              <meta itemProp="position" content={String(index + 1)} />
              {item.href && <meta itemProp="item" content={fullItemUrl} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
