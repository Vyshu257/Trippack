import React, { useState } from 'react';
import { Calendar, Briefcase, Save, Check } from 'lucide-react';
import { PURPOSES } from '../../data/mockData';
import { PurposeType } from '../../types';

interface DurationScreenProps {
  months: number;
  weeks: number;
  days: number;
  purpose: PurposeType | '';
  onChangeMonths: (val: number) => void;
  onChangeWeeks: (val: number) => void;
  onChangeDays: (val: number) => void;
  onChangePurpose: (val: PurposeType) => void;
  onSave: () => void;
  onSaveAndNext?: () => void;
}

export const DurationScreen: React.FC<DurationScreenProps> = ({
  months,
  weeks,
  days,
  purpose,
  onChangeMonths,
  onChangeWeeks,
  onChangeDays,
  onChangePurpose,
  onSave,
  onSaveAndNext,
}) => {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Compute total days summary
  const totalDays = (months * 30) + (weeks * 7) + days;

  const handleSaveClick = () => {
    if (months === 0 && weeks === 0 && days === 0) {
      setErrorMessage('Please enter duration! Select at least 1 day, week, or month to continue.');
      return;
    }

    setErrorMessage(null);
    onSave();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      if (onSaveAndNext) {
        onSaveAndNext();
      }
    }, 400);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-blue-100/90 shadow-xs p-5 sm:p-7 flex flex-col gap-6">
      {/* Title with Calendar Icon */}
      <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#1746A2]">
          <Calendar className="w-5 h-5 stroke-[2.5]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Duration
        </h2>
      </div>

      {/* Select Duration */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-xs sm:text-sm font-bold text-gray-800">
            Select Duration
          </label>
          {totalDays > 0 && (
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              Total: {totalDays} {totalDays === 1 ? 'day' : 'days'}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {/* Months Dropdown */}
          <div className="bg-gray-50/70 p-3 sm:p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Months</span>
            </div>
            <div className="relative">
              <select
                value={months}
                onChange={(e) => onChangeMonths(Number(e.target.value))}
                className="w-full py-2 pl-3 pr-7 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 appearance-none cursor-pointer"
              >
                {Array.from({ length: 13 }).map((_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Weeks Dropdown */}
          <div className="bg-gray-50/70 p-3 sm:p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Weeks</span>
            </div>
            <div className="relative">
              <select
                value={weeks}
                onChange={(e) => onChangeWeeks(Number(e.target.value))}
                className="w-full py-2 pl-3 pr-7 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 appearance-none cursor-pointer"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Days Dropdown */}
          <div className="bg-gray-50/70 p-3 sm:p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Days</span>
            </div>
            <div className="relative">
              <select
                value={days}
                onChange={(e) => onChangeDays(Number(e.target.value))}
                className="w-full py-2 pl-3 pr-7 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 appearance-none cursor-pointer"
              >
                {Array.from({ length: 32 }).map((_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purpose */}
      <div>
        <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-2">
          Purpose
        </label>
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-blue-600 pointer-events-none">
            <Briefcase className="w-4 h-4" />
          </div>
          <select
            value={purpose}
            onChange={(e) => onChangePurpose(e.target.value as PurposeType)}
            className="w-full pl-10 pr-9 py-2.5 bg-gray-50/60 focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
          >
            <option value="" disabled>Select purpose</option>
            {PURPOSES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <p className="mt-1.5 text-xs text-gray-500">
          (Automatically filled if you selected it in Destination page)
        </p>
      </div>

      {/* Error message if 0 duration */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Bottom Save Action */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSaveClick}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1746A2] hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold rounded-xl shadow-xs transition-all duration-150 cursor-pointer hover:shadow-md"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 stroke-[2.2]" />
              <span>Save</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
