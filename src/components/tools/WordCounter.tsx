import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Mic,
  FileText,
  AlignLeft,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const WordCounter: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [text, setText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Real-time text analysis calculation
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s+/g, '').length;

    // Word count
    const wordsArray = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const words = wordsArray.length;

    // Sentence count
    const sentences = trimmed
      ? (trimmed.match(/[^.!?]+[.!?]+(\s|$)/g) || [trimmed]).length
      : 0;

    // Paragraph count
    const paragraphs = trimmed
      ? trimmed.split(/\n+/).filter((p) => p.trim().length > 0).length
      : 0;

    // Reading time (approx 200 words per minute)
    const readingTimeMinutes = Math.ceil(words / 200);

    // Speaking time (approx 130 words per minute)
    const speakingTimeMinutes = Math.ceil(words / 130);

    // Keyword density
    const frequencyMap: Record<string, number> = {};
    const stopWords = new Set([
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
      'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
      'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her',
      'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there',
      'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get',
      'which', 'go', 'me', 'is', 'are', 'was', 'were',
    ]);

    wordsArray.forEach((w) => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/gi, '');
      if (clean.length > 2 && !stopWords.has(clean)) {
        frequencyMap[clean] = (frequencyMap[clean] || 0) + 1;
      }
    });

    const topKeywords = Object.entries(frequencyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({
        word,
        count,
        percentage: ((count / (words || 1)) * 100).toFixed(1),
      }));

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTimeMinutes,
      speakingTimeMinutes,
      topKeywords,
    };
  }, [text]);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePasteSample = () => {
    setText(
      `Productivity is not about working longer hours; it is about creating systems that preserve cognitive focus. High-performance teams prioritize clarity, concise communication, and intentional recovery. When you eliminate unnecessary context switching, complex problem solving becomes far more intuitive.`
    );
  };

  const transformCase = (mode: 'upper' | 'lower' | 'title' | 'sentence') => {
    if (!text) return;
    if (mode === 'upper') {
      setText(text.toUpperCase());
    } else if (mode === 'lower') {
      setText(text.toLowerCase());
    } else if (mode === 'title') {
      setText(
        text.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        )
      );
    } else if (mode === 'sentence') {
      setText(
        text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
      );
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Words', value: stats.words, highlight: true },
          { label: 'Characters', value: stats.characters },
          { label: 'No Spaces', value: stats.charactersNoSpaces },
          { label: 'Sentences', value: stats.sentences },
          { label: 'Paragraphs', value: stats.paragraphs },
          {
            label: 'Reading Time',
            value: `${stats.readingTimeMinutes} min`,
            icon: BookOpen,
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-2xl border text-center transition-all ${
              item.highlight
                ? isDark
                  ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-400'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : isDark
                ? 'bg-[#12151c] border-[#222733] text-gray-200'
                : 'bg-white border-gray-200 text-gray-800'
            }`}
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              {item.label}
            </div>
            <div className="text-xl sm:text-2xl font-black mt-1">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Main Textarea Workbench */}
      <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-[#12151c] border-[#222733]' : 'bg-white border-gray-200'}`}>
        {/* Editor Controls Bar */}
        <div className="px-4 py-3 border-b flex flex-wrap items-center justify-between gap-3 border-gray-100 dark:border-[#1e232e]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-400 mr-1 hidden sm:inline">Case:</span>
            <button
              onClick={() => transformCase('upper')}
              className="px-2 py-1 text-xs font-semibold rounded-md border border-gray-200 dark:border-[#262c3a] hover:bg-gray-100 dark:hover:bg-[#1a1f29] transition-colors"
            >
              UPPER
            </button>
            <button
              onClick={() => transformCase('lower')}
              className="px-2 py-1 text-xs font-semibold rounded-md border border-gray-200 dark:border-[#262c3a] hover:bg-gray-100 dark:hover:bg-[#1a1f29] transition-colors"
            >
              lower
            </button>
            <button
              onClick={() => transformCase('title')}
              className="px-2 py-1 text-xs font-semibold rounded-md border border-gray-200 dark:border-[#262c3a] hover:bg-gray-100 dark:hover:bg-[#1a1f29] transition-colors"
            >
              Title Case
            </button>
            <button
              onClick={() => transformCase('sentence')}
              className="px-2 py-1 text-xs font-semibold rounded-md border border-gray-200 dark:border-[#262c3a] hover:bg-gray-100 dark:hover:bg-[#1a1f29] transition-colors"
            >
              Sentence case
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!text && (
              <button
                onClick={handlePasteSample}
                className="px-2.5 py-1 text-xs text-indigo-500 font-semibold hover:underline"
              >
                Insert Sample Text
              </button>
            )}
            <button
              onClick={handleCopy}
              disabled={!text}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors disabled:opacity-40 ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : isDark
                  ? 'border-[#262c3a] bg-[#161a22] text-gray-300 hover:bg-[#1f2532]'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={() => setText('')}
              disabled={!text}
              title="Clear all text"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 transition-colors disabled:opacity-40"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Text Input */}
        <div className="p-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to see live word counts, character limits, reading time, and keyword analytics..."
            rows={10}
            className="w-full bg-transparent text-sm sm:text-base leading-relaxed outline-none resize-y min-h-[220px] placeholder:text-gray-400 font-sans"
          />
        </div>

        {/* Footer Sub-stats */}
        <div className="px-4 py-2.5 border-t border-gray-100 dark:border-[#1e232e] flex flex-wrap items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-indigo-400" />
              Speaking Time: ~{stats.speakingTimeMinutes} min (130 wpm)
            </span>
          </div>
          <span>Instant real-time parsing</span>
        </div>
      </div>

      {/* Top Keywords Analysis */}
      {stats.topKeywords.length > 0 && (
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#12151c] border-[#222733]' : 'bg-white border-gray-200'}`}>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Top Keywords Density</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {stats.topKeywords.map((item, idx) => (
              <div
                key={idx}
                className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-2 ${
                  isDark ? 'border-[#262c3a] bg-[#161a22] text-gray-200' : 'border-gray-200 bg-gray-50 text-gray-800'
                }`}
              >
                <span className="font-bold text-indigo-500">{item.word}</span>
                <span className="text-gray-400 font-mono">
                  {item.count}x ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
