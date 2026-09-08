import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Gift,
  Clock,
  Sparkles,
  CalendarDays,
  Compass,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const AgeCalculator: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Default date: 25 years ago
  const defaultBirthDate = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 25);
    return d.toISOString().split('T')[0];
  })();

  const todayString = new Date().toISOString().split('T')[0];

  const [birthDateStr, setBirthDateStr] = useState<string>(defaultBirthDate);
  const [targetDateStr, setTargetDateStr] = useState<string>(todayString);

  // Exact calendar calculation
  const calculations = useMemo(() => {
    if (!birthDateStr || !targetDateStr) return null;

    const birth = new Date(birthDateStr + 'T00:00:00');
    const target = new Date(targetDateStr + 'T00:00:00');

    if (isNaN(birth.getTime()) || isNaN(target.getTime())) return null;
    if (birth > target) {
      return { isFuture: true };
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      // Get previous month's days count
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Total milliseconds
    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMonths = years * 12 + months;

    // Day of the week born
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const bornDayOfWeek = daysOfWeek[birth.getDay()];

    // Next Birthday countdown
    let nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday.setFullYear(target.getFullYear() + 1);
    }
    const daysUntilNextBday = Math.ceil(
      (nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
    );
    const nextBdayWeekday = daysOfWeek[nextBday.getDay()];

    return {
      isFuture: false,
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      totalHours,
      bornDayOfWeek,
      daysUntilNextBday,
      nextBdayWeekday,
      nextBdayDate: nextBday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
  }, [birthDateStr, targetDateStr]);

  return (
    <div className="w-full space-y-6">
      {/* Date Pickers */}
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#12151c] border-[#222733]' : 'bg-white border-gray-200'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-400 block mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>Date of Birth</span>
            </label>
            <input
              type="date"
              value={birthDateStr}
              onChange={(e) => setBirthDateStr(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none focus:border-indigo-500 ${
                isDark ? 'bg-[#181c24] border-[#262c3a] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 block mb-1.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-500" />
              <span>Calculate Age On (Reference Date)</span>
            </label>
            <input
              type="date"
              value={targetDateStr}
              onChange={(e) => setTargetDateStr(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none focus:border-indigo-500 ${
                isDark ? 'bg-[#181c24] border-[#262c3a] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
          </div>
        </div>
      </div>

      {calculations?.isFuture ? (
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-500 text-sm font-medium text-center">
          The date of birth entered is in the future relative to the reference date. Please select a valid past birth date.
        </div>
      ) : calculations ? (
        <div className="space-y-6">
          {/* Main Primary Age Hero */}
          <div className={`p-6 sm:p-8 rounded-2xl border text-center relative overflow-hidden ${
            isDark ? 'bg-gradient-to-b from-[#141822] to-[#101319] border-indigo-500/30' : 'bg-gradient-to-b from-indigo-50/50 to-white border-indigo-200'
          }`}>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-2">
              Your Chronological Age
            </div>

            <div className="flex flex-wrap items-baseline justify-center gap-2 sm:gap-4 my-2">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white">
                  {calculations.years}
                </span>
                <span className="text-sm sm:text-base font-semibold text-gray-500">years</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200">
                  {calculations.months}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-gray-500">months</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200">
                  {calculations.days}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-gray-500">days</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-2">
              You were born on a <span className="font-bold text-indigo-400">{calculations.bornDayOfWeek}</span>.
            </p>
          </div>

          {/* Next Birthday Card & Milestone Countdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-5 rounded-2xl border flex items-center gap-4 ${isDark ? 'bg-[#12151c] border-[#222733]' : 'bg-white border-gray-200'}`}>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-medium">Next Birthday</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                  {calculations.daysUntilNextBday === 0 ? 'Today! 🎉' : `in ${calculations.daysUntilNextBday} days`}
                </div>
                <div className="text-xs text-gray-500">
                  {calculations.nextBdayDate} ({calculations.nextBdayWeekday})
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border flex items-center gap-4 ${isDark ? 'bg-[#12151c] border-[#222733]' : 'bg-white border-gray-200'}`}>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-medium">Life Elapsed (Days)</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                  {calculations.totalDays.toLocaleString()} days lived
                </div>
                <div className="text-xs text-gray-500">
                  Approx {calculations.totalWeeks.toLocaleString()} weeks
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Units Breakdown */}
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#12151c] border-[#222733]' : 'bg-white border-gray-200'}`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              Comprehensive Breakdown
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#181c24] border-[#262c3a]' : 'bg-gray-50 border-gray-200'}`}>
                <div className="text-[11px] text-gray-400">Total Months</div>
                <div className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                  {calculations.totalMonths.toLocaleString()}
                </div>
              </div>
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#181c24] border-[#262c3a]' : 'bg-gray-50 border-gray-200'}`}>
                <div className="text-[11px] text-gray-400">Total Weeks</div>
                <div className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                  {calculations.totalWeeks.toLocaleString()}
                </div>
              </div>
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#181c24] border-[#262c3a]' : 'bg-gray-50 border-gray-200'}`}>
                <div className="text-[11px] text-gray-400">Total Days</div>
                <div className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                  {calculations.totalDays.toLocaleString()}
                </div>
              </div>
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#181c24] border-[#262c3a]' : 'bg-gray-50 border-gray-200'}`}>
                <div className="text-[11px] text-gray-400">Total Hours</div>
                <div className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                  {calculations.totalHours.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
