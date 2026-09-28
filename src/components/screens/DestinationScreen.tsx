import React, { useState } from 'react';
import { MapPin, ArrowRight, ArrowLeftRight, Briefcase, Save, Check } from 'lucide-react';
import { POPULAR_ROUTES, PURPOSES } from '../../data/mockData';
import { PurposeType } from '../../types';

interface DestinationScreenProps {
  from: string;
  to: string;
  purpose: PurposeType | '';
  onChangeFrom: (from: string) => void;
  onChangeTo: (to: string) => void;
  onChangePurpose: (purpose: PurposeType) => void;
  onSave: () => void;
  onSaveAndNext?: () => void;
  onNavigateHome?: () => void;
}

export const DestinationScreen: React.FC<DestinationScreenProps> = ({
  from,
  to,
  purpose,
  onChangeFrom,
  onChangeTo,
  onChangePurpose,
  onSave,
  onSaveAndNext,
}) => {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSwap = () => {
    const temp = from;
    onChangeFrom(to);
    onChangeTo(temp);
  };

  const handleSelectRoute = (route: { from: string; to: string }) => {
    onChangeFrom(route.from);
    onChangeTo(route.to);
    setErrorMessage(null);
  };

  const handleSaveClick = () => {
    if (!from.trim() || !to.trim()) {
      setErrorMessage('Please enter both origin and destination cities to continue.');
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
      {/* Title with Location Icon */}
      <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#1746A2]">
          <MapPin className="w-5 h-5 stroke-[2.5]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Destination
        </h2>
      </div>

      {/* From -> To Inputs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* From Input */}
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            From
          </label>
          <div className="relative flex items-center">
            <MapPin className="w-4 h-4 text-blue-600 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={from}
              onChange={(e) => onChangeFrom(e.target.value)}
              placeholder="Enter origin city"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/60 focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        {/* Swap / Arrow button */}
        <div className="self-center sm:self-end sm:mb-1.5">
          <button
            type="button"
            onClick={handleSwap}
            title="Swap cities"
            className="p-2 sm:p-2.5 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <ArrowLeftRight className="w-4 h-4 sm:hidden" />
            <ArrowRight className="hidden sm:block w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* To Input */}
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            To
          </label>
          <div className="relative flex items-center">
            <MapPin className="w-4 h-4 text-blue-600 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={to}
              onChange={(e) => onChangeTo(e.target.value)}
              placeholder="Enter destination city"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/60 focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Top Suggestions (Most Popular Routes) */}
      <div>
        <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-2.5">
          Top Suggestions (Most Popular Routes)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {POPULAR_ROUTES.slice(0, 6).map((route, idx) => {
            const isSelected = from === route.from && to === route.to;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectRoute(route)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-2xs font-semibold'
                    : 'bg-white hover:bg-gray-50/80 border-gray-200 text-gray-700 hover:border-blue-300'
                }`}
              >
                <span>{route.from}</span>
                <span className="text-gray-400 font-bold px-1.5">➔</span>
                <span>{route.to}</span>
              </button>
            );
          })}
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
          {/* Custom Chevron */}
          <div className="absolute right-3.5 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Clean Route Confirmation Badge */}
      {from && to && (
        <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs sm:text-sm text-blue-900">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Selected Journey: <strong>{from}</strong> to <strong>{to}</strong></span>
            {purpose && <span className="text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200 font-medium">For: {purpose}</span>}
          </div>
          <span className="text-blue-600 font-medium text-xs">Route ready</span>
        </div>
      )}

      {/* Error Message if empty */}
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
