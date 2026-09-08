import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { TOOLS } from '../../data/tools';
import { ToolMetadata } from '../../types';
import { ToolIcon } from './ToolIcon';
import { useRouter } from '../../context/RouterContext';
import { useTheme } from '../../context/ThemeContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { navigate } = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Filter tools by name, description, category, and keywords
  const filteredTools = TOOLS.filter((tool: ToolMetadata) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.shortDescription.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      tool.keywords.some((kw) => kw.toLowerCase().includes(q))
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredTools.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % (filteredTools.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTools[selectedIndex]) {
        navigate(`/tools/${filteredTools[selectedIndex].slug}`);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden ${
          isDark
            ? 'bg-[#12151b] border-[#222733] text-gray-100'
            : 'bg-white border-gray-200 text-gray-900'
        }`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className={`flex items-center px-4 py-3.5 border-b ${isDark ? 'border-[#222733]' : 'border-gray-100'}`}>
          <Search className={`w-5 h-5 mr-3 shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools by name, action (e.g. compress, photo, calc, format)..."
            className="w-full bg-transparent text-base outline-none placeholder:text-gray-500 font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-gray-400 hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className={`ml-2 px-2 py-1 text-xs rounded border ${
              isDark ? 'border-[#2f3646] text-gray-400' : 'border-gray-200 text-gray-500'
            }`}
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filteredTools.length === 0 ? (
            <div className="py-12 text-center">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                No matching tools found for "{query}".
              </p>
              <p className="text-xs text-gray-500 mt-1">Try keywords like &ldquo;compress&rdquo;, &ldquo;pdf&rdquo;, &ldquo;image&rdquo;, &ldquo;qr&rdquo;, or &ldquo;counter&rdquo;</p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Tools ({filteredTools.length})
              </div>
              {filteredTools.map((tool, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={tool.id}
                    onClick={() => {
                      navigate(`/tools/${tool.slug}`);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl cursor-pointer transition-colors ${
                      isSelected
                        ? isDark
                          ? 'bg-indigo-600/15 text-white border border-indigo-500/30'
                          : 'bg-indigo-50 text-indigo-950 border border-indigo-200'
                        : isDark
                        ? 'text-gray-300 hover:bg-[#181d26] border border-transparent'
                        : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : isDark
                            ? 'bg-[#1e232d] text-gray-300'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <ToolIcon name={tool.iconName} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm truncate">{tool.name}</span>
                          <span
                            className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full ${
                              isDark ? 'bg-[#222733] text-indigo-400' : 'bg-gray-100 text-indigo-600'
                            }`}
                          >
                            {tool.category}
                          </span>
                        </div>
                        <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
                          {tool.shortDescription}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {isSelected ? (
                        <div className="flex items-center text-xs text-indigo-500 font-medium">
                          <span className="hidden sm:inline mr-1">Press</span>
                          <CornerDownLeft className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <ArrowRight className="w-4 h-4 opacity-30" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div
          className={`px-4 py-2.5 border-t flex items-center justify-between text-xs ${
            isDark ? 'border-[#222733] bg-[#0f1217] text-gray-400' : 'border-gray-100 bg-gray-50 text-gray-500'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${isDark ? 'bg-[#222733]' : 'bg-gray-200'}`}>↑</kbd>
              <kbd className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${isDark ? 'bg-[#222733]' : 'bg-gray-200'}`}>↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${isDark ? 'bg-[#222733]' : 'bg-gray-200'}`}>↵</kbd>
              Select
            </span>
          </div>
          <span className="text-[11px] text-gray-400">100% Client-Side Privacy</span>
        </div>
      </div>
    </div>
  );
};
