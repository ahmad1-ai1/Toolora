import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { ToolMetadata } from '../../types';
import { ToolIcon } from './ToolIcon';
import { Link } from '../../context/RouterContext';
import { useTheme } from '../../context/ThemeContext';

interface ToolCardProps {
  tool: ToolMetadata;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={`group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
        isDark
          ? 'bg-[#13161c] border-[#222733] hover:border-indigo-500/40 hover:bg-[#181c24]'
          : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-indigo-100/50'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
              isDark
                ? 'bg-[#1d222c] text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white'
                : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
            }`}
          >
            <ToolIcon name={tool.iconName} className="w-5 h-5 transition-transform group-hover:scale-110" />
          </div>
          <div className="flex items-center gap-1.5">
            {tool.isPopular && (
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Star className="w-2.5 h-2.5 fill-amber-500" />
                Popular
              </span>
            )}
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isDark ? 'bg-[#1d222c] text-gray-400' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {tool.category}
            </span>
          </div>
        </div>

        <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">
          {tool.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
          {tool.shortDescription}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-gray-100 dark:border-[#1e232e] flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
        <span>Open Tool</span>
        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};
