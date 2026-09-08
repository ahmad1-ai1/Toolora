import React, { useState } from 'react';
import {
  Percent,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const PercentageCalculator: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Mode 1: What is X% of Y?
  const [m1Percent, setM1Percent] = useState<string>('15');
  const [m1Value, setM1Value] = useState<string>('240');

  // Mode 2: X is what % of Y?
  const [m2Part, setM2Part] = useState<string>('45');
  const [m2Total, setM2Total] = useState<string>('180');

  // Mode 3: Percentage increase / decrease from X to Y
  const [m3Initial, setM3Initial] = useState<string>('80');
  const [m3Final, setM3Final] = useState<string>('120');

  // Mode 1 calculation
  const m1Result = (() => {
    const p = parseFloat(m1Percent);
    const v = parseFloat(m1Value);
    if (isNaN(p) || isNaN(v)) return null;
    return (p / 100) * v;
  })();

  // Mode 2 calculation
  const m2Result = (() => {
    const part = parseFloat(m2Part);
    const total = parseFloat(m2Total);
    if (isNaN(part) || isNaN(total) || total === 0) return null;
    return (part / total) * 100;
  })();

  // Mode 3 calculation
  const m3Result = (() => {
    const init = parseFloat(m3Initial);
    const fin = parseFloat(m3Final);
    if (isNaN(init) || isNaN(fin) || init === 0) return null;
    const diff = fin - init;
    const pct = (diff / Math.abs(init)) * 100;
    return {
      percent: pct,
      isIncrease: diff >= 0,
      diff,
    };
  })();

  return (
    <div className="w-full space-y-6">
      {/* Scenario 1: What is X% of Y? */}
      <div className={`p-6 rounded-2xl border transition-all ${isDark ? 'bg-[#12151c] border-[#222733]' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h3 className="font-bold text-base text-gray-900 dark:text-white">
            What is X% of Y?
          </h3>
          <span className="text-xs text-gray-400 ml-auto hidden sm:inline">e.g. Sales tax, discounts, tip rates</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-4">
            <label className="text-xs font-medium text-gray-400 block mb-1">Percentage (X %)</label>
            <div className="relative">
              <input
                type="number"
                value={m1Percent}
                onChange={(e) => setM1Percent(e.target.value)}
                placeholder="15"
                className={`w-full pr-8 pl-3.5 py-2.5 rounded-xl border text-base font-bold outline-none focus:border-indigo-500 ${
                  isDark ? 'bg-[#181c24] border-[#262c3a] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
              <span className="absolute right-3 top-3 text-sm font-bold text-gray-400">%</span>
            </div>
          </div>

          <div className="sm:col-span-1 text-center font-semibold text-gray-400 text-xs">
            of
          </div>

          <div className="sm:col-span-4">
            <label className="text-xs font-medium text-gray-400 block mb-1">Base Number (Y)</label>
            <input
              type="number"
              value={m1Value}
              onChange={(e) => setM1Value(e.target.value)}
              placeholder="240"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-base font-bold outline-none focus:border-indigo-500 ${
                isDark ? 'bg-[#181c24] border-[#262c3a] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
          </div>

          <div className="sm:col-span-3">
            <label className="text-xs font-medium text-gray-400 block mb-1">Result</label>
            <div className={`px-3.5 py-2.5 rounded-xl border font-bold text-lg text-indigo-500 truncate ${
              isDark ? 'bg-[#161a22] border-indigo-500/30' : 'bg-indigo-50 border-indigo-200'
            }`}>
              {m1Result !== null ? parseFloat(m1Result.toFixed(4)).toString() : '—'}
            </div>
          </div>
        </div>

        {m1Result !== null && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#1e232e] text-xs text-gray-400 font-mono">
            Calculation: ({m1Percent} ÷ 100) × {m1Value} = <span className="font-bold text-indigo-400">{parseFloat(m1Result.toFixed(4)).toString()}</span>
          </div>
        )}
      </div>

      {/* Scenario 2: X is what percent of Y? */}
      <div className={`p-6 rounded-2xl border transition-all ${isDark ? 'bg-[#12151c] border-[#222733]' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <h3 className="font-bold text-base text-gray-900 dark:text-white">
            X is what percent of Y?
          </h3>
          <span className="text-xs text-gray-400 ml-auto hidden sm:inline">e.g. Test scores, goal progress</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-4">
            <label className="text-xs font-medium text-gray-400 block mb-1">Part Value (X)</label>
            <input
              type="number"
              value={m2Part}
              onChange={(e) => setM2Part(e.target.value)}
              placeholder="45"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-base font-bold outline-none focus:border-indigo-500 ${
                isDark ? 'bg-[#181c24] border-[#262c3a] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
          </div>

          <div className="sm:col-span-1 text-center font-semibold text-gray-400 text-xs">
            out of
          </div>

          <div className="sm:col-span-4">
            <label className="text-xs font-medium text-gray-400 block mb-1">Total Value (Y)</label>
            <input
              type="number"
              value={m2Total}
              onChange={(e) => setM2Total(e.target.value)}
              placeholder="180"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-base font-bold outline-none focus:border-indigo-500 ${
                isDark ? 'bg-[#181c24] border-[#262c3a] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
          </div>

          <div className="sm:col-span-3">
            <label className="text-xs font-medium text-gray-400 block mb-1">Percentage Result</label>
            <div className={`px-3.5 py-2.5 rounded-xl border font-bold text-lg text-indigo-500 truncate ${
              isDark ? 'bg-[#161a22] border-indigo-500/30' : 'bg-indigo-50 border-indigo-200'
            }`}>
              {m2Result !== null ? `${parseFloat(m2Result.toFixed(2))}%` : '—'}
            </div>
          </div>
        </div>

        {m2Result !== null && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#1e232e] text-xs text-gray-400 font-mono">
            Calculation: ({m2Part} ÷ {m2Total}) × 100 = <span className="font-bold text-indigo-400">{parseFloat(m2Result.toFixed(2))}%</span>
          </div>
        )}
      </div>

      {/* Scenario 3: Percentage Increase / Decrease from X to Y */}
      <div className={`p-6 rounded-2xl border transition-all ${isDark ? 'bg-[#12151c] border-[#222733]' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <h3 className="font-bold text-base text-gray-900 dark:text-white">
            Percentage Increase or Decrease
          </h3>
          <span className="text-xs text-gray-400 ml-auto hidden sm:inline">e.g. Price fluctuations, growth rates</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-4">
            <label className="text-xs font-medium text-gray-400 block mb-1">Starting Value (X)</label>
            <input
              type="number"
              value={m3Initial}
              onChange={(e) => setM3Initial(e.target.value)}
              placeholder="80"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-base font-bold outline-none focus:border-indigo-500 ${
                isDark ? 'bg-[#181c24] border-[#262c3a] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
          </div>

          <div className="sm:col-span-1 text-center font-semibold text-gray-400 text-xs">
            to
          </div>

          <div className="sm:col-span-4">
            <label className="text-xs font-medium text-gray-400 block mb-1">Final Value (Y)</label>
            <input
              type="number"
              value={m3Final}
              onChange={(e) => setM3Final(e.target.value)}
              placeholder="120"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-base font-bold outline-none focus:border-indigo-500 ${
                isDark ? 'bg-[#181c24] border-[#262c3a] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
          </div>

          <div className="sm:col-span-3">
            <label className="text-xs font-medium text-gray-400 block mb-1">Change Rate</label>
            <div className={`px-3.5 py-2.5 rounded-xl border font-bold text-lg flex items-center gap-1.5 truncate ${
              m3Result
                ? m3Result.isIncrease
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                : isDark ? 'bg-[#161a22] border-gray-800 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-400'
            }`}>
              {m3Result ? (
                <>
                  {m3Result.isIncrease ? <TrendingUp className="w-4 h-4 shrink-0" /> : <TrendingDown className="w-4 h-4 shrink-0" />}
                  <span>{m3Result.isIncrease ? '+' : ''}{parseFloat(m3Result.percent.toFixed(2))}%</span>
                </>
              ) : (
                '—'
              )}
            </div>
          </div>
        </div>

        {m3Result && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#1e232e] text-xs text-gray-400 font-mono">
            Formula: [({m3Final} − {m3Initial}) ÷ |{m3Initial}|] × 100 = {m3Result.diff >= 0 ? `+${m3Result.diff}` : m3Result.diff} difference ({m3Result.isIncrease ? 'Increase' : 'Decrease'} of {Math.abs(parseFloat(m3Result.percent.toFixed(2)))}%)
          </div>
        )}
      </div>
    </div>
  );
};
