import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from '../../context/RouterContext';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-gray-500 mb-4 overflow-x-auto whitespace-nowrap py-1">
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-indigo-500 transition-colors shrink-0"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 mx-2 text-gray-400 shrink-0" />
            {isLast || !item.href ? (
              <span className="font-semibold text-gray-800 dark:text-gray-200 shrink-0" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-indigo-500 transition-colors shrink-0"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
