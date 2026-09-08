import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface AdSlotProps {
  format?: 'horizontal-leaderboard' | 'compact-banner' | 'in-feed';
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ format = 'horizontal-leaderboard', className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`w-full my-6 rounded-xl border border-dashed flex flex-col items-center justify-center p-3 text-center transition-colors ${
        isDark
          ? 'border-[#222733] bg-[#0f1217]/50 text-gray-500'
          : 'border-gray-200 bg-gray-50/60 text-gray-400'
      } ${
        format === 'compact-banner'
          ? 'min-h-[70px]'
          : format === 'in-feed'
          ? 'min-h-[90px]'
          : 'min-h-[90px] max-w-4xl mx-auto'
      } ${className}`}
      aria-label="Advertisement area reserved for sponsor content"
    >
      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-600 mb-1">
        Sponsor / Ad Space
      </span>
      <p className="text-xs text-gray-400 max-w-md">
        Reserved high-speed advertising slot (Google AdSense ready). Unobtrusive and privacy compliant.
      </p>
    </div>
  );
};
